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
  obtenerMaestrosStores,
  updateMaestrosStores,
  deleteMaestrosStores,
  createMaestrosStores,
  subirExcelMaestrosStores,
  exportarExcel,
} from "../../../redux/configSelloutSlice";
import { columnsMaestrosStores } from "../constantes";
import { useDispatch, useSelector } from "react-redux";
import { useDialog } from "../../../context/DialogDeleteContext";
import AtomSwitch from "../../../atoms/AtomSwitch";
import { SaveAlt as SaveAltIcon } from "@mui/icons-material";
import ExcelJS from "exceljs";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { limitGeneral } from "../../constantes";
import AtomTableInformationExtraccion from "../../../atoms/AtomTableInformationExtraccion";
import { camposMaestrosStores } from "./constantes";
import IconoFlotante from "../../../atoms/IconActionPage";

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const MasterAlmacen = () => {
  const dispatch = useDispatch();
  const { showDialog } = useDialog();
  const { showSnackbar } = useSnackbar();
  const [datosExcel, setDatosExcel] = useState([]);
  const [openUploadExcel, setOpenUploadExcel] = useState(false);
  const dataMaestrosStores = useSelector(
    (state) => state?.configSellout?.dataMaestrosStores || []
  );
  const totalMaestrosStores = useSelector(
    (state) => state?.configSellout?.totalMaestrosStores || 0
  );

  const [openCreateMaestrosStores, setOpenCreateMaestrosStores] =
    useState(false);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(limitGeneral);
  const [editMaestrosStores, setEditMaestrosStores] = useState(false);
  const [maestrosStores, setMaestrosStores] = useState({
    distributor: "",
    storeDistributor: "",
    codeStoreSic: "",
    status: true,
    searchStore: "",
  });
  const paramsValidate = ["distributor", "storeDistributor", "codeStoreSic"];
  const [loading, setLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(event.target.value);
    setPage(1);
  };

  const handleOpenCreateMaestrosStores = () => {
    setOpenCreateMaestrosStores(true);
  };

  const handleCloseCreateMaestrosStores = () => {
    setOpenCreateMaestrosStores(false);
    setMaestrosStores({
      distributor: "",
      storeDistributor: "",
      codeStoreSic: "",
      status: true,
    });
    setErrors({});
    setEditMaestrosStores(false);
  };

  const handleCloseUploadExcel = () => {
    setOpenUploadExcel(false);
    setDatosExcel([]);
    setPage(1);
    setLimit(limitGeneral);
  };

  const debounceSearchAddress = useCallback(
    debounce((value) => {
      buscarMaestrosStores(value, page, limit);
    }, 1000),
    []
  );

  const buscarMaestrosStores = async (value, page, limit) => {
    setLoading(true);
    try {
      await dispatch(obtenerMaestrosStores({ search: value, page, limit }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarMaestrosStores(search, page, limit);
  }, [page, limit]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    paramsValidate.forEach((field) => {
      if (!maestrosStores[field]) {
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
      onClick: (row) => handleEditMaestrosStores(row),
    },
    {
      label: "Eliminar",
      color: "error",
      onClick: (row) => handleDeleteMaestrosStores(row),
    },
  ];

  const handleEditMaestrosStores = (row) => {
    setEditMaestrosStores(true);
    setMaestrosStores(row);
    setOpenCreateMaestrosStores(true);
  };

  const handleDeleteMaestrosStores = (row) => {
    showDialog({
      title: "Eliminar almacén",
      message: "¿Estás seguro de que deseas eliminar este registro?",
      onConfirm: async () => {
        const response = await dispatch(deleteMaestrosStores(row.id));
        const msg =
          response?.payload?.message || "Ocurrió un error al eliminar";
        showSnackbar(msg);

        if (response.meta?.requestStatus === "fulfilled") {
          buscarMaestrosStores();
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

  const handleGuardarMaestrosStores = () => {
    if (!validateForm()) return;
    if (editMaestrosStores) {
      handleGuardarEntidad({
        data: maestrosStores,
        dispatchFunction: updateMaestrosStores,
        onSuccessCallback: () => buscarMaestrosStores(),
        onResetForm: handleCloseCreateMaestrosStores,
      });
    } else {
      handleGuardarEntidad({
        data: maestrosStores,
        dispatchFunction: createMaestrosStores,
        onSuccessCallback: () => buscarMaestrosStores(),
        onResetForm: handleCloseCreateMaestrosStores,
      });
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

      const worksheet = workbook.worksheets.find((ws) => ws.name === "mt. alm");
      if (!worksheet) {
        throw new Error("La hoja 'mt. alm' no fue encontrada en el archivo");
      }

      const headerRow = worksheet.getRow(1);
      const headers = headerRow.values.slice(1);

      const expectedHeaders = columnsMaestrosStores
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

        columnsMaestrosStores.forEach(({ field, label }) => {
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
      const chunks = splitInChunks(datosExcel, chunkSize);

      for (const [index, chunk] of chunks.entries()) {
        const response = await dispatch(subirExcelMaestrosStores(chunk));

        if (response.meta.requestStatus !== "fulfilled") {
          throw new Error(
            response.payload?.message || `Error al subir el chunk ${index + 1}`
          );
        }
      }

      showSnackbar("Se subieron todos los productos exitosamente");
      handleCloseUploadExcel();
      buscarMaestrosStores();
    } catch (error) {
      showSnackbar(error.message || "Ocurrió un error durante la subida");
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        exportarExcel({
          excel_name: "mt. alm",
          nombre: "Maestros Almacén",
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
        "Usted va a realizar la descarga del archivo excel de maestros almacenes",
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
              title="Descargar lista mt almacenes"
              iconName="SaveAlt"
              color="#5ab9f6"
              right={77}
            />
            <IconoFlotante
              handleButtonClick={() =>
                document.getElementById("input-excel-master-almacen").click()
              }
              handleChangeFile={handleFileChange}
              title="Subir archivo excel mt almacenes"
              id="input-excel-master-almacen"
              iconName="DriveFolderUploadOutlined"
            />
            <AtomCard
              title="Maestros Almacén"
              nameButton="Crear"
              border={true}
              onClick={handleOpenCreateMaestrosStores}
              labelBuscador="Búsqueda por código SIC, distribuidor y almacén"
              placeholder="Buscar por:"
              search={true}
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
                      columns={columnsMaestrosStores}
                      data={dataMaestrosStores}
                      showIcons={true}
                      actions={actions}
                      pagination={true}
                      page={page}
                      limit={limit}
                      count={totalMaestrosStores}
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
        openDialog={openCreateMaestrosStores}
        titleCrear={"Crear almacén"}
        editDialog={editMaestrosStores}
        titleEditar={"Editar almacén"}
        buttonCancel={true}
        maxWidth="md"
        buttonSubmit={true}
        handleSubmit={handleGuardarMaestrosStores}
        handleCloseDialog={handleCloseCreateMaestrosStores}
        dialogContentComponent={
          <Grid
            container
            spacing={2}
            sx={{ width: "80%", justifyContent: "right" }}
          >
            {camposMaestrosStores.map((campo) => (
              <Grid size={campo.size} key={campo.id}>
                <AtomTextField
                  id={campo.id}
                  headerTitle={campo.headerTitle}
                  required={campo.required}
                  value={maestrosStores[campo.id]}
                  disabled={campo.disabled}
                  onChange={(e) => {
                    const nuevoValor = e.target.value;
                    const nuevosDatos = {
                      ...maestrosStores,
                      [campo.id]: nuevoValor,
                    };
                    if (
                      campo.id === "distributor" ||
                      campo.id === "storeDistributor"
                    ) {
                      const distribuidor =
                        campo.id === "distributor"
                          ? nuevoValor
                          : maestrosStores.distributor || "";
                      const almacen =
                        campo.id === "storeDistributor"
                          ? nuevoValor
                          : maestrosStores.storeDistributor || "";
                      nuevosDatos.searchStore =
                        `${distribuidor}${almacen}`.replace(/\s+/g, "");
                    }

                    setMaestrosStores(nuevosDatos);
                  }}
                  error={errors[campo.id]}
                  helperText={
                    errors[campo.id] ? "El código SIC es requerido" : ""
                  }
                />
              </Grid>
            ))}

            <Grid size={6}>
              <AtomSwitch
                id="status"
                required={true}
                title="Estado"
                tooltip="Define si el almacén está activo"
                checked={maestrosStores.status}
                onChange={(e) =>
                  setMaestrosStores({
                    ...maestrosStores,
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
        buttonCancel={loading ? false : true}
        handleSubmit={handleGuardarExcel}
        buttonSubmit={loading ? false : true}
        maxWidth="xl"
        handleCloseDialog={handleCloseUploadExcel}
        dialogContentComponent={
          <Box sx={{ width: "100%", justifyContent: "center" }}>
            {loading ? (
              <AtomCircularProgress />
            ) : (
              <>
                {datosExcel.length > 0 ? (
                  <AtomTableInformationExtraccion
                    columns={columnsMaestrosStores}
                    data={datosExcel}
                    pagination={true}
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

export default MasterAlmacen;
