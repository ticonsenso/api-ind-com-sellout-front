// excelWorker.js

importScripts("https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.full.min.js");

self.onmessage = function (e) {
  const { arrayBuffer, columns } = e.data;

  try {
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets["valores"];
    const sheetData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      blankrows: false,
    });

    // Solo filas con datos
    const filteredRows = sheetData.filter(
      (row) => Array.isArray(row) && row.some((cell) => cell !== "")
    );

    // Buscar encabezado
    const expectedLabels = columns.map((col) => col.label.trim().toUpperCase());

    let headerRowIndex = -1;
    let headerIndexMap = {};
    let lastColumn = 0;

    for (let i = 0; i < Math.min(filteredRows.length, 20); i++) {
      const row = filteredRows[i].map((cell) =>
        typeof cell === "string"
          ? cell.trim().toUpperCase()
          : String(cell).trim().toUpperCase()
      );

      const matchedHeaders = expectedLabels.every((label) =>
        row.includes(label)
      );

      if (matchedHeaders) {
        headerRowIndex = i;
        expectedLabels.forEach((label) => {
          const index = row.indexOf(label);
          if (index !== -1) headerIndexMap[label] = index;
        });

        for (let j = row.length - 1; j >= 0; j--) {
          if (row[j] !== "") {
            lastColumn = j + 1;
            break;
          }
        }
        break;
      }
    }

    if (headerRowIndex === -1) {
      postMessage({ error: "No se encontró encabezado válido." });
      return;
    }

    const data = [];
    let emptyRowStreak = 0;

    for (let i = headerRowIndex + 1; i < filteredRows.length; i++) {
      const row = filteredRows[i];
      const rowValues = row.slice(0, lastColumn);

      if (rowValues.every((val) => val === "")) {
        emptyRowStreak++;
        if (emptyRowStreak >= 4) break;
        continue;
      }

      let emptyLeadingColumns = 0;
      for (let col = 0; col < rowValues.length; col++) {
        if (rowValues[col] === "") emptyLeadingColumns++;
        else break;
      }
      if (emptyLeadingColumns >= 4) break;

      const item = {};
      let hasData = false;

      columns.forEach(({ field, label }) => {
        const key = label.trim().toUpperCase();
        const index = headerIndexMap[key];
        const value = index !== undefined ? rowValues[index] ?? "" : "";
        item[field] = value;
        if (value !== "") hasData = true;
      });

      if (hasData) data.push(item);
    }

    postMessage({ data });
  } catch (error) {
    postMessage({ error: error.message });
  }
};
