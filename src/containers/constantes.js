export const validateForm = (form, camposRequeridos, setErrors) => {
  const newErrors = {};
  let isValid = true;

  camposRequeridos.forEach((campo) => {
    if (!form[campo]) {
      newErrors[campo] = true;
      isValid = false;
    }
  });

  setErrors(newErrors);
  return isValid;
};

export const pageGeneral = 1;
export const limitGeneral = 10;
export const timeSearch = 1500;
export const pageOptions = [10, 50, 100];
export const mensajeExtraccion =
  "Antes de guardar la extracción, confirme que los datos incluyen tanto la primera como la última fila de su archivo Excel.";

export const formatDate = (fechaISO) => {
  if (!fechaISO) return "-";

  let fecha;
  if (fechaISO instanceof Date) {
    fecha = fechaISO;
  } else if (typeof fechaISO === "string" && fechaISO.includes("/") && fechaISO.split("/").length === 3) {
    const parts = fechaISO.split("/");
    // Asumimos DD/MM/YYYY
    if (parts[0].length <= 2 && parts[2].length === 4) {
      fecha = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    } else {
      fecha = new Date(fechaISO);
    }
  } else {
    fecha = new Date(fechaISO);
  }

  if (isNaN(fecha.getTime())) return "-";

  const dia = String(fecha.getUTCDate()).padStart(2, "0");
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const anio = fecha.getUTCFullYear();
  return `${dia}-${mes}-${anio}`;
};

export const formatValueByType = (value, type) => {
  if (value === null || value === undefined || value === "") return "-";

  const isDate = Object.prototype.toString.call(value) === '[object Date]' || value instanceof Date;

  if (isDate) {
    if (isNaN(value.getTime())) return "-";
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  }

  if (typeof value === 'object' && typeof value.format === 'function') {
    return value.format("DD-MM-YYYY");
  }

  if (type === "date") {
    let date;
    if (typeof value === "string" && value.includes("/") && value.split("/").length === 3) {
      const parts = value.split("/");
      if (parts[0].length <= 2 && parts[2].length === 4) {
        date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else {
        date = new Date(value);
      }
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) return "-";

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  }

  const number = parseFloat(value);

  if (type === "string") {
    return String(value);
  }

  if (type === "number") {
    return isNaN(number) ? value : number.toLocaleString("es-EC", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (type === "dinero") {
    return isNaN(number) ? value : number.toLocaleString("es-EC", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (type === "porcentaje") {
    return isNaN(number) ? value : number.toLocaleString("es-EC", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (!isNaN(number) && typeof value !== 'string') {
    return number.toLocaleString("es-EC", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Fallback final: si el valor sigue siendo un objeto, lo convertimos a string para evitar Error #31
  return typeof value === "object" ? String(value) : value;
};


// busqueda con debounce
export function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

//funcion para fecha de cierre 
export const isMonthClosed = (closingDate) => {
  if (!closingDate) {
    return "cerrado";
  }
  const hoy = new Date();
  const cierre = new Date(closingDate);

  hoy.setHours(0, 0, 0, 0);
  cierre.setHours(0, 0, 0, 0);

  const cierreMasUno = new Date(cierre);
  cierreMasUno.setDate(cierreMasUno.getDate() + 2);

  return hoy >= cierreMasUno ? "cerrado" : "abierto";
};

export const getPreviousMonthStart = () => {
  const today = new Date();

  today.setMonth(today.getMonth() - 1);

  today.setDate(1);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = "01";

  return `${year}-${month}-${day}`;
};

export const formatIsoToDate = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const normalizeEncabezados = (str) => {
  return str
    .toString()
    .normalize("NFD")                         // separa tildes
    .replace(/[\u0300-\u036f]/g, "")         // elimina tildes
    .replace(/\s+/g, "")                     // elimina espacios
    .toLowerCase();                          // ignora may/min
};


export const formatIsoToDateTabla = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  // Se obtiene año, mes y día reales de la fecha en UTC
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const normalizeSpaces = (value = "") => {
  return value
    .replace(/\s+/g, " ")
    .trim();
};

export const cleanString = (value) => {
  if (typeof value !== "string") return value;
  const dict = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
    'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
    'Ä': 'A', 'Ë': 'E', 'Ï': 'I', 'Ö': 'O', 'Ü': 'U',
    'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u',
    'Â': 'A', 'Ê': 'E', 'Î': 'I', 'Ô': 'O', 'Û': 'U'
  };
  return value
    .replace(/[áéíóúÁÉÍÓÚäëïöüÄËÏÖÜâêîôûÂÊÎÔÛ]/g, match => dict[match])
    .replace(/\s+/g, " ")
    .trim();
};
