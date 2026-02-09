export const camposProductsSic = [
  {
    id: "idProductSic",
    headerTitle: "ID",
    placeholder: "Ingrese el ID",
    size: 4,
    required: true,
  },
  {
    id: "jdeCode",
    headerTitle: "Código JDE",
    placeholder: "Ingrese el código JDE",
    size: 4,
    required: true,
  },
  {
    id: "jdeName",
    headerTitle: "Nombre JDE",
    placeholder: "Ingrese el nombre JDE",
    size: 4,
    required: true,
  },
  {
    id: "companyLine",
    headerTitle: "Linea de Negocio",
    placeholder: "Ingrese la linea de negocio",
    size: 4,
    required: true,
  },
  {
    id: "designLine",
    headerTitle: "Linea de Diseño",
    placeholder: "Ingrese la linea de diseño",
    size: 4,
    required: true,
  },
  {
    id: "brand",
    headerTitle: "Marca",
    placeholder: "Ingrese la marca",
    size: 4,
    required: true,
  },
  {
    id: "category",
    headerTitle: "Categoria",
    placeholder: "Ingrese la categoria",
    size: 4,
    required: true,
  },
  {
    id: "subCategory",
    headerTitle: "Subcategoria",
    placeholder: "Ingrese la subcategoria",
    size: 4,
    required: true,
  },
  {
    id: "marModelLm",
    headerTitle: "Mar Modelo Im",
    placeholder: "Ingrese el mar modelo im",
    size: 4,
    required: true,
  },
  {
    id: "equivalentProId",
    headerTitle: "Pro Id Equivalencia",
    placeholder: "Ingrese el pro id equivalencia",
    size: 4,
    required: true,
  },
  {
    id: "equivalent",
    headerTitle: "Equivalente",
    placeholder: "Ingrese el equivalente",
    size: 4,
    required: true,
  },
  {
    id: "validity",
    headerTitle: "Vigencia",
    placeholder: "Ingrese la vigencia",
    size: 4,
    required: true,
  },
];

export const camposStoresSic = [
  {
    id: "storeCode",
    headerTitle: "Código Tienda",
    placeholder: "Ingrese el código de la tienda",
    required: true,
    size: 4,
  },
  {
    id: "storeName",
    headerTitle: "Nombre Tienda",
    placeholder: "Ingrese el nombre de la tienda",
    size: 4,
    required: true,
  },
  {
    id: "distributor2",
    headerTitle: "Distribuidor 2",
    placeholder: "Ingrese el distribuidor 2",
    size: 4,
    required: true,
  },
  {
    id: "distributorSap",
    headerTitle: "Distribuidor SAP",
    placeholder: "Ingrese el distribuidor SAP",
    size: 4,
    required: true,
  },
  {
    id: "endChannel",
    headerTitle: "Canal de Venta",
    placeholder: "Ingrese el canal de venta",
    size: 4,
    required: true,
  },
  {
    id: "wholesaleRegion",
    headerTitle: "Región de Venta",
    placeholder: "Ingrese la región de venta",
    size: 4,
    required: true,
  },
  {
    id: "city",
    headerTitle: "Ciudad",
    placeholder: "Ingrese la ciudad",
    size: 4,
    required: true,
  },
  {
    id: "region",
    headerTitle: "Región",
    placeholder: "Ingrese la región",
    size: 4,
    required: true,
  },
  {
    id: "category",
    headerTitle: "Categoría",
    placeholder: "Ingrese la categoría",
    size: 4,
    required: true,
  },
  {
    id: "province",
    headerTitle: "Provincia",
    placeholder: "Ingrese la provincia",
    size: 4,
    required: true,
  },
  {
    id: "zone",
    headerTitle: "Zona ok",
    placeholder: "Ingrese la zona ok",
    size: 4,
    required: true,
  },
];

export const columnsProductsSic = [
  {
    field: "codigoJde",
    label: "Código JDE",
    type: "string",
  },
  {
    field: "nombreIme",
    label: "Nombre IME",
    type: "string",
  },
  {
    field: "codigoSap",
    label: "Código SAP",
    type: "string",
  },
  {
    field: "nombreSap",
    label: "Nombre SAP",
    type: "string",
  },
  {
    field: "lineaNegocioSap",
    label: "Linea de Negocio SAP",
    type: "string",
  },
  {
    field: "marModeloIm",
    label: "Modelo",
    type: "string",
  },
  {
    field: "proIdEquivalencia",
    label: "Pro Id Equivalencia",
    type: "string",
  },
  {
    field: "equivalencia",
    label: "Equivalencia",
    type: "string",
  },
  {
    field: "descontinuado",
    label: "Desc.",
    type: "string",
  },

];

export const columnsStoresSic = [
  {
    field: "codAlmacen",
    label: "Código Almacén",
    type: "string",
  },
  {
    field: "nombreAlmacen",
    label: "Nombre Almacén",
    type: "string",
  },
  {
    field: "distribSap",
    label: "Distribuidor SAP",
    type: "string",
  },
  {
    field: "distribuidor",
    label: "Distribuidor",
    type: "string",
  },
  {
    field: "categoria",
    label: "Categoria",
    type: "string",
  },
  {
    field: "ciudad",
    label: "Subcategoria",
    type: "string",
  },
  {
    field: "region",
    label: "Mar Modelo Im",
    type: "string",
  },
];

export const paramsValidateStoresSic = [
  "storeCode",
  "storeName",
  "distributor2",
  "distributorSap",
  "endChannel",
  "wholesaleRegion",
  "city",
  "region",
  "category",
  "province",
];

export const paramsValidateProductsSic = [
  "idProductSic",
  "jdeCode",
  "jdeName",
  "companyLine",
  "designLine",
  "brand",
  "category",
  "subCategory",
  "marModelLm",
  "equivalentProId",
  "equivalent",
  "validity",
];
