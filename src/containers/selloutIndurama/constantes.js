export const columnsMaestrosStores = [
  {
    field: "distributor",
    label: "Distribuidor",
    type: "string",
  },
  {
    field: "storeDistributor",
    label: "Almacen Distribuidor",
    type: "string",
  },
  // {
  //   field: "searchStore",
  //   label: "Busqueda Almacen",
  // },
  {
    field: "codeStoreSic",
    label: "Cod. Almacen SIC",
    type: "string",
  },
  {
    field: "status",
    label: "Estado",
    type: "string",
  },
];

export const columnsConfiguracion = [
  {
    field: "name",
    label: "Nombre",
  },
  {
    field: "description",
    label: "Descripción",
  },
  {
    field: "sourceType",
    label: "Tipo de fuente",
  },
  {
    field: "codeStoreDistributor",
    label: "Código Almacén Distribuidor",
  },
  {
    field: "distributorCompanyName",
    label: "Nombre Distribuidor",
  },
];

export const columnsMaestrosProducts = [
  {
    field: "distributor",
    label: "Distribuidor",
    type: "string",
  },
  {
    field: "productStore",
    label: "Producto Almacen",
    type: "string",
  },
  {
    field: "productDistributor",
    label: "Descripción Producto Almacen",
    type: "string",
  },
  // {
  //   field: "searchProductStore",
  //   label: "Busqueda Producto",
  // },
  {
    field: "codeProductSic",
    label: "Cod. Producto SIC",
    type: "string",
  },
  {
    field: "status",
    label: "Estado",
  },
];

export const EXTRACTION_FREQUENCY = [
  {
    label: "Diaria",
    id: "Diario",
  },
  {
    label: "Semanal",
    id: "Semanal",
  },
  {
    label: "Mensual",
    id: "Mensual",
  },
];

export const SOURCE_TYPE_SELLOUT = [
  {
    label: "Archivo Excel",
    id: "FILE",
  },
  {
    label: "PDF",
    id: "PDF",
  },
  {
    label: "Imagen",
    id: "IMAGE",
  },
];

export const DATATYPE = [
  {
    label: "Texto",
    id: "TEXT",
  },
  {
    label: "Numerico",
    id: "INTEGER",
  },
  {
    label: "Decimal",
    id: "DECIMAL",
  },
  {
    label: "Fecha",
    id: "DATE",
  },
  {
    label: "Fecha y Hora",
    id: "DATETIME",
  },
  {
    label: "Booleano",
    id: "BOOLEAN",
  },
  {
    label: "Email",
    id: "EMAIL",
  },
  {
    label: "Teléfono",
    id: "PHONE",
  },
];

export const camposConfiguracion = [
  {
    id: "distributorCompanyName",
    headerTitle: "Nombre Distribuidor",
    placeholder: "Ingrese el nombre del distribuidor",
    size: 4,
    disabled: true,
    error: false,
  },
  {
    id: "codeStoreDistributor",
    headerTitle: "Código Almacén Distribuidor",
    placeholder: "Ingrese el código del almacén...",
    size: 4,
    disabled: true,
  },
  {
    id: "name",
    headerTitle: "Nombre Configuración",
    placeholder: "Ingrese el nombre",
    size: 4,
    required: true,
  },
  {
    id: "sheetName",
    headerTitle: "Nombre de hoja excel",
    placeholder: "Ingrese el nombre de la hoja",
    size: 4,
    required: false,
    error: false,
  },
  // {
  //   id: "description",
  //   headerTitle: "Descripción configuración",
  //   placeholder: "Ingrese la descripción",
  //   size: 4,
  //   rows: 3,
  //   error: false,
  // },
];

export const camposParam = [
  {
    id: "columnLetter",
    headerTitle: "Letra Columna",
    placeholder: "Ejemplo: A, B, C...",
    required: true,
    type: "text",
    size: 6,
  },
  {
    id: "startRow",
    headerTitle: "Fila Inicio",
    placeholder: "Número de fila de inicio",
    type: "number",
    required: true,
    size: 6,
  },
];

