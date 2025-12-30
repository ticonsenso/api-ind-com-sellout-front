import AtomCard from "../../atoms/AtomCard";
import AtomTableForm from "../../atoms/AtomTableForm";
import { useEffect, useCallback } from "react";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { useState } from "react";
import AtomButtonPrimary from "../../atoms/AtomButtonPrimary";
import { useSnackbar } from "../../context/SnacbarContext";
import AtomCircularProgress from "../../atoms/AtomCircularProgress";
import AtomDatePicker from "../../atoms/AtomDatePicker";
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Sync as SyncIcon,
} from "@mui/icons-material";
import {
  obtenerConsolidatedSellout,
  getConsolidatedAlert,
  sincronizarDatosConsolidated,
  exportarExcel,
  guardarConsolidatedSellout,
  updateArraySellout,
} from "../../redux/configSelloutSlice";
import { columnsPlantillaStandar } from "./constantes";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import AtomSelect from "../../atoms/AtomSelect";
import AtomAlert from "../../atoms/AtomAlert";
import { limitGeneral, pageGeneral } from "../../containers/constantes";
import Grid from "@mui/material/Grid";
import { mesesNum } from "./constantes";
import SelectorAnioForm from "../../atoms/AtomAnualInput";
import AtomDialogForm from "../../atoms/AtomDialogForm";
import {
  camposPlantillaStandar,
  paramsValidatePlantillaStandar,
} from "./constantes";
import AtomTextField from "../../atoms/AtomTextField";
import IconoFlotante from "../../atoms/IconActionPage";
import { setCalculateDate } from "../../redux/configSelloutSlice";
import AtomSwitch from "../../atoms/AtomSwitch";
import { debounce } from "../constantes";

const formatDate = (fechaISO) => {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getUTCDate()).padStart(2, "0");
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const anio = fecha.getUTCFullYear();
  return `${anio}-${mes}-${dia}`;
};

