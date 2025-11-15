export const columnsProductNoHomologado = [
    {
        field: "distributor",
        label: "Distribuidor",

    },
    {
        field: "codeProductDistributor",
        label: "Producto Almacen",

    },
    {
        field: "descriptionDistributor",
        label: "Descripción Producto Almacen",

    },

    {
        field: "unitsSoldDistributor",
        label: "Unidades",

    },
];

export const columnsStoreNoHomologado = [
    {
        field: "distributor",
        label: "Distribuidor",

    },
    {
        field: "codeStoreDistributor",
        label: "Almacén Distribuidor",
    },
    // {
    //     field: "searchStore",
    //     label: "Busqueda Almacen",

    // },
    {
        field: "codeStore",
        label: "Cod. Almacen SIC",

    },
    // {
    //     field: "storeName",
    //     label: "Nombre Almacen",
    //     width: 200,
    //     flex: 1,
    //     editable: false,
    // },
];

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
        field: "codeProduct",
        headerName: "Cod. Producto SIC",
        editable: true,
        flex: 1,
    },
    // {
    //     field: "productModel",
    //     headerName: "Modelo de producto",
    //     editable: false,
    //     flex: 1,
    // },
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
        field: "codeStore",
        headerName: "Cod. Almacen SIC",
        width: 200,
        flex: 1,
        editable: true,
    },
    // {
    //     field: "storeName",
    //     headerName: "Nombre Almacen",
    //     width: 200,
    //     flex: 1,
    //     editable: false,
    // },
];

export const styleTableData = {
    width: "100%",
    boxShadow: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 3,
    border: "none",
    "& .MuiDataGrid-columnHeader": {
        backgroundColor: "#ffffffff",
        color: "#575757ff",
        height: "56px",
        fontSize: 15
    },
    "& .MuiDataGrid-columnHeader:hover": {
        backgroundColor: "#f5f5f5",
    },
    "& .MuiDataGrid-cell": {
        color: "#646464ff",
        fontSize: "14px",
        pt: 1,
        pb: 1,
    },
    "& .MuiDataGrid-cell:hover": {
        color: "#434343",
        backgroundColor: "#f5f5f5",
    },
};