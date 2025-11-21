
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
    size: 2,
    placeholder: "Inicio/extracción",
  },
  {
    id: "hojaFin",
    headerTitle: "Fin",
    type: "number",
    multiline: false,
    rows: 1,
    size: 2,
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
};

export const columnsMatriculacion = [
  {
    id: "distributor",
    label: "Distribuidor",
    field: "distributor",
  },
  {
    id: "storeName",
    label: "Almacén",
    field: "storeName",
  },
  {
    id: "createAt",
    label: "Fecha de registro",
    field: "createAt",
    type: "date"
  },
  {
    id: "isUploaded",
    label: "Cargado",
    field: "isUploaded",
  },
  {
    id: "productCount",
    label: "Unidades Vendidas",
    field: "productCountTotal",
    type: "string"
  },
  {
    id: "rowsCount",
    label: "# Filas",
    field: "rowCountTotal",
    type: "string"
  },
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
    backgroundColor: "#f9f9f9",
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

export const isClosed = (closingDate) => {
  const hoy = new Date();
  const cierre = new Date(closingDate);

  hoy.setHours(0, 0, 0, 0);
  cierre.setHours(0, 0, 0, 0);

  const cierreMasUno = new Date(cierre);
  cierreMasUno.setDate(cierreMasUno.getDate() + 2);

  return hoy >= cierreMasUno ? "Cerrado ⛔" : "Abierto 🟢";
};