export const mesesNum = [
  { nombre: "enero", numero: 1 },
  { nombre: "febrero", numero: 2 },
  { nombre: "marzo", numero: 3 },
  { nombre: "abril", numero: 4 },
  { nombre: "mayo", numero: 5 },
  { nombre: "junio", numero: 6 },
  { nombre: "julio", numero: 7 },
  { nombre: "agosto", numero: 8 },
  { nombre: "septiembre", numero: 9 },
  { nombre: "octubre", numero: 10 },
  { nombre: "noviembre", numero: 11 },
  { nombre: "diciembre", numero: 12 },
];

export const paramsValidateConfiguracion = ["name", "sourceType"];
export const columnsExtraccion = [
  {
    field: "nombreColumna",
    label: "Dato a extraer",
  },
  {
    field: "columnLetter",
    label: "Letra Columna",
  },
  {
    field: "startRow",
    label: "Fila Inicio",
  },
];
export const paramsValidateColums = [
  "mappingToField",
  "columnLetter",
  "startRow",
];

export const DAYS = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  return {
    label: day,
    id: day,
  };
});

export const columnsPlantillaStandar = [
  {
    field: "distributor",
    label: "Distribuidor",
  },
  {
    field: "codeStoreDistributor",
    label: "Cod. Almacen Distribuidor",
  },
  {
    field: "codeProductDistributor",
    label: "Cod. Prod. Distribuidor",
  },
  {
    field: "descriptionDistributor",
    label: "Descripción Distribuidor",
  },
  {
    field: "unitsSoldDistributor",
    label: "Unidades Venta Distribuidor",
  },
  {
    field: "saleDate",
    label: "Fecha Ultimo día mes",
  },
  {
    field: "codeStore",
    label: "Cod. Almacen",
  },
  {
    field: "codeProduct",
    label: "Cod. Producto",
  },
  {
    field: "distributor",
    label: "Distribuidor",
  },
  {
    field: "storeName",
    label: "Nombre Almacen",
  },
  {
    field: "productModel",
    label: "Modelo Producto",
  },
  {
    field: "calculateDate",
    label: "Fecha Calculo",
  },
  {
    field: "status",
    label: "Aplica Homologación",
  },
];

export const stylesPlantillaStandar = {
  alert: {
    fontSize: 13,
    fontWeight: "600",
  },
  bold: {
    fontWeight: "500",
  },
  box: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    gap: 2,
  },
  containerAlert: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 2,
    padding: 1,
    height: "auto",
    mb: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
};

export const columnsProductNull = [
  {
    field: "distributor",
    headerName: "Distribuidor",
    editable: false,
    flex: 1,
  },
  {
    field: "codeProductDistributor",
    headerName: "Producto Almacen",
    editable: false,
    flex: 1,
  },
  {
    field: "descriptionDistributor",
    headerName: "Descripción Producto Almacen",
    editable: false,
    flex: 1,
  },

  {
    field: "searchProduct",
    headerName: "Busqueda Producto",
    editable: false,
    flex: 1,
  },
  {
    field: "codeProduct",
    headerName: "Cod. Producto SIC",
    editable: true,
    flex: 1,
  },
  {
    field: "productModel",
    headerName: "Modelo de producto",
    editable: false,
    flex: 1,
  },
];

export const columnsStoreNull = [
  {
    field: "distributor",
    headerName: "Distribuidor",
    width: 200,
    flex: 1,
    editable: false,
  },
  {
    field: "codeStoreDistributor",
    headerName: "Almacén Distribuidor",
    width: 200,
    flex: 1,
    editable: false,
  },
  {
    field: "searchStore",
    headerName: "Busqueda Almacen",
    width: 200,
    flex: 1,
    editable: false,
  },
  {
    field: "codeStore",
    headerName: "Cod. Almacen SIC",
    width: 200,
    flex: 1,
    editable: true,
  },
  {
    field: "storeName",
    headerName: "Nombre Almacen",
    width: 200,
    flex: 1,
    editable: false,
  },
];

export const paramsValidatePlantillaStandar = [
  "distributor",
  "codeStoreDistributor",
  "codeProductDistributor",
  "descriptionDistributor",
  "unitsSoldDistributor",
  "saleDate",
];

