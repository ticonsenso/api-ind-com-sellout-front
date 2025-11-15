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
  if (value === null || value === undefined || value === "") return "-";

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
  if (number) {
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
