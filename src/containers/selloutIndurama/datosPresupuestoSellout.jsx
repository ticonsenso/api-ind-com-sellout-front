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
  obtenerPresupuestoSellout,
  updatePresupuestoSellout,
  deletePresupuestoSellout,
  createPresupuestoSellout,
  subirExcelPresupuestoSellout,
} from "../../redux/selloutDatosSlic";
import {
  columnsPresupuestoSellout,
  camposPresupuestoSellout,
} from "./constantes";
import { useDispatch, useSelector } from "react-redux";
import { useDialog } from "../../context/DialogDeleteContext";
import AtomSwitch from "../../atoms/AtomSwitch";
import { SaveAlt as SaveAltIcon } from "@mui/icons-material";
import ExcelJS from "exceljs";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { limitGeneral } from "../constantes";
import AtomTableInformationExtraccion from "../../atoms/AtomTableInformationExtraccion";
import { exportarExcel } from "../../redux/configSelloutSlice";

import IconoFlotante from "../../atoms/IconActionPage";

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const DatosPresupuestoSellout = () => {
  const dispatch = useDispatch();
  const { showDialog } = useDialog();
  const { showSnackbar } = useSnackbar();
  const [datosExcel, setDatosExcel] = useState([]);
  const [openUploadExcel, setOpenUploadExcel] = useState(false);
  const dataPresupuestoSellout = useSelector(
    (state) => state?.selloutDatos?.dataPresupuestoSellout || []
  );
  const totalPresupuestoSellout = useSelector(
    (state) => state?.selloutDatos?.totalPresupuestoSellout || 0
  );

  const [openCreatePresupuestoSellout, setOpenCreatePresupuestoSellout] =
    useState(false);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(limitGeneral);
  const [editPresupuestoSellout, setEditPresupuestoSellout] = useState(false);
  const [presupuestoSellout, setPresupuestoSellout] = useState({
    codeSupervisor: "",
    codeZone: "",
    storeCode: "",
    promotorCode: "",
    codePromotorPi: "",
    codePromotorTv: "",
    equivalentCode: "",
    units: 0,
    unitBase: 0,
    calculateDate: "",
  });
  const paramsValidate = [
    "codeSupervisor",
    "codeZone",
    "storeCode",
    "promotorCode",
    "codePromotorPi",
    "codePromotorTv",
    "equivalentCode",
    "units",
    "unitBase",
    "calculateDate",
  ];
  const [loading, setLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(event.target.value);
    setPage(1);
  };

  const handleOpenCreatePresupuestoSellout = () => {
    setOpenCreatePresupuestoSellout(true);
  };

  const handleCloseCreatePresupuestoSellout = () => {
    setOpenCreatePresupuestoSellout(false);
    setPresupuestoSellout({
      codeSupervisor: "",
      codeZone: "",
      storeCode: "",
      promotorCode: "",
      codePromotorPi: "",
      codePromotorTv: "",
      equivalentCode: "",
      units: 0,
      unitBase: 0,
      calculateDate: "",
    });
    setErrors({});
    setEditPresupuestoSellout(false);
  };

  const handleCloseUploadExcel = () => {
    setOpenUploadExcel(false);
    setDatosExcel([]);
    setPage(1);
    setLimit(limitGeneral);
  };

  const debounceSearchAddress = useCallback(
    debounce((value) => {
      buscarPresupuestoSellout(value, page, limit);
    }, 1000),
    []
  );

  const buscarPresupuestoSellout = async (value, page, limit) => {
    setLoading(true);
    try {
      await dispatch(obtenerPresupuestoSellout({ search: value, page, limit }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPresupuestoSellout(search, page, limit);
  }, [page, limit]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    paramsValidate.forEach((field) => {
      if (!presupuestoSellout[field]) {
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
      onClick: (row) => handleEditPresupuestoSellout(row),
    },
    {
      label: "Eliminar",
      color: "error",
      onClick: (row) => handleDeletePresupuestoSellout(row),
    },
  ];

  const handleEditPresupuestoSellout = (row) => {
    setEditPresupuestoSellout(true);
    setPresupuestoSellout(row);
    setOpenCreatePresupuestoSellout(true);
  };

  const handleDeletePresupuestoSellout = (row) => {
    showDialog({
      title: "Eliminar presupuesto sellout",
      message: "¿Estás seguro de que deseas eliminar este registro?",
      onConfirm: async () => {
        const response = await dispatch(deletePresupuestoSellout(row.id));
        const msg =
          response?.payload?.message || "Ocurrió un error al eliminar";
        showSnackbar(msg);

        if (response.meta?.requestStatus === "fulfilled") {
          buscarPresupuestoSellout();
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

  const handleGuardarPresupuestoSellout = () => {
    if (!validateForm()) return;
    if (editPresupuestoSellout) {
      handleGuardarEntidad({
        data: presupuestoSellout,
        dispatchFunction: updatePresupuestoSellout,
        onSuccessCallback: () => buscarPresupuestoSellout(),
        onResetForm: handleCloseCreatePresupuestoSellout,
      });
    } else {
      handleGuardarEntidad({
        data: presupuestoSellout,
        dispatchFunction: createPresupuestoSellout,
        onSuccessCallback: () => buscarPresupuestoSellout(),
        onResetForm: handleCloseCreatePresupuestoSellout,
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

      const worksheet = workbook.worksheets.find(
        (ws) => ws.name === "Base Ppto"
      );
      if (!worksheet) {
        throw new Error("La hoja 'Base Ppto' no fue encontrada en el archivo");
      }

      const headerRow = worksheet.getRow(1);
      const headers = headerRow.values.slice(1);

      const expectedHeaders = columnsPresupuestoSellout
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

        columnsPresupuestoSellout.forEach(({ field, label }) => {
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

    const chunks = splitInChunks(datosExcel, chunkSize);

    for (const [index, chunk] of chunks.entries()) {
      try {
        await handleGuardarEntidad({
          data: chunk,
          dispatchFunction: subirExcelPresupuestoSellout,
          onSuccessCallback: () => { },
          onResetForm: () => { },
        });
      } catch (error) {
        showSnackbar(`Error al subir el chunk ${index + 1}: ${error}`);
      }
    }
    setLoading(false);
    handleCloseUploadExcel();
    buscarPresupuestoSellout();
  };

  const exportExcel = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        exportarExcel({
          excel_name: "presupuesto sellout",
          nombre: "Presupuesto Sellout",
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
              title="Descargar lista de presupuesto sellout"
              iconName="SaveAlt"
              color="#5ab9f6"
              right={77}
            />
            <IconoFlotante
              handleButtonClick={() =>
                document.getElementById("input-excel-master-almacen").click()
              }
              handleChangeFile={handleFileChange}
              title="Subir archivo excel de presupuesto sellout"
              id="input-excel-master-almacen"
              iconName="DriveFolderUploadOutlined"
            />
            <AtomCard
              title="Presupuesto Sellout"
              nameButton="Crear"
              border={true}
              onClick={handleOpenCreatePresupuestoSellout}
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
                      columns={[]}
                      data={dataPresupuestoSellout}
                      showIcons={true}
                      actions={actions}
                      pagination={true}
                      page={page}
                      limit={limit}
                      count={totalPresupuestoSellout}
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
        openDialog={openCreatePresupuestoSellout}
        titleCrear={"Crear presupuesto sellout"}
        editDialog={editPresupuestoSellout}
        titleEditar={"Editar presupuesto sellout"}
        buttonCancel={true}
        maxWidth="md"
        buttonSubmit={true}
        handleSubmit={handleGuardarPresupuestoSellout}
        handleCloseDialog={handleCloseCreatePresupuestoSellout}
        dialogContentComponent={
          <Grid
            container
            spacing={2}
            sx={{ width: "80%", justifyContent: "right" }}
          >
            {camposPresupuestoSellout.map((campo) => (
              <Grid size={campo.size} key={campo.id}>
                <AtomTextField
                  id={campo.id}
                  headerTitle={campo.headerTitle}
                  required={campo.required}
                  value={presupuestoSellout[campo.id]}
                  disabled={campo.disabled}
                  onChange={(e) => {
                    const nuevoValor = e.target.value;
                    const nuevosDatos = {
                      ...presupuestoSellout,
                      [campo.id]: nuevoValor,
                    };
                    if (
                      campo.id === "distributor" ||
                      campo.id === "storeDistributor"
                    ) {
                      const distribuidor =
                        campo.id === "distributor"
                          ? nuevoValor
                          : presupuestoSellout.distributor || "";
                      const almacen =
                        campo.id === "storeDistributor"
                          ? nuevoValor
                          : presupuestoSellout.storeDistributor || "";
                      nuevosDatos.searchStore =
                        `${distribuidor}${almacen}`.replace(/\s+/g, "");
                    }

                    setPresupuestoSellout(nuevosDatos);
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
                checked={presupuestoSellout.status}
                onChange={(e) =>
                  setPresupuestoSellout({
                    ...presupuestoSellout,
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
                    columns={columnsPresupuestoSellout}
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

export default DatosPresupuestoSellout;