const PlantillaStandar = () => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const dataConsolidatedSellout = useSelector(
    (state) => state?.configSellout?.dataConsolidatedSellout || []
  );
  const calculateDate = useSelector(
    (state) => state?.configSellout?.calculateDate || formatDate(new Date())
  );

  const totalConsolidatedSellout = useSelector(
    (state) => state?.configSellout?.totalConsolidatedSellout || 0
  );
  const [filtroBusqueda, setFiltroBusqueda] = useState("distributor");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(pageGeneral);
  const [limit, setLimit] = useState(limitGeneral);
  const [errors, setErrors] = useState({});
  const [edit, setEdit] = useState(false);
  const [dataConsolidado, setDataConsolidado] = useState({
    saleDate: calculateDate,
    distributor: "",
    codeStoreDistributor: "",
    codeProductDistributor: "",
    unitsSoldDistributor: "",
    status: true,
  });
  const [openDialogProduct, setOpenDialogProduct] = useState(false);
  const [openDialogoSincronizar, setOpenDialogoSincronizar] = useState(false);
  const [dataSincronizar, setDataSincronizar] = useState({
    year: 2025,
    month: null,
  });

  const handleOpenCreateProducts = () => {
    setOpenDialogProduct(true);
  };

  const handleCloseDialogProduct = () => {
    setOpenDialogProduct(false);
    setDataConsolidado({
      saleDate: new Date(),
      distributor: "",
      codeStoreDistributor: "",
      codeProductDistributor: "",
      unitsSoldDistributor: "",
      status: true,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    paramsValidatePlantillaStandar.forEach((field) => {
      if (!dataConsolidado[field]) {
        newErrors[field] = true;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleEditarConsolidado = async () => {
    const { codeStoreStatus, codeProductStatus, ...rest } = dataConsolidado;
    const newCodeProduct = codeProductStatus === true ? null : dataConsolidado.codeProduct;
    const newCodeStore = codeStoreStatus === true ? null : dataConsolidado.codeStore;
    const data = {
      ...rest,
      codeProduct: newCodeProduct,
      codeStore: newCodeStore,
    };
    const response = await dispatch(updateArraySellout(data));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message, { severity: "success" });
      handleCloseDialogProduct();
      buscarConsolidado();
      dispatch(getConsolidatedAlert({
        calculateDate: calculateDate,
      }));
    } else {
      showSnackbar(response.payload.message, { severity: "error" });
    }
  };

  const handleCrearConsolidado = async () => {
    const dataFinal = {
      ...dataConsolidado,
      saleDate: formatDate(dataConsolidado.saleDate),
      calculateDate,
    };
    const response = await dispatch(guardarConsolidatedSellout(dataFinal));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message, { severity: "success" });
      handleCloseDialogProduct();
      buscarConsolidado();
    } else {
      showSnackbar(response.payload.message, { severity: "error" });
    }
  };

  const handleGuardarConsolidado = async () => {
    if (!validateForm()) {
      showSnackbar("Complete los campos requeridos", { severity: "error" });
      return;
    }
    if (dataConsolidado.id) {
      handleEditarConsolidado();

    } else {
      handleCrearConsolidado();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(event.target.value);
    setPage(1);
  };

  const handleOpenDialogoSincronizar = () => {
    setOpenDialogoSincronizar(true);
  };

  const handleCloseDialogoSincronizar = () => {
    setOpenDialogoSincronizar(false);
    setDataSincronizar({
      year: 2025,
      month: null,
    });
  };

  const handleSincronizar = async () => {
    setLoading(true);
    const response = await dispatch(
      sincronizarDatosConsolidated(dataSincronizar)
    );
    if (response.meta.requestStatus === "fulfilled") {
      handleCloseDialogoSincronizar();
      showSnackbar(response.payload.message, { severity: "success" });
      buscarConsolidado();
      setLoading(false);
    } else {
      showSnackbar(response.payload.message, { severity: "error" });
      setLoading(false);
    }
  };

  const debounceSearch = useCallback(
    debounce((value) => {
      buscarConsolidado(value);
    }, 1000),
    [filtroBusqueda]
  );


  const buscarConsolidado = async (value) => {
    setLoading(true);
    try {
      const filtros = {
        [filtroBusqueda]: value,
        page,
        limit,
        calculateDate: calculateDate,
      };

      await dispatch(obtenerConsolidatedSellout(filtros));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (calculateDate) {
      buscarConsolidado(search);
    }
  }, [calculateDate, page, limit]);


  const optionsFiltros = [

    {
      id: "distributor",
      label: "Distribuidor",
    },
    {
      id: "codeStoreDistributor",
      label: "Código almacén distribuidor",
    },
    {
      id: "codeProductDistributor",
      label: "Código producto distribuidor",
    },
    {
      id: "descriptionDistributor",
      label: "Descripción Distribuidor ",
    },
  ];

  const clearFilters = () => {
    setFiltroBusqueda(null);
    setSearch("");
    setPage(1);
    setLimit(limitGeneral);
  };

  const exportExcel = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        exportarExcel({
          excel_name: "consolidated_data_stores",
          nombre: "Plantilla estándar",
          calculateDate: formatDate(calculateDate),
        })
      );
      if (response.meta.requestStatus === "fulfilled") {
        setLoading(false);
        showSnackbar(
          response.payload.message || "Archivo descargado correctamente", { severity: "success" }
        );
      }
    } catch (error) {
      showSnackbar(error.message || "Error al descargar el archivo", { severity: "error" });
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
              handleButtonClick={handleOpenCreateProducts}
              title="Nuevo registro plantilla stdr"
              iconName="Add"
              color="green"
              right={125}
            />
            <IconoFlotante
              handleButtonClick={exportExcel}
              title="Descargar excel"
              iconName="SaveAlt"
              color="#5ab9f6"
              right={77}
            />

            <IconoFlotante
              handleButtonClick={clearFilters}
              title="Limpiar filtros"
              iconName="AutoFixHigh"
              color="#da161e"
            />
            {/* <Box mb={1} mt={-1}>
              {dataConsolidatedAlert &&
                !isAlertVacia(dataConsolidatedAlert) && (
                  <AtomAlert
                    severity="warning"
                    text={
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, fontSize: "13px" }}>
                          Requiere correcciones:
                        </Typography>
                        <Box sx={stylesPlantillaStandar.box}>
                          {[
                            {
                              key: "codeProduct",
                              label: "Productos sin código",
                            },
                            {
                              key: "codeStore",
                              label: "Almacenes sin código",
                            },
                          ].map(({ key, label }) => {
                            const value = dataConsolidatedAlert[key];
                            if (value > 0) {
                              const handleClick = () => {
                                if (label.toLowerCase().includes("producto")) {
                                  handleOpenDialogProductNull();
                                } else {
                                  handleOpenDialogStoreNull();
                                }
                              };

                              return (
                                <Box
                                  key={key}
                                  onClick={handleClick}
                                  sx={{ cursor: "pointer" }}
                                >
                                  <Tooltip title={`Editar ${label}`}>
                                    <Typography
                                      sx={{
                                        ...stylesPlantillaStandar.alert,
                                        color: "details.main",
                                        textDecoration: "none",
                                        "&:hover": {
                                          textDecoration: "underline",
                                        },
                                      }}
                                    >
                                      <span style={stylesPlantillaStandar.bold}>
                                        {label}:
                                      </span>{" "}
                                      {value}
                                    </Typography>
                                  </Tooltip>
                                </Box>
                              );
                            }
                            return null;
                          })}
                        </Box>
                      </Box>
                    }
                  />
                )}
            </Box> */}

            <AtomCard
              title=""
              nameButton=""
              border={true}
              search={false}
              valueSearch={search}
              onChange={(e) => {
                setPage(1);
                setLimit(limitGeneral);
                setSearch(e.target.value);
                setFiltroBusqueda(null);

              }}
              children={
                <>
                  <Grid
                    container
                    spacing={2}
                    sx={{ justifyContent: "center" }}
                  >
                    <Grid size={3}>
                      <AtomDatePicker
                        required={true}
                        mode="month"
                        color="#ffffff"
                        height="45px"
                        label="Fecha de carga"
                        value={calculateDate}
                        onChange={(value) => dispatch(setCalculateDate(value))}
                      />
                    </Grid>
                    <Grid size={3}>
                      <AtomSelect
                        color="#ffffff"
                        height="45px"
                        headerTitle="Seleccionar filtro"
                        options={optionsFiltros}
                        placeholder="Seleccionar..."
                        onChange={(e) => {
                          setFiltroBusqueda(e.target.value);
                        }}
                        value={filtroBusqueda}
                      />
                    </Grid>

                    <Grid size={4} mt={2.8}>
                      <Tooltip title="Buscar por distribuidor, código almacén, código producto y descripción">
                        <TextField
                          variant="outlined"
                          value={search}
                          onChange={(e) => {
                            setPage(1);
                            setLimit(limitGeneral);
                            setSearch(e.target.value);
                            debounceSearch(e.target.value);
                          }}
                          placeholder="Buscar..."
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton aria-label="buscar">
                                    <SearchIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                              style: {
                                backgroundColor: "#ffffffff",
                                borderRadius: "8px",
                                fontSize: "15px",
                                height: "45px",
                              },
                            },
                          }}
                          sx={{
                            fontFamily:
                              "Visby Round CF, Arial, sans-serif,bold",
                            fontSize: "14px",
                            width: "100%",
                            maxWidth: "500px",
                            minWidth: "200px",
                            height: "40px",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "transparent",
                              },
                              "&:hover fieldset": {
                                borderColor: "gray",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#757575",
                            },
                          }}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid size={2} mt={2.8}>
                      <AtomButtonPrimary
                        label="Sincronizar"
                        height="45px"
                        icon={<SyncIcon />}
                        onClick={handleOpenDialogoSincronizar}
                      />
                    </Grid>
                  </Grid>

                  {loading ? (
                    <AtomCircularProgress />
                  ) : (
                    <AtomTableForm
                      columns={columnsPlantillaStandar}
                      data={dataConsolidatedSellout}
                      showIcons={true}
                      pagination={true}
                      // actions={actions}
                      page={page}
                      limit={limit}
                      count={totalConsolidatedSellout}
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
        openDialog={openDialogoSincronizar}
        titleCrear={""}
        buttonCancel={true}
        textButtonSubmit="Sincronizar"
        maxWidth="md"
        handleCloseDialog={() => {
          setOpenDialogoSincronizar(false);
          setLoading(false);
        }}
        dialogContentComponent={
          <>
            {loading ? (
              <AtomCircularProgress />
            ) : (
              <Grid
                container
                spacing={2}
                justifyContent="center"
                mt={2}
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: 2,
                  borderRadius: 2,
                }}
              >
                <Grid
                  size={12}
                  sx={{
                    textAlign: "center",
                    backgroundColor: "#f5f5f5",
                    padding: 2,
                    borderRadius: 2,
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "1.2rem",
                      color: "#434343",
                    }}
                  >
                    Sincronización de datos
                  </Typography>
                </Grid>
                <Grid size={4.5}>
                  <SelectorAnioForm
                    anioInicio={2025}
                    color="#ffffff"
                    anioSeleccionado={dataSincronizar.year}
                    onChange={(e) =>
                      setDataSincronizar({
                        ...dataSincronizar,
                        year: e.target.value,
                      })
                    }
                    headerTitle="Seleccionar año"
                    required
                  />
                </Grid>
                <Grid size={4.5}>
                  <AtomSelect
                    headerTitle="Seleccionar mes"
                    value={dataSincronizar.month}
                    required
                    color="#ffffff"
                    onChange={(e) =>
                      setDataSincronizar({
                        ...dataSincronizar,
                        month: e.target.value,
                      })
                    }
                    options={mesesNum}
                  />
                </Grid>
                <Grid size={2.5} sx={{ mt: 2.5 }}>
                  <AtomButtonPrimary
                    label="Confirmar"
                    nameIcon={<CheckCircleIcon />}
                    onClick={handleSincronizar}
                    disabled={dataSincronizar.month === null || loading}
                  />
                </Grid>
              </Grid>
            )}
          </>
        }
      />
      <AtomDialogForm
        openDialog={openDialogProduct}
        titleCrear={
          edit
            ? "Editar registro plantilla consolidado"
            : "Crear registro plantilla consolidado"
        }
        buttonCancel={true}
        maxWidth="md"
        buttonSubmit={true}
        handleSubmit={handleGuardarConsolidado}
        handleCloseDialog={handleCloseDialogProduct}
        dialogContentComponent={
          <Grid
            container
            spacing={2}
            sx={{ width: "80%", justifyContent: "right" }}
          >
            {camposPlantillaStandar.map((campo) => (
              <Grid size={campo.size} key={campo.id}>
                <AtomTextField
                  id={campo.id}
                  headerTitle={campo.headerTitle}
                  required={campo.required}
                  type={campo.type}
                  disabled={edit}
                  value={dataConsolidado[campo.id]}
                  onChange={(e) => {
                    setDataConsolidado({
                      ...dataConsolidado,
                      [campo.id]: e.target.value,
                    });
                  }}
                  error={errors[campo.id]}
                  helperText={errors[campo.id] && "Campo requerido"}
                />
              </Grid>
            ))}
            <Grid size={6}>
              <AtomDatePicker
                id="saleDate"
                label="Fecha Ultimo día mes"
                required={true}
                disabled={edit}
                value={dataConsolidado.saleDate || new Date() || null}
                onChange={(e) => {
                  setDataConsolidado({
                    ...dataConsolidado,
                    saleDate: formatDate(e),
                  });
                }}
                error={errors.saleDate}
                helperText={errors.saleDate && "Campo requerido"}
              />
            </Grid>
            {dataConsolidado.id && (
              <>

                <Grid size={6}>
                  <AtomSwitch
                    id="codeStore"
                    title="No se visita"
                    tooltip="Define si el almacén se visita"
                    checked={dataConsolidado.codeStoreStatus}
                    onChange={(e) =>
                      setDataConsolidado({
                        ...dataConsolidado,
                        codeStoreStatus: e.target.checked,
                      })
                    }
                  />
                </Grid>
                <Grid size={6}>
                  <AtomSwitch
                    id="codeProduct"
                    title="Código de producto: OTROS"
                    tooltip="Codigo de producto: OTROS"
                    checked={dataConsolidado.codeProductStatus}
                    onChange={(e) =>
                      setDataConsolidado({
                        ...dataConsolidado,
                        codeProductStatus: e.target.checked,
                      })
                    }
                  />
                </Grid>
              </>
            )
            }

          </Grid>
        }
      />
    </>
  );
};

export default PlantillaStandar;
