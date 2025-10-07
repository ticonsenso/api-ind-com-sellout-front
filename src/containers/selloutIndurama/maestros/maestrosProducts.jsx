import React from "react";
import AtomCard from "../../../atoms/AtomCard";
import AtomTableForm from "../../../atoms/AtomTableForm";
import { useEffect } from "react";
import AtomDialogForm from "../../../atoms/AtomDialogForm";
import AtomTextField from "../../../atoms/AtomTextField";
import AtomContainerGeneral from "../../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import ExcelJS from "exceljs";
import { useSnackbar } from "../../../context/SnacbarContext";
import AtomCircularProgress from "../../../atoms/AtomCircularProgress";
import {
  obtenerMaestrosProducts,
  updateMaestrosProducts,
  deleteMaestrosProducts,
  createMaestrosProducts,
  subirExcelMaestrosProducts,
  exportarExcel,
} from "../../../redux/configSelloutSlice";
import { columnsMaestrosProducts } from "../constantes";
import { useDispatch, useSelector } from "react-redux";
import { Typography, IconButton, Box, CircularProgress } from "@mui/material";
import { useDialog } from "../../../context/DialogDeleteContext";
import AtomSwitch from "../../../atoms/AtomSwitch";
import { DriveFolderUploadOutlined as DriveFolderUploadOutlinedIcon } from "@mui/icons-material";
import { limitGeneral } from "../../constantes";
import AtomTableInformationExtraccion from "../../../atoms/AtomTableInformationExtraccion";
import { useCallback } from "react";
import IconoFlotante from "../../../atoms/IconActionPage";

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const MasterProducts = () => {
  const dispatch = useDispatch();
  const { showDialog } = useDialog();
  const { showSnackbar } = useSnackbar();
  const dataMaestrosProducts = useSelector(
    (state) => state?.configSellout?.dataMaestrosProducts || []
  );
  const totalMaestrosProducts = useSelector(
    (state) => state?.configSellout?.totalMaestrosProducts || 0
  );

  const [openCreateMaestrosProducts, setOpenCreateMaestrosProducts] =
    useState(false);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(limitGeneral);
  const [pageExtra, setPageExtra] = useState(1);
  const [limitExtra, setLimitExtra] = useState(limitGeneral);
  const [datosExcel, setDatosExcel] = useState([]);
  const [openUploadExcel, setOpenUploadExcel] = useState(false);
  const [editMaestrosProducts, setEditMaestrosProducts] = useState(false);
  const [maestrosProducts, setMaestrosProducts] = useState({
    distributor: "",
    productDistributor: "",
    productStore: "",
    searchProductStore: "",
    codeProductSic: "",
    status: true,
  });
  const paramsValidate = [
    "distributor",
    "productDistributor",
    "productStore",
    "codeProductSic",
  ];
  const [loading, setLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
  };

  const handleChangePageExtra = (event, newPage) => {
    setPageExtra(newPage);
  };

  const handleChangeRowsPerPageExtra = (event) => {
    setLimitExtra(event.target.value);
    setPageExtra(1);
  };

  const handleOpenUploadExcel = () => {
    setOpenUploadExcel(true);
  };

  const handleCloseUploadExcel = () => {
    setOpenUploadExcel(false);
    setDatosExcel([]);
    setPage(1);
    setLimit(limitGeneral);
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets.find((ws) => ws.name === "mt prod");
      if (!worksheet) {
        showSnackbar("La hoja 'mt prod' no fue encontrada en el archivo");
        return;
      }

      const headerRow = worksheet.getRow(1);
      const headers = headerRow.values.slice(1);

      const expectedHeaders = columnsMaestrosProducts.map((col) => col.label);
      const missingHeaders = expectedHeaders.filter(
        (h) => !headers.includes(h)
      );

      if (missingHeaders.length > 0) {
        showSnackbar(
          `Faltan columnas en el Excel: ${missingHeaders.join(", ")}`
        );
        return;
      }

      const data = [];
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return;

        const rowValues = row.values.slice(1);
        const item = {};

        columnsMaestrosProducts.forEach(({ field, label }) => {
          const colIndex = headers.indexOf(label);
          item[field] = colIndex !== -1 ? rowValues[colIndex] ?? "" : "";
        });

        item.status = true;
        data.push(item);
      });

      if (data.length === 0) {
        showSnackbar("No se encontraron datos válidos en el archivo.");
        return;
      }

      setDatosExcel(data);
      showSnackbar("Archivo cargado correctamente.");
      setOpenUploadExcel(true); // <-- aquí SÍ se abre el diálogo
    } catch (error) {
      showSnackbar("Error leyendo el archivo Excel.");
    }
  };

  const handleOpenCreateMaestrosProducts = () => {
    setOpenCreateMaestrosProducts(true);
  };

  const handleCloseCreateMaestrosProducts = () => {
    setEditMaestrosProducts(false);
    setOpenCreateMaestrosProducts(false);
    setErrors({});
    setMaestrosProducts({
      distributor: "",
      productDistributor: "",
      productStore: "",
      searchProductStore: "",
      codeProductSic: "",
      status: true,
    });
  };

  const debounceSearchAddress = useCallback(
    debounce((value) => {
      buscarMaestrosProducts(value, page, limit);
    }, 1000),
    []
  );

  const buscarMaestrosProducts = async (value, page, limit) => {
    setLoading(true);
    try {
      await dispatch(obtenerMaestrosProducts({ search: value, page, limit }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarMaestrosProducts(search, page, limit);
  }, [page, limit]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    paramsValidate.forEach((field) => {
      if (!maestrosProducts[field]) {
        newErrors[field] = true;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const actions = [
    {
      label: "Editar",
      color: "info",
      onClick: (row) => handleEditMaestrosProducts(row),
    },
    {
      label: "Eliminar",
      color: "error",
      onClick: (row) => handleDeleteMaestrosProducts(row),
    },
  ];

  const handleEditMaestrosProducts = (row) => {
    setEditMaestrosProducts(true);
    setMaestrosProducts(row);
    setOpenCreateMaestrosProducts(true);
  };

  const handleDeleteMaestrosProducts = (row) => {
    showDialog({
      title: "Eliminar producto",
      message: "¿Estás seguro de que deseas eliminar este registro?",
      onConfirm: async () => {
        const response = await dispatch(deleteMaestrosProducts(row.id));
        const msg =
          response?.payload?.message || "Ocurrió un error al eliminar";
        showSnackbar(msg);

        if (response.meta?.requestStatus === "fulfilled") {
          buscarMaestrosProducts();
        }
      },
    });
  };

  const handleGuardarEntidad = async ({
    data,
    dispatchFunction,
    onSuccessCallback,
    onResetForm,
  }) => {
    const response = await dispatch(dispatchFunction(data));

    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message || "Registro exitoso");
      onSuccessCallback?.();
      onResetForm?.();
    } else {
      showSnackbar(response.payload.message || "Ocurrió un error");
    }
  };

  const handleGuardarMaestrosProducts = () => {
    if (!validateForm()) return;
    const cleanedData = {
      ...maestrosProducts,
      searchProductStore:
        maestrosProducts.searchProductStore?.replace(/\s+/g, "") || "",
    };
    if (editMaestrosProducts) {
      handleGuardarEntidad({
        data: cleanedData,
        dispatchFunction: updateMaestrosProducts,
        onSuccessCallback: () => buscarMaestrosProducts(),
        onResetForm: handleCloseCreateMaestrosProducts,
      });
    } else {
      handleGuardarEntidad({
        data: cleanedData,
        dispatchFunction: createMaestrosProducts,
        onSuccessCallback: () => buscarMaestrosProducts(),
        onResetForm: handleCloseCreateMaestrosProducts,
      });
    }
  };

  const styles = {
    title: {
      fontSize: 18,
      fontWeight: 600,
      padding: 0.7,
      borderRadius: 2,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      mb: 2,
      color: "#5c5c5c",
      // borderBottom: "1px solid #cddfff",
    },
    titleMes: {
      fontSize: 14,
      fontWeight: 600,
      color: "#5c5c5c",
      textAlign: "center",
      backgroundColor: "#e7efff",
      borderRadius: 2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderLeft: "5px solid #c5d5f1",
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      height: "52px",
    },
    datos: {
      fontSize: 13,
      fontWeight: 500,
      textAlign: "center",
      color: "#5c5c5c",
    },
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets.find((ws) => ws.name === "mt prod");
      if (!worksheet) {
        throw new Error("La hoja 'mt prod' no fue encontrada en el archivo");
      }

      const headerRow = worksheet.getRow(1);
      const headers = headerRow.values.slice(1);

      const expectedHeaders = columnsMaestrosProducts
        .filter((col) => col.field !== "status")
        .map((col) => col.label);

      const missingHeaders = expectedHeaders.filter(
        (h) => !headers.includes(h)
      );
      if (missingHeaders.length > 0) {
        throw new Error(
          `Faltan columnas en el Excel: ${missingHeaders.join(", ")}`
        );
      }

      const data = [];
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return;

        const rowValues = row.values.slice(1);
        const item = {};

        columnsMaestrosProducts.forEach(({ field, label }) => {
          if (field === "status") {
            item[field] = true;
          } else {
            const colIndex = headers.indexOf(label);
            item[field] = colIndex !== -1 ? rowValues[colIndex] ?? "" : "";
          }
        });

        data.push(item);
      });

      if (data.length === 0) {
        throw new Error("No se encontraron datos válidos en el archivo.");
      }

      setDatosExcel(data);
      setOpenUploadExcel(true);
      showSnackbar("Archivo cargado correctamente.");
    } catch (error) {
      showSnackbar(error.message || "Error leyendo el archivo Excel.");
    } finally {
      setLoading(false);
      event.target.value = null;
    }
  };

  const handleGuardarExcel = async () => {
    setLoading(true);
    const chunkSize = 2000;

    const splitInChunks = (array, size) => {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    };

    try {
      const data = Array.isArray(datosExcel)
        ? datosExcel
        : Object.values(datosExcel);
      const chunks = splitInChunks(data, chunkSize);

      for (const chunk of chunks) {
        const response = await dispatch(subirExcelMaestrosProducts(chunk));

        if (response.meta.requestStatus !== "fulfilled") {
          throw new Error(
            response.payload.message ||
              "Ocurrió un error al subir un bloque de productos"
          );
        }
      }

      showSnackbar("Se subieron todos los productos exitosamente");
      handleCloseUploadExcel();
      buscarMaestrosProducts();
    } catch (error) {
      showSnackbar(error.message || "Error al subir el archivo");
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        exportarExcel({
          excel_name: "mt prod",
          nombre: "Maestros Productos",
        })
      );
      if (response.meta.requestStatus === "fulfilled") {
        setLoading(false);
        showSnackbar(
          response.payload.message || "Archivo descargado correctamente"
        );
      }
    } catch (error) {
      showSnackbar(error.message || "Error al descargar el archivo");
    } finally {
      setLoading(false);
    }
  };

  const confirmarExportarExcel = () => {
    showDialog({
      title: "Confirmación de descarga",
      message:
        "Usted va a realizar la descarga del archivo excel de maestros productos",
      onConfirm: exportExcel,
      onCancel: () => {},
    });
  };

  return (
    <>
      <AtomContainerGeneral
        children={
          <>
            <IconoFlotante
              handleButtonClick={confirmarExportarExcel}
              title="Descargar lista mt productos"
              iconName="SaveAlt"
              color="#5ab9f6"
              right={77}
            />
            <IconoFlotante
              id="input-excel-master-products"
              right={28}
              handleChangeFile={handleFileChange}
              handleButtonClick={() =>
                document.getElementById("input-excel-master-products").click()
              }
              title="Subir archivo excel mt productos"
            />
            <AtomCard
              title="Maestros Productos"
              nameButton="Crear"
              border={true}
              onClick={handleOpenCreateMaestrosProducts}
              search={true}
              labelBuscador="Búsqueda por código SIC, distribuidor, producto almacen y descripción"
              placeholder="Buscar por:"
              valueSearch={search}
              onChange={(e) => {
                setPage(1);
                setLimit(5);
                setSearch(e.target.value);
                debounceSearchAddress(e.target.value);
              }}
              children={
                <>
                  {loading ? (
                    <AtomCircularProgress />
                  ) : (
                    <AtomTableForm
                      columns={columnsMaestrosProducts}
                      data={dataMaestrosProducts}
                      showIcons={true}
                      actions={actions}
                      pagination={true}
                      page={page}
                      limit={limit}
                      count={totalMaestrosProducts}
                      setPage={setPage}
                      setLimit={setLimit}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  )}
                </>
              }
            />
          </>
        }
      />
      <AtomDialogForm
        openDialog={openCreateMaestrosProducts}
        titleCrear={"Crear producto"}
        editDialog={editMaestrosProducts}
        titleEditar={"Editar producto"}
        buttonCancel={true}
        maxWidth="md"
        buttonSubmit={true}
        handleSubmit={handleGuardarMaestrosProducts}
        handleCloseDialog={handleCloseCreateMaestrosProducts}
        dialogContentComponent={
          <Grid
            container
            spacing={2}
            sx={{ width: "80%", justifyContent: "center" }}
          >
            <Grid size={12}>
              <Typography sx={styles.title}>Datos generales</Typography>
            </Grid>
            <Grid size={6}>
              <AtomTextField
                id="codeProductSic"
                required={true}
                headerTitle="Código SIC"
                value={maestrosProducts.codeProductSic}
                disabled={editMaestrosProducts}
                onChange={(e) => {
                  setMaestrosProducts({
                    ...maestrosProducts,
                    codeProductSic: e.target.value,
                  });
                }}
                error={errors.codeProductSic}
                helperText={
                  errors.codeProductSic ? "El código SIC es requerido" : ""
                }
              />
            </Grid>
            <Grid size={6}>
              <AtomTextField
                id="distributor"
                required={true}
                headerTitle="Distribuidor"
                value={maestrosProducts.distributor}
                onChange={(e) => {
                  const value = e.target.value || "";
                  setMaestrosProducts({
                    ...maestrosProducts,
                    distributor: value,
                    searchProductStore:
                      value + maestrosProducts.productDistributor,
                  });
                }}
                error={errors.distributor}
                helperText={
                  errors.distributor ? "El distribuidor es requerido" : ""
                }
              />
            </Grid>
            <Grid size={6}>
              <AtomTextField
                id="productDistributor"
                required={true}
                headerTitle="Producto Distribuidor"
                value={maestrosProducts.productDistributor}
                onChange={(e) => {
                  const value = e.target.value || "";
                  setMaestrosProducts({
                    ...maestrosProducts,
                    productDistributor: value,
                    searchProductStore: maestrosProducts.distributor + value,
                  });
                }}
                error={errors.productDistributor}
                helperText={
                  errors.productDistributor
                    ? "El producto distribuidor es requerido"
                    : ""
                }
              />
            </Grid>
            <Grid size={6}>
              <AtomTextField
                id="productStore"
                required={true}
                headerTitle="Producto Almacen"
                value={maestrosProducts.productStore}
                onChange={(e) => {
                  const value = e.target.value || "";
                  setMaestrosProducts({
                    ...maestrosProducts,
                    productStore: value,
                    searchProductStore:
                      maestrosProducts.distributor +
                      maestrosProducts.productDistributor +
                      value,
                  });
                }}
                error={errors.productStore}
                helperText={
                  errors.productStore ? "El producto tienda es requerido" : ""
                }
              />
            </Grid>
            <Grid size={8}>
              <AtomTextField
                id="searchProductStore"
                required={true}
                disabled={true}
                headerTitle="Busqueda de producto tienda"
                value={maestrosProducts.searchProductStore}
                error={errors.searchProductStore}
                helperText={
                  errors.searchProductStore
                    ? "La busqueda de producto tienda es requerida"
                    : ""
                }
              />
            </Grid>
            <Grid size={4} mt={0.6}>
              <AtomSwitch
                id="status"
                required={true}
                title="Estado"
                tooltip="Define si el producto está activo"
                checked={Boolean(maestrosProducts.status)}
                onChange={(e) =>
                  setMaestrosProducts({
                    ...maestrosProducts,
                    status: e.target.checked,
                  })
                }
              />
            </Grid>
          </Grid>
        }
      />
      <AtomDialogForm
        openDialog={openUploadExcel}
        titleCrear={"Datos Extraídos"}
        buttonCancel={true}
        buttonSubmit={loading ? false : true}
        maxWidth="xl"
        handleSubmit={handleGuardarExcel}
        handleCloseDialog={handleCloseUploadExcel}
        dialogContentComponent={
          <Box sx={{ width: "100%", justifyContent: "center" }}>
            {loading ? (
              <AtomCircularProgress />
            ) : (
              <>
                {datosExcel.length > 0 ? (
                  <AtomTableInformationExtraccion
                    columns={columnsMaestrosProducts}
                    data={datosExcel}
                    pagination={true}
                    page={pageExtra}
                    limit={limitExtra}
                    setPage={setPageExtra}
                    setLimit={setLimitExtra}
                    handleChangePage={handleChangePageExtra}
                    handleChangeRowsPerPage={handleChangeRowsPerPageExtra}
                  />
                ) : (
                  <Typography>No hay datos extraídos</Typography>
                )}
              </>
            )}
          </Box>
        }
      />
    </>
  );
};

export default MasterProducts;
