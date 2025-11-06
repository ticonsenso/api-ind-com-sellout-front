import AtomCard from "../../atoms/AtomCard";
import AtomTableForm from "../../atoms/AtomTableForm";
import { useEffect } from "react";
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
  maestrosProductsSic,
  maestrosStoresSic,
  guardarProductSicBulk,
  exportarExcel,
  obtenerConsolidatedSelloutUnique,
  guardarConsolidatedSellout,
  editStatusConsolidatedSellout,
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
  stylesPlantillaStandar,
  columnsProductNull,
  columnsStoreNull,
  camposPlantillaStandar,
  paramsValidatePlantillaStandar,
} from "./constantes";
import AtomTextField from "../../atoms/AtomTextField";
import IconoFlotante from "../../atoms/IconActionPage";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import AtomSwitch from "../../atoms/AtomSwitch";

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
  const dataConsolidatedAlert = useSelector(
    (state) => state?.configSellout?.dataConsolidatedAlert || null
  );
  const totalConsolidatedSellout = useSelector(
    (state) => state?.configSellout?.totalConsolidatedSellout || 0
  );
  const [filtroBusqueda, setFiltroBusqueda] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(pageGeneral);
  const [limit, setLimit] = useState(limitGeneral);
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [editState, setEditState] = useState(false);
  const [dataConsolidado, setDataConsolidado] = useState({
    saleDate: new Date(),
    distributor: "",
    codeStoreDistributor: "",
    codeProductDistributor: "",
    unitsSoldDistributor: "",
    status: true,
  });
  const [openDialogProduct, setOpenDialogProduct] = useState(false);
  const [openDialogoSincronizar, setOpenDialogoSincronizar] = useState(false);
  const [openDialogProductNull, setOpenDialogProductNull] = useState(false);
  const [openDialogStoreNull, setOpenDialogStoreNull] = useState(false);
  const [dataSincronizar, setDataSincronizar] = useState({
    year: 2025,
    month: null,
  });
  const [dataEditable, setDataEditable] = useState([]);
  const [resultadosActualizados, setResultadosActualizados] = useState([]);

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
    setResultadosActualizados([]);
    setDataEditable([]);
    setResultadosActualizados([]);
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
    const status = {
      id: dataConsolidado.id,
      status: dataConsolidado.status,
    };
    const response = await dispatch(editStatusConsolidatedSellout(status));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message);
      handleCloseDialogProduct();
      buscarConsolidado();
      dispatch(getConsolidatedAlert({ calculateDate: date }));
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const handleCrearConsolidado = async () => {
    const dataFinal = {
      ...dataConsolidado,
      saleDate: formatDate(dataConsolidado.saleDate),
      calculateDate: formatDate(new Date()),
    };
    const response = await dispatch(guardarConsolidatedSellout(dataFinal));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message);
      handleCloseDialogProduct();
      buscarConsolidado();
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const handleGuardarConsolidado = async () => {
    if (!validateForm()) {
      showSnackbar("Complete los campos requeridos");
      return;
    }
    if (editState) {
      handleEditarConsolidado();
    } else {
      handleCrearConsolidado();
    }
  };

  const handleActualizarProducto = async (newRow) => {
    if (newRow.codeProduct === "") {
      return;
    }
    try {
      const response = await dispatch(maestrosProductsSic(newRow.codeProduct));
      if (response.meta.requestStatus === "rejected") {
        showSnackbar(response.payload.message);
      }
      // if (response.meta.requestStatus === "fulfilled") {
      const dataProducto = response?.payload || null;

      const nuevaData = dataEditable.map((item) => {
        if (item.id === newRow.id) {
          const productModelActualizado = dataProducto.productModel || "";
          return {
            ...item,
            codeProduct: newRow.codeProduct,
            productModel: productModelActualizado,
          };
        }
        return item;
      });
      setDataEditable(nuevaData);

      const actualizado = nuevaData.find(
        (item) => item.codeProduct === newRow.codeProduct
      );

      const nuevoObjeto = {
        id: actualizado.id,
        distributor: actualizado.distributor,
        codeProductDistributor: actualizado.codeProductDistributor,
        codeProduct: dataProducto.productSic || newRow.codeProduct,
        descriptionDistributor: actualizado.descriptionDistributor,
      };

      setResultadosActualizados((prev) => {
        const existe = prev.some(
          (obj) =>
            obj.codeProductSic === nuevoObjeto.codeProductSic &&
            obj.searchProductStore === nuevoObjeto.searchProductStore
        );
        return existe ? prev : [...prev, nuevoObjeto];
      });
      // } else {
      //   showSnackbar(response.payload.message);
      // }
    } catch (error) {
      showSnackbar(error.message);
    }
  };

  const handleActualizarAlmacen = async (newRow) => {
    if (newRow.codeStore === "") {
      return;
    }
    try {
      const response = await dispatch(maestrosStoresSic(newRow.codeStore));
      if (response.meta.requestStatus === "rejected") {
        showSnackbar(response.payload.message);
      }
      // if (response.meta.requestStatus === "fulfilled") {
      const dataAlmacen = response?.payload || null;
      const nuevaData = dataEditable.map((item) => {
        if (item.id === newRow.id) {
          return {
            ...item,
            codeStore: newRow.codeStore,
            storeName: dataAlmacen.storeName,
          };
        }
        return item;
      });
      setDataEditable(nuevaData);
      const actualizado = nuevaData.find(
        (item) => item.codeStore === newRow.codeStore
      );
      const nuevoObjeto = {
        id: actualizado.id,
        distributor: actualizado.distributor,
        codeStoreDistributor: actualizado.codeStoreDistributor,
        codeStore: actualizado.codeStore || newRow.codeStore,
      };
      setResultadosActualizados((prev) => {
        const existe = prev.some(
          (obj) =>
            obj.codeStoreSic === nuevoObjeto.codeStoreSic &&
            obj.searchStore === nuevoObjeto.searchStore
        );
        return existe ? prev : [...prev, nuevoObjeto];
      });
      // } else {
      //   showSnackbar(response.payload.message);
      // }
    } catch (error) {
      showSnackbar(error.message);
    }
  };

  const handleGuardarProductSic = async () => {
    const response = await dispatch(
      guardarProductSicBulk(resultadosActualizados)
    );
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message);
      setResultadosActualizados([]);
      setOpenDialogProductNull(false);
      clearFilters();
      setFiltroBusqueda("");
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const handleGuardarStoreSic = async () => {
    const response = await dispatch(
      guardarProductSicBulk(resultadosActualizados)
    );
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message);
      setResultadosActualizados([]);
      setOpenDialogStoreNull(false);
      clearFilters();
      setFiltroBusqueda("");
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(event.target.value);
    setPage(1);
  };

  const handleOpenDialogStoreNull = async () => {
    setLoading(true);
    setOpenDialogStoreNull(true);
    const response = await dispatch(
      obtenerConsolidatedSelloutUnique({
        calculateDate: date,
        codeStore: true,
      })
    );
    if (response.meta.requestStatus === "fulfilled") {
      llamarDataStoreNull(response.payload.items);
    } else {
      setLoading(false);
      showSnackbar(response.payload.message || "Error al obtener datos");
    }
  };

  const llamarDataStoreNull = (data) => {
    const dataStoreNull = data.map((item) => {
      return {
        ...item,
        searchStore: `${item.distributor}${item.codeStoreDistributor}`.replace(
          /\s+/g,
          ""
        ),
      };
    });
    setDataEditable(dataStoreNull);
    setLoading(false);
  };

  const handleOpenDialogProductNull = async () => {
    setLoading(true);
    setOpenDialogProductNull(true);
    const response = await dispatch(
      obtenerConsolidatedSelloutUnique({
        calculateDate: date,
        codeProduct: true,
      })
    );

    if (response.meta.requestStatus === "fulfilled") {
      llamarDataProductNull(response.payload.items);
    } else {
      setLoading(false);
      showSnackbar(response.payload.message || "Error al obtener datos");
    }
  };

  const llamarDataProductNull = (data) => {
    const dataProductNull = data.map((item) => {
      return {
        ...item,
        searchProduct:
          `${item.distributor}${item.codeProductDistributor}${item.descriptionDistributor}`.replace(
            /\s+/g,
            ""
          ),
      };
    });
    setDataEditable(dataProductNull);
    setLoading(false);
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
      showSnackbar(response.payload.message);
      buscarConsolidado();
      setLoading(false);
    } else {
      showSnackbar(response.payload.message);
      setLoading(false);
    }
  };

  const buscarConsolidado = async () => {
    setLoading(true);
    try {
      const filtros = {
        search,
        page,
        limit,
        calculateDate: formatDate(date),
        ...(filtroBusqueda ? { [filtroBusqueda]: true } : {}),
      };

      await dispatch(obtenerConsolidatedSellout(filtros));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarConsolidado();
    dispatch(getConsolidatedAlert({ calculateDate: date }));
  }, [search, page, limit, filtroBusqueda, date]);

  const optionsFiltros = [
    {
      id: "codeProduct",
      label: "Código de producto",
    },
    {
      id: "codeStore",
      label: "Código de almacén",
    },
    {
      id: "authorizedDistributor",
      label: "Distribuidor autorizado",
    },
    {
      id: "storeName",
      label: "Nombre de almacén",
    },
    {
      id: "productModel",
      label: "Modelo del producto",
    },
  ];

  const clearFilters = () => {
    setFiltroBusqueda(null);
    setSearch("");
    setPage(1);
    setLimit(limitGeneral);
    setDataEditable([]);
    setResultadosActualizados([]);
  };

  const isAlertVacia = (alerta) => {
    if (!alerta) return true;

    return Object.values(alerta).every((valor) => valor === 0);
  };

  const exportExcel = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        exportarExcel({
          excel_name: "consolidated_data_stores",
          nombre: "Plantilla estándar",
          calculateDate: formatDate(date),
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

  const handleEditState = (row) => {
    setDataConsolidado(row);
    setEditState(true);
    setOpenDialogProduct(true);
  };

  const actions = [
    {
      label: "Editar estado",
      icon: "SaveAlt",
      color: "info",
      onClick: (row) => {
        handleEditState(row);
      },
    },
  ];

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
            <Box mb={1} mt={-1}>
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
            </Box>

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
                    sx={{ justifyContent: "flex-end" }}
                  >
                    <Grid size={3}>
                      <AtomDatePicker
                        required={true}
                        mode="month"
                        label="Fecha cálculo"
                        value={date}
                        onChange={(value) => setDate(value)}
                      />
                    </Grid>
                    <Grid size={3}>
                      <AtomSelect
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
                      <Tooltip title="Buscar por distribuidor, código de producto, código de almacén y descripción distribuidor">
                        <TextField
                          variant="outlined"
                          value={search}
                          onChange={(e) => {
                            setPage(1);
                            setLimit(limitGeneral);
                            setSearch(e.target.value);
                          }}
                          placeholder="Buscar por:"
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
                                backgroundColor: "#f5f5f5",
                                borderRadius: "8px",
                                fontSize: "15px",
                                height: "50px",
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
                      actions={actions}
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
        openDialog={openDialogProductNull}
        titleCrear={"Productos sin código"}
        buttonCancel={true}
        textButtonSubmit="Confirmar"
        buttonSubmit={true}
        handleSubmit={handleGuardarProductSic}
        maxWidth="xl"
        handleCloseDialog={() => {
          setOpenDialogProductNull(false);
          clearFilters();
        }}
        dialogContentComponent={
          loading ? (
            <AtomCircularProgress />
          ) : (
            <Box component={Paper} sx={{ width: "100%", borderRadius: 3 }}>
              <DataGrid
                rows={dataEditable}
                columns={columnsProductNull}
                getRowHeight={() => "auto"}
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "#f5f5f5",
                    color: "#434343",
                    fontWeight: 600,
                  },
                  "& .MuiDataGrid-columnHeader:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  "& .MuiDataGrid-cell": {
                    color: "#434343",
                    fontSize: "12px",
                    pt: 0.5,
                    pb: 0.5,
                  },
                  "& .MuiDataGrid-cell:hover": {
                    color: "#434343",
                  },
                }}
                disableSelectionOnClick
                // hideFooter
                processRowUpdate={(newRow) => {
                  handleActualizarProducto(newRow);
                  return newRow;
                }}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              />
            </Box>
          )
        }
      />
      <AtomDialogForm
        openDialog={openDialogStoreNull}
        titleCrear={"Almacenes sin código"}
        buttonCancel={true}
        textButtonSubmit="Confirmar"
        buttonSubmit={true}
        handleSubmit={handleGuardarStoreSic}
        maxWidth="xl"
        handleCloseDialog={() => {
          setOpenDialogStoreNull(false);
          clearFilters();
        }}
        dialogContentComponent={
          loading ? (
            <AtomCircularProgress />
          ) : (
            <Box component={Paper} sx={{ width: "100%", borderRadius: 3 }}>
              <DataGrid
                rows={dataEditable}
                columns={columnsStoreNull}
                getRowHeight={() => "auto"}
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "#f5f5f5",
                    color: "#434343",
                    fontWeight: 600,
                  },
                  "& .MuiDataGrid-columnHeader:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  "& .MuiDataGrid-cell": {
                    color: "#434343",
                    fontSize: "12px",
                    pt: 0.5,
                    pb: 0.5,
                  },
                  "& .MuiDataGrid-cell:hover": {
                    color: "#434343",
                  },
                }}
                disableSelectionOnClick
                // hideFooter
                processRowUpdate={(newRow) => {
                  handleActualizarAlmacen(newRow);
                  return newRow;
                }}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              />
            </Box>
          )
        }
      />
      <AtomDialogForm
        openDialog={openDialogProduct}
        titleCrear={
          editState
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
                  disabled={editState}
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
                disabled={editState}
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
            <Grid size={6}>
              <AtomSwitch
                id="status"
                title="Aplica homologación"
                tooltip="Define si el registro aplica homologación"
                checked={dataConsolidado.status}
                onChange={(e) =>
                  setDataConsolidado({
                    ...dataConsolidado,
                    status: e.target.checked,
                  })
                }
              />
            </Grid>
          </Grid>
        }
      />
    </>
  );
};

export default PlantillaStandar;
