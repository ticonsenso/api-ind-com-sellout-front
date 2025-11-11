import React from "react";
import AtomCard from "../../../atoms/AtomCard";
import AtomTableForm from "../../../atoms/AtomTableForm";
import { useEffect, useCallback } from "react";
import AtomDialogForm from "../../../atoms/AtomDialogForm";
import AtomTextField from "../../../atoms/AtomTextField";
import AtomContainerGeneral from "../../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "../../../context/SnacbarContext";
import AtomCircularProgress from "../../../atoms/AtomCircularProgress";
import {
  obtenerStoresSic,
  updateStoresSic,
  deleteStoresSic,
  createStoresSic,
  subirExcelStoresSic,
  exportarExcel,
} from "../../../redux/configSelloutSlice";
import {
  columnsStoresSic,
  camposStoresSic,
  paramsValidateStoresSic,
} from "./constantes";
import { useDispatch, useSelector } from "react-redux";
import { useDialog } from "../../../context/DialogDeleteContext";
import AtomSwitch from "../../../atoms/AtomSwitch";
import { DriveFolderUploadOutlined as DriveFolderUploadOutlinedIcon } from "@mui/icons-material";
import ExcelJS from "exceljs";
import { Box, Typography, IconButton } from "@mui/material";
import { limitGeneral } from "../../constantes";
import AtomTableInformationExtraccion from "../../../atoms/AtomTableInformationExtraccion";
import IconoFlotante from "../../../atoms/IconActionPage";

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const AlmacenSic = () => {
  const dispatch = useDispatch();
  const { showDialog } = useDialog();
  const { showSnackbar } = useSnackbar();

  const [openUploadExcel, setOpenUploadExcel] = useState(false);
  const dataStoresSic = useSelector(
    (state) => state?.configSellout?.dataStoresSic || []
  );
  const totalStoresSic = useSelector(
    (state) => state?.configSellout?.totalStoresSic || 0
  );
  const [datosExcel, setDatosExcel] = useState([]);
  const [openCreateStoresSic, setOpenCreateStoresSic] = useState(false);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(limitGeneral);
  const [editStoresSic, setEditStoresSic] = useState(false);
  const [storesSic, setStoresSic] = useState({});
  const [pageExtra, setPageExtra] = useState(1);
  const [limitExtra, setLimitExtra] = useState(25);

  const handleChangePageExtra = (event, newPage) => {
    setPageExtra(newPage);
  };

  const handleChangeRowsPerPageExtra = (event) => {
    setLimitExtra(parseInt(event.target.value));
    setPageExtra(1);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
  };

  const handleOpenCreateStoresSic = () => {
    setOpenCreateStoresSic(true);
  };

  const handleCloseCreateStoresSic = () => {
    setOpenCreateStoresSic(false);
    clearStoresSic();
  };

  const clearStoresSic = () => {
    setStoresSic({});
    setEditStoresSic(false);
    setErrors({});
    buscarStoresSic();
  };

  const handleCloseUploadExcel = () => {
    setOpenUploadExcel(false);
    setDatosExcel([]);
    setPage(1);
    setLimit(limitGeneral);
  };

  const buscarStoresSic = async (value, page, limit) => {
    setLoading(true);
    try {
      await dispatch(obtenerStoresSic({ search: value, page, limit }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarStoresSic(search, page, limit);
  }, [page, limit]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    paramsValidateStoresSic.forEach((field) => {
      if (!storesSic[field]) {
        newErrors[field] = true;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const actions = [
    // {
    //   label: "Editar",
    //   color: "info",
    //   onClick: (row) => handleEditStoresSic(row),
    // },
    {
      label: "Eliminar",
      color: "error",
      onClick: (row) => handleDeleteStoresSic(row),
    },
  ];

  const handleEditStoresSic = (row) => {
    setEditStoresSic(true);
    setStoresSic(row);
    setOpenCreateStoresSic(true);
  };

  const handleDeleteStoresSic = (row) => {
    showDialog({
      title: "Eliminar almacén",
      message: "¿Estás seguro de que deseas eliminar este registro?",
      onConfirm: async () => {
        const response = await dispatch(deleteStoresSic(row.id));
        const msg =
          response?.payload?.message || "Ocurrió un error al eliminar";
        showSnackbar(msg);

        if (response.meta?.requestStatus === "fulfilled") {
          buscarStoresSic();
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

  const handleGuardarStoresSic = () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (editStoresSic) {
        handleGuardarEntidad({
          data: storesSic,
          dispatchFunction: updateStoresSic,
          onSuccessCallback: () => { },
          onResetForm: handleCloseCreateStoresSic,
        });
      } else {
        handleGuardarEntidad({
          data: storesSic,
          dispatchFunction: createStoresSic,
          onSuccessCallback: () => { },
          onResetForm: handleCloseCreateStoresSic,
        });
      }
    } finally {
      setLoading(false);
      buscarStoresSic();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets.find((ws) => ws.name === "alm sic");
      if (!worksheet) {
        throw new Error("La hoja 'alm sic' no fue encontrada en el archivo");
      }

      const headerRow = worksheet.getRow(1);
      const headers = headerRow.values.slice(1);

      const expectedHeaders = columnsStoresSic
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

        columnsStoresSic.forEach(({ field, label }) => {
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
    try {
      const chunkSize = 2000;

      const splitInChunks = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
          result.push(array.slice(i, i + size));
        }
        return result;
      };

      const chunks = splitInChunks(datosExcel, chunkSize);

      for (const [index, chunk] of chunks.entries()) {
        try {
          await handleGuardarEntidad({
            data: chunk,
            dispatchFunction: subirExcelStoresSic,
            onSuccessCallback:
              index === chunks.length - 1 ? buscarStoresSic : undefined,
            onResetForm:
              index === chunks.length - 1 ? handleCloseUploadExcel : undefined,
          });
        } catch (error) {
          showSnackbar(`Error al subir el chunk ${index + 1}:`);
        }
      }
    } catch (error) {
      setLoading(false);
      showSnackbar(error.message || "Error al guardar el archivo Excel.");
    } finally {
      setLoading(false);
    }
  };

  const debounceSearchAddress = useCallback(
    debounce((value) => {
      buscarStoresSic(value, page, limit);
    }, 1000),
    []
  );

  const exportExcel = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        exportarExcel({
          excel_name: "alm sic",
          nombre: "Almacenes SIC",
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
        "Usted va a realizar la descarga del archivo excel de almacenes SIC",
      onConfirm: exportExcel,
      onCancel: () => { },
    });
  };

  return (
    <>
      <AtomContainerGeneral
        children={
          <>
            <IconoFlotante
              handleButtonClick={confirmarExportarExcel}
              title="Descargar lista almacenes SIC"
              iconName="SaveAlt"
              color="#5ab9f6"
              right={77}
            />
            <IconoFlotante
              handleButtonClick={() =>
                document.getElementById("input-excel-almacen-sic").click()
              }
              handleChangeFile={handleFileChange}
              title="Subir archivo excel almacenes SIC"
              id="input-excel-almacen-sic"
            />
            <AtomCard
              title="Almacenes SIC"
              nameButton=""
              border={true}
              onClick={handleOpenCreateStoresSic}
              search={true}
              valueSearch={search}
              onChange={(e) => {
                setPage(1);
                setLimit(limitGeneral);
                setSearch(e.target.value);
                debounceSearchAddress(e.target.value);
              }}
              children={
                <>
                  {loading ? (
                    <AtomCircularProgress />
                  ) : (
                    <AtomTableForm
                      columns={columnsStoresSic}
                      data={dataStoresSic}
                      showIcons={true}
                      actions={actions}
                      pagination={true}
                      page={page}
                      limit={limit}
                      count={totalStoresSic}
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
        openDialog={openCreateStoresSic}
        titleCrear={"Crear almacén"}
        editDialog={editStoresSic}
        titleEditar={"Editar almacén"}
        buttonCancel={true}
        maxWidth="md"
        buttonSubmit={true}
        handleSubmit={handleGuardarStoresSic}
        handleCloseDialog={handleCloseCreateStoresSic}
        dialogContentComponent={
          <Grid
            container
            spacing={2}
            sx={{ width: "80%", justifyContent: "right" }}
          >
            {camposStoresSic.map((campo) => (
              <Grid size={campo.size} key={campo.id}>
                <AtomTextField
                  id={campo.id}
                  headerTitle={campo.headerTitle}
                  required={campo.required}
                  value={storesSic[campo.id]}
                  multiline={campo.multiline}
                  rows={campo.rows}
                  placeholder={campo.placeholder}
                  onChange={(e) => {
                    setStoresSic({
                      ...storesSic,
                      [campo.id]: e.target.value,
                    });
                  }}
                  error={errors[campo.id]}
                  helperText={errors[campo.id] ? "El campo es requerido" : ""}
                />
              </Grid>
            ))}
            <Grid size={4}>
              <AtomSwitch
                id="status"
                title="Estado"
                value={storesSic.status}
                onChange={(e) =>
                  setStoresSic({ ...storesSic, status: e.target.value })
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
          <Box
            sx={{
              width: "100%",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <AtomCircularProgress />
            ) : (
              <>
                {datosExcel.length > 0 ? (
                  <AtomTableInformationExtraccion
                    columns={columnsStoresSic}
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

export default AlmacenSic;
