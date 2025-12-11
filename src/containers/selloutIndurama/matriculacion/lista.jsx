import AtomCard from "../../../atoms/AtomCard";
import AtomTableForm from "../../../atoms/AtomTableForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import {
  obtenerMatriculacion,
  createMatriculacion,
  updateMatriculacion,
  deleteMatriculacion,
  createMatriculacionBulk,
  createMatriculationBeforeMonth,
  exportarExcel,
  deleteMasivaMatriculacion
} from "../../../redux/configSelloutSlice";
import AtomDialogForm from "../../../atoms/AtomDialogForm";
import AtomTextField from "../../../atoms/AtomTextField";
import AtomContainerGeneral from "../../../atoms/AtomContainerGeneral";
import { useState } from "react";
import { Box, Typography, Menu, MenuItem, ListItemIcon } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "../../../context/SnacbarContext";
import { useDialog } from "../../../context/DialogDeleteContext";
import AtomCircularProgress from "../../../atoms/AtomCircularProgress";
import { usePermission } from "../../../context/PermisosComtext";
import { limitGeneral, pageGeneral } from "../../constantes";
import AtomSwitch from "../../../atoms/AtomSwitch";
import ExcelJS from "exceljs";
import IconoFlotante from "../../../atoms/IconActionPage";
import AtomTableInformationExtraccion from "../../../atoms/AtomTableInformationExtraccion";
import AtomDatePicker from "../../../atoms/AtomDatePicker";
import {
  MoreVert as MoreVertIcon,
  DriveFolderUploadOutlined as DriveFolderUploadOutlinedIcon,
  SaveAlt as SaveAltIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { formatDate, isMonthClosed, debounce, normalizeEncabezados } from "../../constantes";
import { setCalculateDate } from "../../../redux/configSelloutSlice";

const columns = [
  {
    label: "Distribuidor",
    field: "distributor",
  },
  {
    label: "Almacen",
    field: "storeName",
  },
  {
    label: "Fecha Matriculación",
    field: "createdAt",
    type: "date"
  },
  {
    label: "Estado",
    field: "status",
  },
];


const Matriculacion = ({ calculateDate }) => {
  const hasPermission = usePermission();
  const namePermission = hasPermission("ACCIONES MATRICULACION SELLOUT");
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const { showDialog } = useDialog();
  const dataMatriculacion = useSelector((state) => state?.configSellout?.dataMatriculacion);

  const totalMatriculacion = useSelector(
    (state) => state?.configSellout?.totalMatriculacion || 0
  );
  const dataMatriculacionConfig = useSelector(
    (state) => state.selloutDatos.dataMatriculacionConfig
  );
  const monthToCompare = calculateDate;
  const matriculacionConfigrada = dataMatriculacionConfig?.find(
    (config) => config.month === monthToCompare
  );
  const matriculacionCerrada = isMonthClosed(
    matriculacionConfigrada?.closingDate
  );
  const [openMatriculacion, setOpenMatriculacion] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [copyMonth, setCopyMonth] = useState(null);
  const [
    openCreateMatriculacionBeforeMonth,
    setOpenCreateMatriculacionBeforeMonth,
  ] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(pageGeneral);
  const [limit, setLimit] = useState(limitGeneral);
  const [edit, setEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const paramsValidate = ["distributor", "calculateMonth"];
  const [openUploadExcel, setOpenUploadExcel] = useState(false);
  const [datosExcel, setDatosExcel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matricula, setMatricula] = useState({
    distributor: "",
    storeName: "",
    calculateMonth: calculateDate,
    status: true,
  });

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    paramsValidate.forEach((field) => {
      if (!matricula[field]) {
        newErrors[field] = true;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(event.target.value);
    setPage(pageGeneral);
  };

  const debounceSearchMatriculacion = useCallback(
    debounce((value) => {
      buscarMatriculacion(value, calculateDate);
    }, 1000),
    [calculateDate]
  );

  const buscarMatriculacion = async (value, calculateDate) => {
    setLoading(true);
    try {
      await dispatch(
        obtenerMatriculacion({
          search: value,
          page,
          limit,
          calculateMonth: calculateDate,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarMatriculacion(search, calculateDate);
  }, [page, limit, calculateDate]);

  useEffect(() => {
    setMatricula({
      ...matricula,
      calculateMonth: calculateDate,
    });
  }, [calculateDate]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    if (matricula.id) {
      editMatriculacion();
    } else {
      crearMatriculacion();
    }
  };

  const editMatriculacion = async () => {
    const { multipleDistributors, ...rest } = matricula;
    const response = await dispatch(updateMatriculacion(rest));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message);
      buscarMatriculacion(search, calculateDate);
      handleCloseMatriculacion();
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const crearMatriculacion = async () => {
    const { multipleDistributors, ...rest } = matricula;
    const response = await dispatch(createMatriculacion(rest));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message);
      handleCloseMatriculacion();
      buscarMatriculacion(search, calculateDate);
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const handleOpenMatriculacion = () => {
    setOpenMatriculacion(true);
  };

  const actions = [
    {
      label: "Editar",
      color: "info",
      onClick: (row) => handleEditMatriculacion(row),
    },
  ];

  const handleCloseMatriculacion = () => {
    setOpenMatriculacion(false);
    setErrors({});
    setMatricula({
      status: true,
      distributor: "",
      calculateMonth: calculateDate,
      storeName: "",
    });
    setEdit(false);
  };

  // const handleDeleteMatriculacion = (row) => {
  //   showDialog({
  //     title: "Eliminar Matriculacion",
  //     message:
  //       "¿Estás seguro de que deseas eliminar esta matriculación, todos los datos asociados a esta serán eliminados?",
  //     onConfirm: async () => {
  //       try {
  //         const response = await dispatch(deleteMatriculacion(row.id));
  //         if (response.meta.requestStatus === "fulfilled") {
  //           showSnackbar(response.payload.message);
  //           buscarMatriculacion(search, calculateDate);
  //         } else {
  //           showSnackbar(response.payload.message);
  //         }
  //       } catch (error) {
  //         showSnackbar(error || "Error al eliminar la matriculacion");
  //       }
  //     },
  //     onCancel: () => { },
  //   });
  // };

  const handleDeleteSelected = () => {
    showDialog({
      title: "Confirmación masiva de Matriculacion",
      message:
        "¿Estás seguro de que deseas eliminar los registros, todos los datos seleccionados serán eliminados?",
      onConfirm: async () => {
        try {
          const ids = selectedIds;
          const response = await dispatch(deleteMasivaMatriculacion({ ids, calculateDate }));
          if (response.meta.requestStatus === "fulfilled") {
            showSnackbar(response.payload.message);
            buscarMatriculacion(search, calculateDate);
          } else {
            showSnackbar(response.payload.message);
          }
        } catch (error) {
          showSnackbar(error || "Error al eliminar los registros");
        }
      },
      onCancel: () => { },
    });
  };

  const handleEditMatriculacion = (row) => {
    const { isUploaded, createdAt, updatedAt, ...rest } = row;
    setMatricula({
      ...rest,
      multipleDistributors: row.distributor ? false : true,
    });
    setEdit(true);
    setOpenMatriculacion(true);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error("No se encontró la hoja en el archivo");
      }

      const headerRow = worksheet.getRow(1);
      const headers = headerRow.values.slice(1);

      const expectedHeaders = [
        // "Nombre",
        "Distribuidor",
        "Nombre Almacen",
        "Mes",
        "Estado",
      ];
      const normalizedHeaders = headers.map((h) => normalizeEncabezados(h));

      // Normaliza los esperados
      const normalizedExpected = expectedHeaders.map((h) => normalizeEncabezados(h));

      const missingHeaders = normalizedExpected.filter(
        (h) => !normalizedHeaders.includes(h)
      );
      if (missingHeaders.length > 0) {
        throw new Error(
          `Faltan columnas en el Excel: ${missingHeaders.join(", ")}`
        );
      }

      const colIndices = {
        distributor: headers.indexOf("Distribuidor"),
        storeName: headers.indexOf("Nombre Almacen"),
        calculateMonth: headers.indexOf("Mes"),
        status: headers.indexOf("Estado"),
      };

      const data = [];
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return;

        const rowValues = row.values.slice(1);

        const distributor = rowValues[colIndices.distributor] ?? "";
        const storeName = rowValues[colIndices.storeName] ?? "";
        const calculateMonth = rowValues[colIndices.calculateMonth] ?? "";
        const statusRaw = rowValues[colIndices.status] ?? "";

        const status =
          typeof statusRaw === "string"
            ? statusRaw.trim().toLowerCase() === "activo"
            : Boolean(statusRaw);

        data.push({
          distributor,
          storeName,
          calculateMonth: formatDate(calculateMonth),
          status,
        });
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

  const confirmarExportarExcel = () => {
    showDialog({
      title: "Confirmación de descarga",
      message:
        "Usted va a realizar la descarga del archivo excel de matriculaciones con fecha: " +
        formatDate(calculateDate),
      onConfirm: exportExcel,
      onCancel: () => { },
    });
  };

  const exportExcel = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        exportarExcel({
          excel_name: "matriculation",
          nombre: "Matriculaciones_Mes",
          calculateDate: formatDate(calculateDate),
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

  const handleCloseUploadExcel = () => {
    setOpenUploadExcel(false);
    setDatosExcel([]);
    setLoading(false);
    handleMenuClose();
  };

  const handleGuardarExcel = async () => {
    setLoading(true);
    try {
      const response = await dispatch(createMatriculacionBulk(datosExcel));
      if (response.meta.requestStatus === "fulfilled") {
        showSnackbar(response.payload.message);
        buscarMatriculacion(search, calculateDate);
        handleCloseUploadExcel();
      } else {
        showSnackbar(response.payload.message);
      }
    } catch (error) {
      showSnackbar(error || "Error al guardar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatriculacionBeforeMonth = async () => {
    if (!calculateDate) {
      showSnackbar("La fecha de matriculacion a crear es requerida");
      return;
    }
    if (!copyMonth) {
      showSnackbar("La fecha de copia de matriculaciones es requerida");
      return;
    }
    const response = await dispatch(
      createMatriculationBeforeMonth({
        calculateMonth: calculateDate,
        copyMonth: copyMonth,
      })
    );
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message);
      buscarMatriculacion(search, calculateDate);
      setOpenCreateMatriculacionBeforeMonth(false);
      setOpen(false);
    } else {
      showSnackbar(response.payload.message);
    }
  };

  return (
    <>
      <AtomContainerGeneral
        children={
          <>
            <>
              <IconoFlotante
                handleButtonClick={() => {
                  buscarMatriculacion(search, calculateDate);
                }}
                title="Actualizar lista"
                iconName="Refresh"
                right={60}
                color="#63B6FF"
                top={95}
              />
              {namePermission && (
                <>
                  {/* <IconoFlotante
                    handleButtonClick={handleMenuOpen}
                    title="Mas opciones"
                    iconName="MoreVert"
                    right={20}
                    top={95}
                  /> */}
                  <IconoFlotante
                    handleButtonClick={() => setOpenCreateMatriculacionBeforeMonth(true)}
                    title="Crear clientes por mes"
                    iconName="Add"
                    color="#0c9200ff"
                    right={20}
                    top={95}
                  />
                  {/* <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  > */}
                  {/* <MenuItem
                      sx={{
                        gap: 1,
                      }}
                      onClick={() =>
                        document
                          .getElementById("input-excel-matriculacion")
                          .click()
                      }
                    >
                      <ListItemIcon>
                        <DriveFolderUploadOutlinedIcon
                          sx={{
                            color: "white",
                            backgroundColor: "details.main",
                            borderRadius: "50%",
                            padding: "3px",
                          }}
                        />
                      </ListItemIcon>
                      <Typography variant="inherit">
                        Subir Excel matriculaciones
                      </Typography>
                    </MenuItem> */}
                  {/* <MenuItem
                    sx={{
                      gap: 1,
                    }}
                    onClick={confirmarExportarExcel}
                  >
                    <ListItemIcon>
                      <SaveAltIcon
                        sx={{
                          color: "white",
                          backgroundColor: "#5ab9f6",
                          borderRadius: "50%",
                          padding: "3px",
                        }}
                      />
                    </ListItemIcon>
                    <Typography variant="inherit">
                      Descargar lista matriculaciones
                    </Typography>
                  </MenuItem> */}
                  {/* <MenuItem
                      sx={{
                        gap: 1,
                      }}
                      onClick={() => setOpenCreateMatriculacionBeforeMonth(true)}
                    >
                      <ListItemIcon>
                        <AddIcon
                          sx={{
                            color: "white",
                            backgroundColor: "success.main",
                            borderRadius: "50%",
                            padding: "3px",
                          }}
                        />
                      </ListItemIcon>
                      <Typography variant="inherit">
                        Crear matriculaciones por mes
                      </Typography>
                    </MenuItem>
                  </Menu> */}
                  <input
                    id="input-excel-matriculacion"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </>
              )}
            </>
            <AtomCard
              title=""
              nameButton={matriculacionCerrada === "abierto" && namePermission ? "Crear" : ""}
              border={true}
              onClick={handleOpenMatriculacion}
              search={true}
              labelBuscador="Búsqueda por distribuidor o almacén"
              valueSearch={search}
              placeholder="Buscar por distribuidor o almacén"
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                debounceSearchMatriculacion(e.target.value);
              }}
              children={
                <>
                  {loading ? (
                    <AtomCircularProgress />
                  ) : (
                    <AtomTableForm
                      columns={columns}
                      data={dataMatriculacion}
                      actions={
                        matriculacionCerrada === "abierto" && namePermission
                          ? actions
                          : []
                      }

                      pagination={true}
                      page={page}
                      limit={limit}
                      count={totalMatriculacion}
                      selectable={matriculacionCerrada === "abierto" ? true : false}
                      selectedRows={selectedIds}
                      onSelectionChange={(ids) => {
                        setSelectedIds(ids);
                      }}
                      onDeleteSelected={handleDeleteSelected}
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
        openDialog={openMatriculacion}
        titleCrear="Crear matriculación"
        editDialog={edit}
        buttonCancel={true}
        maxWidth="md"
        buttonSubmit={true}
        handleSubmit={handleSubmit}
        handleCloseDialog={handleCloseMatriculacion}
        titleEditar="Editar matriculación"
        dialogContentComponent={
          <Grid container spacing={2} sx={{ width: "90%" }}>
            <Grid size={6}>
              <AtomTextField
                id="distributor"
                required={true}
                headerTitle="Distribuidor"
                value={matricula.distributor}
                disabled={matricula.multipleDistributors}
                onChange={(e) =>
                  setMatricula({
                    ...matricula,
                    distributor: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid size={6}>
              <AtomTextField
                id="storeName"
                headerTitle="Nombre de Almacén"
                value={matricula.storeName}
                disabled={matricula.multipleDistributors}
                onChange={(e) =>
                  setMatricula({
                    ...matricula,
                    storeName: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid size={6}>
              <AtomDatePicker
                id="calculateMonth"
                mode="month"
                required={true}
                label="Mes de matriculación"
                value={matricula.calculateMonth}
                onChange={(e) =>
                  setMatricula({
                    ...matricula,
                    calculateMonth: e,
                  })
                }
                error={errors.calculateMonth}
                helperText={
                  errors.calculateMonth &&
                  "El mes de matriculación es requerido"
                }
              />
            </Grid>
            <Grid size={6}>
              <AtomSwitch
                id="status"
                title="Estado"
                checked={matricula.status}
                onChange={(e) =>
                  setMatricula({
                    ...matricula,
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
        handleSubmit={handleGuardarExcel}
        buttonSubmit={loading ? false : true}
        maxWidth="md"
        handleCloseDialog={handleCloseUploadExcel}
        dialogContentComponent={
          <Box sx={{ width: "100%", justifyContent: "center" }}>
            {loading ? (
              <AtomCircularProgress />
            ) : (
              <>
                {datosExcel.length > 0 ? (
                  <AtomTableInformationExtraccion
                    columns={[
                      {
                        label: "Distribuidor",
                        field: "distributor",
                      },
                      {
                        label: "Almacen",
                        field: "storeName",
                      },
                      {
                        label: "Mes",
                        field: "calculateMonth",
                      },
                      {
                        label: "Estado",
                        field: "status",
                      },
                    ]}
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
      <AtomDialogForm
        openDialog={openCreateMatriculacionBeforeMonth}
        titleCrear="Crear matriculaciones por mes"
        buttonCancel={true}
        maxWidth="md"
        handleSubmit={handleCreateMatriculacionBeforeMonth}
        buttonSubmit={true}
        handleCloseDialog={() => {
          setOpenCreateMatriculacionBeforeMonth(false);
          setOpen(false);
        }}
        textButtonSubmit="Crear"
        dialogContentComponent={
          <Grid container spacing={2} sx={{ width: "90%" }}>
            <Grid size={12}>
              <Typography
                sx={{
                  fontSize: "13px",
                  backgroundColor: "#EBF7FF",
                  height: "40px",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#3B3B3B",
                  justifyContent: "center",
                  display: "flex",
                  width: "100%",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                ⚠️ Se van a crear matriculaciones para la fecha:{" "}
                {calculateDate}, copia de matriculaciones del mes
                de: {copyMonth || "No seleccionado"}
              </Typography>
            </Grid>
            <Grid size={6}>
              <AtomDatePicker
                id="calculateMonth"
                mode="month"
                required={true}
                label="Mes de matriculación"
                value={calculateDate}
                onChange={(e) => dispatch(setCalculateDate(e))}
              />
            </Grid>
            <Grid size={6}>
              <AtomDatePicker
                id="copyMonth"
                mode="month"
                required={true}
                label="Mes de matriculación a copiar"
                value={copyMonth}
                onChange={(e) => setCopyMonth(e)}
              />
            </Grid>
          </Grid>
        }
      />
    </>
  );
};

export default Matriculacion;
