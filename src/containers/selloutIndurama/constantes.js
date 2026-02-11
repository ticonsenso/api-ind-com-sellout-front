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
  // {
  //   id: "distributorCompanyName",
  //   headerTitle: "Nombre Distribuidor",
  //   placeholder: "Ingrese el nombre del distribuidor",
  //   size: 4,
  //   disabled: true,
  //   error: false,
  // },
  {
    id: "codeStoreDistributor",
    headerTitle: "Código Almacén Distribuidor",
    placeholder: "Ingrese el código del almacén...",
    size: 4,
  },
  {
    id: "name",
    headerTitle: "Nombre Configuración",
    placeholder: "Ingrese el nombre",
    size: 4,
    required: true,
  },
  {
    id: "initialSheet",
    headerTitle: "Hoja Inicio",
    placeholder: "Por defecto la primera",
    size: 2,
    required: false,
    error: false,
  },
  {
    id: "endSheet",
    headerTitle: "Hoja Fin",
    placeholder: "Ingrese la hoja final a extraer",
    type: "number",
    required: false,
    size: 2,
  },
  {
    id: "sheetName",
    headerTitle: "Nombre Hoja",
    placeholder: "Nombre de la hoja",
    type: "text",
    required: true,
    size: 2,
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
  { label: "enero", id: 1 },
  { label: "febrero", id: 2 },
  { label: "marzo", id: 3 },
  { label: "abril", id: 4 },
  { label: "mayo", id: 5 },
  { label: "junio", id: 6 },
  { label: "julio", id: 7 },
  { label: "agosto", id: 8 },
  { label: "septiembre", id: 9 },
  { label: "octubre", id: 10 },
  { label: "noviembre", id: 11 },
  { label: "diciembre", id: 12 },
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
    type: "string"
  },
  {
    field: "codeStoreDistributor",
    label: "Cod. Almacen Distribuidor",
    type: "string"
  },
  {
    field: "codeProductDistributor",
    label: "Cod. Prod. Distribuidor",
    type: "string"
  },
  {
    field: "descriptionDistributor",
    label: "Descripción Distribuidor",
    type: "string"
  },
  {
    field: "unitsSoldDistributor",
    label: "Unidades Venta",
  },
  {
    field: "saleDate",
    label: "Fecha Venta",
    type: "date"
  },
  {
    field: "codeStore",
    label: "Cod. Almacen",
    type: "string"
  },
  {
    field: "codeProduct",
    label: "Cod. Producto",
    type: "string"
  },
  {
    field: "storeName",
    label: "Nombre Almacen",
    type: "string"
  },
  {
    field: "productModel",
    label: "Modelo Producto",
    type: "string"
  },
  {
    field: "lineaNegocio",
    label: "Linea Negocio",
    type: "string"
  },
  {
    field: "categoria",
    label: "Categoria",
    type: "string"
  },
  {
    field: "subCategoria",
    label: "Sub Categoria",
    type: "string"
  },
  {
    field: "modelo",
    label: "Modelo",
    type: "string"
  },
  {
    field: "nombreIme",
    label: "Nombre Ime",
    type: "string"
  },
  {
    field: "canal",
    label: "Canal",
    type: "string"
  },
  {
    field: "grupoComercial",
    label: "Grupo Comercial",
    type: "string"
  },
  {
    field: "nombreAlmacen",
    label: "Nombre Almacen",
    type: "string"
  },
  {
    field: "grupoZona",
    label: "Grupo Zona",
    type: "string"
  },
  {
    field: "zona",
    label: "Zona",
    type: "string"
  },
  {
    field: "categoriaAlmacen",
    label: "Categoria Almacen",
    type: "string"
  },
  {
    field: "supervisor",
    label: "Supervisor",
    type: "string"
  },
  {
    field: "observation",
    label: "Observación",
    type: "string"
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

export const columnsConfLines = [
  {
    field: "name",
    label: "Nombre",
    type: "string",
  },
  {
    field: "lineName",
    label: "Nombre Linea",
    type: "string",
  },
];

export const camposConfLines = [
  {
    id: "name",
    headerTitle: "Nombre",
    placeholder: "Ingrese el nombre",
    size: 6,
    required: true,
  },
  {
    id: "lineName",
    headerTitle: "Descripción",
    placeholder: "Ingrese la descripción",
    size: 6,
    required: true,
  },
];
