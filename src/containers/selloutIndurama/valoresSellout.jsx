import AtomCard from "../../atoms/AtomCard";
import AtomTableForm from "../../atoms/AtomTableForm";
import { useEffect, useCallback } from "react";
import AtomDialogForm from "../../atoms/AtomDialogForm";
import AtomTextField from "../../atoms/AtomTextField";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "../../context/SnacbarContext";
import AtomCircularProgress from "../../atoms/AtomCircularProgress";
import {
  obtenerValoresSellout,
  updateValoresSellout,
  deleteValoresSellout,
  createValoresSellout,
  subirExcelValoresSellout,
} from "../../redux/selloutDatosSlic";
import { useDispatch, useSelector } from "react-redux";
import { useDialog } from "../../context/DialogDeleteContext";
import { Box, Typography } from "@mui/material";
import { limitGeneral } from "../constantes";
import AtomTableInformationExtraccion from "../../atoms/AtomTableInformationExtraccion";
import { columnsValoresSellout, camposValoresSellout } from "./constantes";
import IconoFlotante from "../../atoms/IconActionPage";
import { exportarExcel } from "../../redux/configSelloutSlice";

const excelWorker = new Worker(
  new URL("../../workers/excelWorker.js", import.meta.url),
  {
    type: "module",
  }
);

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const ValoresSellout = () => {
  const dispatch = useDispatch();
  const { showDialog } = useDialog();
  const { showSnackbar } = useSnackbar();
  const [datosExcel, setDatosExcel] = useState([]);
  const [openUploadExcel, setOpenUploadExcel] = useState(false);
  const dataValoresSellout = useSelector(
    (state) => state?.selloutDatos?.dataValoresSellout || []
  );
  const totalValoresSellout = useSelector(
    (state) => state?.selloutDatos?.totalValoresSellout || 0
  );

  const [openCreateValoresSellout, setOpenCreateValoresSellout] =
    useState(false);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(limitGeneral);
  const [editValoresSellout, setEditValoresSellout] = useState(false);
  const [valoresSellout, setValoresSellout] = useState({
    brand: "",
    model: "",
    unitBaseUnitary: "",
    pvdUnitary: "",
    calculateDate: "",
  });
  const paramsValidate = ["brand", "model", "unitBaseUnitary", "pvdUnitary"];
  const [loading, setLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(event.target.value);
    setPage(1);
  };

  const handleOpenCreateValoresSellout = () => {
    setOpenCreateValoresSellout(true);
  };

  const handleCloseCreateValoresSellout = () => {
    setOpenCreateValoresSellout(false);
    setValoresSellout({
      brand: "",
      model: "",
      unitBaseUnitary: "",
      pvdUnitary: "",
      calculateDate: "",
    });
    setErrors({});
    setEditValoresSellout(false);
  };

  const handleCloseUploadExcel = () => {
    setOpenUploadExcel(false);
    setDatosExcel([]);
    setPage(1);
    setLimit(limitGeneral);
  };

  const debounceSearchAddress = useCallback(
    debounce((value) => {
      buscarValoresSellout(value, page, limit);
    }, 1000),
    []
  );

  const buscarValoresSellout = async (value, page, limit) => {
    setLoading(true);
    try {
      await dispatch(obtenerValoresSellout({ search: value, page, limit }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarValoresSellout(search, page, limit);
  }, [page, limit]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    paramsValidate.forEach((field) => {
      if (!valoresSellout[field]) {
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
      onClick: (row) => handleEditValoresSellout(row),
    },
    {
      label: "Eliminar",
      color: "error",
      onClick: (row) => handleDeleteValoresSellout(row),
    },
  ];

  const handleEditValoresSellout = (row) => {
    setEditValoresSellout(true);
    setValoresSellout(row);
    setOpenCreateValoresSellout(true);
  };

  const handleDeleteValoresSellout = (row) => {
    showDialog({
      title: "Eliminar valores sellout",
      message: "¿Estás seguro de que deseas eliminar este registro?",
      onConfirm: async () => {
        const response = await dispatch(deleteValoresSellout(row.id));
        const msg =
          response?.payload?.message || "Ocurrió un error al eliminar";
        showSnackbar(msg);

        if (response.meta?.requestStatus === "fulfilled") {
          buscarValoresSellout();
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

  const handleGuardarValoresSellout = () => {
    if (!validateForm()) return;
    if (editValoresSellout) {
      handleGuardarEntidad({
        data: valoresSellout,
        dispatchFunction: updateValoresSellout,
        onSuccessCallback: () => {
          buscarValoresSellout();
          handleCloseCreateValoresSellout();
        },
        onResetForm: handleCloseCreateValoresSellout,
      });
    } else {
      handleGuardarEntidad({
        data: valoresSellout,
        dispatchFunction: createValoresSellout,
        onSuccessCallback: () => {
          buscarValoresSellout();
          handleCloseCreateValoresSellout();
        },
        onResetForm: handleCloseCreateValoresSellout,
      });
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      excelWorker.postMessage({
        arrayBuffer,
        columns: columnsValoresSellout,
      });

      excelWorker.onmessage = (e) => {
        const { data, error } = e.data;
        if (error) {
          showSnackbar(error);
        } else {
          setDatosExcel(data);
          setOpenUploadExcel(true);
          showSnackbar("Archivo procesado correctamente.");
        }
        setLoading(false);
      };
    } catch (error) {
      showSnackbar(error || "Error al procesar el archivo.");
      setLoading(false);
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

    const chunks = splitInChunks(datosExcel, chunkSize);

    for (const [index, chunk] of chunks.entries()) {
      try {
        await handleGuardarEntidad({
          data: chunk,
          dispatchFunction: subirExcelValoresSellout,
          onSuccessCallback: () => { },
          onResetForm: () => { },
        });
      } catch (error) {
        showSnackbar(`Error al subir el chunk ${index + 1}: ${error}`);
      }
    }
    setLoading(false);
    handleCloseUploadExcel();
    buscarValoresSellout();
  };

  const exportExcel = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        exportarExcel({
          excel_name: "valores sellout",
          nombre: "Valores Sellout",
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

  return (
    <>
      <AtomContainerGeneral
        children={
          <>
            <IconoFlotante
              handleButtonClick={exportExcel}
              title="Descargar lista valores sellout"
              iconName="SaveAlt"
              color="#5ab9f6"
              right={77}
            />
            <IconoFlotante
              handleButtonClick={() =>
                document.getElementById("input-excel-master-almacen").click()
              }
              handleChangeFile={handleFileChange}
              title="Subir archivo excel de valores sellout"
              id="input-excel-master-almacen"
              iconName="DriveFolderUploadOutlined"
            />
            <AtomCard
              title="Valores Sellout"
              nameButton="Crear"
              border={true}
              onClick={handleOpenCreateValoresSellout}
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
                      columns={columnsValoresSellout}
                      data={dataValoresSellout}
                      showIcons={true}
                      actions={actions}
                      pagination={true}
                      page={page}
                      limit={limit}
                      count={totalValoresSellout}
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
        openDialog={openCreateValoresSellout}
        titleCrear={"Crear valores sellout"}
        editDialog={editValoresSellout}
        titleEditar={"Editar valores sellout"}
        buttonCancel={true}
        maxWidth="md"
        buttonSubmit={true}
        handleSubmit={handleGuardarValoresSellout}
        handleCloseDialog={handleCloseCreateValoresSellout}
        dialogContentComponent={
          <Grid
            container
            spacing={2}
            sx={{ width: "80%", justifyContent: "right" }}
          >
            {camposValoresSellout.map((campo) => (
              <Grid size={campo.size} key={campo.id}>
                <AtomTextField
                  id={campo.id}
                  headerTitle={campo.headerTitle}
                  required={campo.required}
                  value={valoresSellout[campo.id]}
                  disabled={campo.disabled}
                  onChange={(e) => {
                    const nuevoValor = e.target.value;
                    const nuevosDatos = {
                      ...valoresSellout,
                      [campo.id]: nuevoValor,
                    };
                    setValoresSellout(nuevosDatos);
                  }}
                  error={errors[campo.id]}
                  helperText={
                    errors[campo.id] ? "El código SIC es requerido" : ""
                  }
                />
              </Grid>
            ))}
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
                    columns={columnsValoresSellout}
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

export default ValoresSellout;