export const camposPlantillaStandar = [
  {
    id: "distributor",
    headerTitle: "Distribuidor",
    placeholder: "Ingrese el distribuidor",
    size: 6,
    required: true,
  },
  {
    id: "codeStoreDistributor",
    headerTitle: "Cod. Almacen Distribuidor",
    placeholder: "Ingrese el código del almacén...",
    size: 6,
    required: true,
  },
  {
    id: "codeProductDistributor",
    headerTitle: "Cod. Producto Distribuidor",
    placeholder: "Ingrese el código del producto...",
    size: 6,
    required: true,
  },
  {
    id: "descriptionDistributor",
    headerTitle: "Descripción Producto Distribuidor",
    placeholder: "Ingrese la descripción del producto...",
    size: 6,
    required: true,
  },
  {
    id: "unitsSoldDistributor",
    headerTitle: "Unidades Venta Distribuidor",
    placeholder: "Ingrese el número de unidades vendidas...",
    size: 6,
    type: "number",
    required: true,
  },
];

export const columnsPresupuestoSellout = [
  {
    field: "codeSupervisor",
    label: "Cod. SUPERVISOR",
  },
  {
    field: "codeZone",
    label: "Cod. Zonal",
  },
  {
    field: "storeCode",
    label: "Cod Almacen",
  },
  {
    field: "promotorCode",
    label: "Cod. Promotor",
  },
  {
    field: "codePromotorPi",
    label: "COD. PROMOTOR PI.",
  },
  {
    field: "codePromotorTv",
    label: "COD. PROMOTOR TV",
  },
  {
    field: "equivalentCode",
    label: "Codigo Equivalente",
  },
  {
    field: "units",
    label: "UND",
  },
  {
    field: "unitBase",
    label: "UB",
  },
];

export const camposPresupuestoSellout = [
  {
    id: "codeSupervisor",
    headerTitle: "Código Supervisor",
    size: 6,
    required: true,
  },
  {
    id: "codeZone",
    headerTitle: "Código Zona",
    size: 6,
    required: true,
  },
  {
    id: "storeCode",
    headerTitle: "Código Almacén",
    size: 6,
    required: true,
  },
  {
    id: "promotorCode",
    headerTitle: "Código Promotor",
    size: 6,
    required: true,
  },
  {
    id: "codePromotorPi",
    headerTitle: "Código Promotor Pi",
    size: 6,
    required: true,
  },
  {
    id: "codePromotorTv",
    headerTitle: "Código Promotor Tv",
    size: 6,
    required: true,
  },
  {
    id: "equivalentCode",
    headerTitle: "Código Equivalente",
    size: 6,
    required: true,
  },
  {
    id: "units",
    headerTitle: "Unidades",
    size: 6,
    type: "number",
    required: true,
  },
  {
    id: "unitBase",
    headerTitle: "Unidades Base",
    size: 6,
    type: "number",
    required: true,
  },
];

export const columnsValoresSellout = [
  {
    field: "brand",
    label: "MARCA",
  },
  {
    field: "model",
    label: "MODELO",
  },
  {
    field: "unitBaseUnitary",
    label: "UB Unitaria",
    type: "dinero",
  },
  {
    field: "pvdUnitary",
    label: "PVD Unt",
    type: "dinero",
  },
];

export const camposValoresSellout = [
  {
    id: "brand",
    headerTitle: "Marca",
    size: 6,
    required: true,
  },
  {
    id: "model",
    headerTitle: "Modelo",
    size: 6,
    required: true,
  },
  {
    id: "unitBaseUnitary",
    headerTitle: "UB Unitaria",
    size: 6,
    required: true,
  },
  {
    id: "pvdUnitary",
    headerTitle: "PVD Unt",
    size: 6,
    required: true,
  },
];

export const allMonths = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const meses = [
  { id: "01", label: "Enero" },
  { id: "02", label: "Febrero" },
  { id: "03", label: "Marzo" },
  { id: "04", label: "Abril" },
  { id: "05", label: "Mayo" },
  { id: "06", label: "Junio" },
  { id: "07", label: "Julio" },
  { id: "08", label: "Agosto" },
  { id: "09", label: "Septiembre" },
  { id: "10", label: "Octubre" },
  { id: "11", label: "Noviembre" },
  { id: "12", label: "Diciembre" },
];

export const optionsRegional = [
  { id: null, label: "No definido" },
  { id: "COSTA", label: "Costa" },
  { id: "SIERRA", label: "Sierra" },
];
