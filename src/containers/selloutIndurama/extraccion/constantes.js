
export const PALABRAS_INVALIDAS = [
  "cliente",
  "subtotal",
  "iva",
  "total",
  "total general",
  "datos",
  "producto",
  "vendedor",
  "dirección",
  "ruc",
  "dni",
  "pedido",
  "venta",
  "pago",
  "notas",
  "forma",
  "desde",
  "hasta",
  "orden",
  "fecha",
  "envío",
  "reporte",
  "(en blanco)",
  "local",
  "bodega",
  "almacen",
  "sucursal",
  "total productos",
  "total motorola",
  "#N/D",
  "n/a",
];

export const normalizarTexto = (texto = "") => {
  return texto
    .toString()
    .toLowerCase()
    .normalize("NFD") // separa tildes
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .replace(/\s+/g, "") // elimina todos los espacios
    .replace(/[^a-z0-9]/g, ""); // elimina símbolos
};

export const CAMPOS_CONFIG_ESTANDAR = [
  {
    id: "hojaInicio",
    headerTitle: "Inicio",
    type: "number",
    multiline: false,
    rows: 1,
    size: 1.5,
    placeholder: "Inicio/extracción",
  },
  {
    id: "hojaFin",
    headerTitle: "Fin",
    type: "number",
    multiline: false,
    rows: 1,
    size: 1.5,
    placeholder: "Fin Extracción",
  },
];

export const NOMBRES_CAMPOS = {
  saleDate: "FECHA",
  distributor: "DISTRIBUIDOR",
  codeStoreDistributor: "CÓDIGO DE ALMACÉN",
  codeProductDistributor: "CÓDIGO DE PRODUCTO",
  descriptionDistributor: "PRODUCTO",
  unitsSoldDistributor: "UNIDADES VENDIDAS",
};

export const etiquetasColumnas = {
  saleDate: "Fecha",
  distributor: "Distribuidor",
  codeStoreDistributor: "Almacén",
  codeProductDistributor: "Código producto",
  descriptionDistributor: "Detalle producto",
  unitsSoldDistributor: "Cant.",
  observation: "Observación",
};

export const columnsMatriculacion = [
  {
    label: "Distribuidor",
    field: "distributor",
  },
  {
    label: "Almacén",
    field: "storeName",
  },
  {
    label: "Fecha de registro",
    field: "createdAt",
    type: "date"
  },
  {
    label: "Cargado",
    field: "isUploaded",
  },
  {
    label: "Unidades Vendidas",
    field: "productCountTotal",
    type: "string"
  },
  {
    label: "# Filas",
    field: "rowCountTotal",
    type: "string"
  },
  {
    label: "Usuario carga",
    field: "user",
    type: "string"
  }
];

export const columnsDetallesMatriculacion = [
  {
    label: "Distribuidor",
    field: "distributor",
  },
  {
    label: "Almacén",
    field: "storeName",
  },
  {
    label: "Unidades Vendidas",
    field: "productCount",
    type: "string"
  },
  {
    label: "# Filas/Registros",
    field: "rowsCount",
    type: "string"
  },
  {
    label: "Usuario",
    field: "user",
    type: "string"

  }
];


export const optionsMappingToField = [
  { id: "distributor", label: "Distribuidor" },
  { id: "codeStoreDistributor", label: "Código de almacén" },
  { id: "codeProductDistributor", label: "Código de producto" },
  { id: "descriptionDistributor", label: "Detalle producto" },
  { id: "unitsSoldDistributor", label: "Cantidad" },
  { id: "saleDate", label: "Fecha" },
  { id: "saleDay", label: "Día" },
  { id: "saleMonth", label: "Mes" },
  { id: "saleYear", label: "Año" },
];

export const styles = {
  container: {
    p: 2,
    borderRadius: 2,
  },
  table: {
    borderRadius: 3,
    mt: 1,
  },
  tableCell: {
    backgroundColor: "#eaeaea",
    borderBottom: "1px solid #ffffff",
    minWidth: "20%",
  },
  typography: {
    fontWeight: 500,
    fontSize: "13px",
    color: "#6f6f6f",
    textTransform: "uppercase",
  },
  tableCellDetail: {
    borderBottom: "1px solid #eee",
    fontSize: "13px",
    fontWeight: 400,
    color: "#333",
    wordBreak: "break-word",
  },
  title: {
    fontWeight: 500,
    fontSize: "12px",
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
    backgroundColor: "details.main",
    borderRadius: 2,
    p: 1,
    minWidth: "20%",
  },
};

export const isClosed = (closingDate, startDate) => {
  const hoy = new Date();
  const cierre = new Date(closingDate + "T00:00:00");

  hoy.setHours(0, 0, 0, 0);
  cierre.setHours(0, 0, 0, 0);

  if (startDate) {
    const inicio = new Date(startDate + "T00:00:00");
    inicio.setHours(0, 0, 0, 0);
    // Para que esté abierto debe ser mayor o igual al inicio y menor o igual al cierre
    if (hoy < inicio || hoy > cierre) return "Cerrado ⛔";
    return "Abierto 🟢";
  }

  return hoy > cierre ? "Cerrado ⛔" : "Abierto 🟢";
};

export const formatDate = (fechaISO) => {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getUTCDate()).padStart(2, "0");
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const anio = fecha.getUTCFullYear();
  return `${anio}-${mes}-${dia}`;
};