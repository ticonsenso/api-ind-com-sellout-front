import * as XLSX from "xlsx";

export const procesarExcel = async (files) => {
    if (!files || !files.length) {
        alert("Seleccione archivos Excel");
        return;
    }

    const resultados = [];

    for (const file of files) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            rows.forEach((row) => {
                if (!Array.isArray(row)) return;

                const text = row.join(" ").trim();

                const regex =
                    /(\d+)\s+REGISTROS?\s*-\s*(.+?)\s+(\d{5,})\s+SUMAN\s+([\d,.]+)/i;

                const match = text.match(regex);
                if (!match) return;

                const [, , descripcion, codigo, cantidadString] = match;

                const cantidad = parseFloat(
                    cantidadString.replace(".", "").replace(",", ".")
                );

                resultados.push({
                    almacen: sheetName,
                    codigo,
                    producto: descripcion.trim(),
                    cantidad,
                    documento: file.name,
                });
            });
        });
    }

    const worksheet = XLSX.utils.json_to_sheet(resultados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "CONSOLIDADO");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "consolidado_productos.xlsx";
    link.click();
};
