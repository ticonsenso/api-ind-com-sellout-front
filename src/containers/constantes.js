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
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getUTCDate()).padStart(2, "0");
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const anio = fecha.getUTCFullYear();
  return `${anio}-${mes}-${dia}`;
};

export const formatValueByType = (value, type) => {
  console.log("fecha", value, type);
  if (value === null || value === undefined || value === "") return "-";

  if (type === "date") {
    const date = new Date(value);

    if (isNaN(date.getTime())) return "-";

    // Formato usando UTC para evitar desfases por zona horaria
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const number = parseFloat(value);

  if (type === "string") {
    return value;
  }

  if (type === "number") {
    return number.toLocaleString("es-EC", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (type === "dinero") {
    return number.toLocaleString("es-EC", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (type === "porcentaje") {
    return number.toLocaleString("es-EC", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (!isNaN(number)) {
    return number.toLocaleString("es-EC", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return value;
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

