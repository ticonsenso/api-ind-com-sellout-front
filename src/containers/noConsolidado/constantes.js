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
    boxShadow: "none", // Remove default shadow
    backgroundColor: "transparent",
    border: "none",

    // Header Styling
    "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "#0072CE", // Brand Blue
        color: "#ffffff",
        fontWeight: 700,
        fontSize: "0.85rem",
        borderBottom: "none",
        borderRadius: "8px 8px 0 0", // Rounded top corners
    },
    "& .MuiDataGrid-columnHeader": {
        backgroundColor: "#0072CE", // Ensure bg color covers all
        color: "#ffffff",
    },
    "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
        outline: "none",
    },
    "& .MuiDataGrid-iconSeparator": {
        display: "none", // Clean look
    },
    "& .MuiDataGrid-menuIcon": {
        color: "#ffffff",
    },
    "& .MuiDataGrid-sortIcon": {
        color: "#ffffff",
        opacity: 0.8,
    },

    // Row & Cell Styling
    "& .MuiDataGrid-row": {
        backgroundColor: "#ffffff",
        marginBottom: "2px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
        borderBottom: "1px solid #f1f5f9",
        minHeight: "60px !important", // Enforce taller appearance
        "&:hover": {
            backgroundColor: "#f8fafc",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            zIndex: 1,
        },
        transition: "all 0.2s ease",
    },
    "& .MuiDataGrid-cell": {
        color: "#334155",
        fontSize: "0.875rem",
        borderBottom: "none",
        padding: "18px 16px", // Increased padding for height
        display: "flex",
        alignItems: "center",
        whiteSpace: "normal !important",
        wordWrap: "break-word !important",
        lineHeight: "1.5",
    },
    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
        outline: "none",
    },

    // Pagination
    "& .MuiDataGrid-footerContainer": {
        borderTop: "none",
        justifyContent: "flex-end",
        marginTop: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "8px 16px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
};