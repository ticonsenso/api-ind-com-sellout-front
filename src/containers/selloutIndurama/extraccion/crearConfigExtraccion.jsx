import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import AtomTextField from "../../../atoms/AtomTextField";
import AccordionSection from "../../../atoms/AtomAccordion";
import { useDispatch, useSelector } from "react-redux";
import AtomButtonPrimary from "../../../atoms/AtomButtonPrimary";
import AtomTableActions from "../../../atoms/AtomTableActions";
import AtomSelect from "../../../atoms/AtomSelect";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  DeleteOutline as DeleteOutlineIcon,
  AutoFixHigh as AutoFixHighIcon,
} from "@mui/icons-material";
import { DATATYPE, SOURCE_TYPE_SELLOUT } from "../constantes";
import AtomSwitch from "../../../atoms/AtomSwitch";
import {
  Typography,
  Autocomplete,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  camposConfiguracion,
  camposParam,
  paramsValidateConfiguracion,
  columnsExtraccion,
  paramsValidateColums,
} from "../constantes";
import { useSnackbar } from "../../../context/SnacbarContext";
import { obtenerOptionsEmpresas } from "../../../redux/empresasSlice";
import { formatDate, validateForm } from "../../constantes";
import { useDialog } from "../../../context/DialogDeleteContext";
import {
  createExtractionsConfig,
  updateExtractionsConfig,
  obtenerColumnsExtractionsConfig,
  createColumnSellout,
  updateExtractionsColumn,
  deleteExtractionsColumn,
  obtenerColumnsSearch,
  obtenerExtractionsConfig,
  setDataColumnsSearch,
  createColumnArraySellout,
  obtenerMatriculacion,
  setCalculateDate
} from "../../../redux/configSelloutSlice";
import { optionsMappingToField } from "./constantes";
import {
  busquedaDistribuidorMaestrosStores,
  busquedaAlmacenMaestrosStores,
} from "../../../redux/configSelloutSlice";
import AtomAutocompleteLabel from "../../../atoms/AtomAutocomplete";
import AtomTitleForm from "../../../atoms/AtomTitleForm";
import AtomTableForm from "../../../atoms/AtomTableForm";
import AtomDatePicker from "../../../atoms/AtomDatePicker";

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const CrearConfiguracionExtraccion = ({ config }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const { showDialog } = useDialog();

  const calculateDate = useSelector(
    (state) => state?.configSellout?.calculateDate || formatDate(new Date())
  );
  const dataColumns = useSelector(
    (state) => state.configSellout.columnsExtracciones || []
  );
  const params = dataColumns.map((item) => ({
    ...item,
    nombreColumna:
      optionsMappingToField.find((option) => option.id === item.mappingToField)
        ?.label || "",
  }));

  const dataGeneral = useSelector(
    (state) => state.configSellout.dataColumnsSearch || []
  );
  const dataColumnsSearch = dataGeneral?.filter(
    (col) => !params.some((p) => p.columnName === col.columnName)
  );
  const busquedaMatriculacion = useSelector(
    (state) => state.configSellout.optionsMatriculacion || []
  );
  const idEmpresaIndurama = useSelector(
    (state) => state?.configSellout?.idEmpresaIndurama
  );
  const configuracionExtraccionSelloutId = useSelector(
    (state) => state.configSellout.configuracionExtraccionSelloutId
  );

  const optionsConfiguracionSellout = useSelector(
    (state) => state.configSellout.optionsConfiguracionSellout || []
  );
  const [initialStep, setInitialStep] = useState(0);
  const [searchMatriculacion, setSearchMatriculacion] = useState();
  const [configuracionId, setConfiguracionId] = useState("");
  const [errorsParam, setErrorsParam] = useState({});
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [errorsConfiguracion, setErrorsConfiguracion] = useState({});
  const [configuracion, setConfiguracion] = useState({
    name: config?.name || "",
    description: config?.description || "",
    codeStoreDistributor: config?.codeStoreDistributor || "",
    distributorCompanyName: config?.distributorCompanyName || "",
    sourceType: config?.sourceType || "FILE",
    sheetName: config?.sheetName || "",
    matriculationId: config?.matriculation?.id || null,
    calculateDate: calculateDate || formatDate(new Date()),
  });

  const [search, setSearch] = useState("");
  const [param, setParam] = useState({
    columnName: "",
    columnLetter: "",
    columnIndex: "",
    headerRow: "",
    startRow: "",
    mappingToField: "",
    dataType: "TEXT",
    isActive: true,
    selloutConfigurationId: configuracionExtraccionSelloutId,
    hasNegativeValue: false,
  });

  useEffect(() => {
    dispatch(obtenerOptionsEmpresas());
  }, [dispatch]);



  const handleCreate = () => {
    if (
      !validateForm(
        configuracion,
        paramsValidateConfiguracion,
        setErrorsConfiguracion
      )
    ) {
      showSnackbar("Por favor, complete todos los campos");
      return;
    }

    if (configuracionExtraccionSelloutId) {
      handleEditConfiguracion();
    } else {
      handleCreateConfiguracion();
    }
  };

  const handleCreateConfiguracion = async () => {
    const data = {
      ...configuracion,
      companyId: idEmpresaIndurama,
    }
    const response = await dispatch(createExtractionsConfig(data));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message);
      setInitialStep(1);
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const handleEditConfiguracion = async () => {
    const data = {
      id: configuracionExtraccionSelloutId,
      name: configuracion?.name || "",
      description: configuracion?.description || "",
      sourceType: configuracion?.sourceType || "",
      codeStoreDistributor: configuracion?.codeStoreDistributor || "",
      distributorCompanyName: configuracion?.distributorCompanyName || "",
      sheetName: configuracion?.sheetName || "",
      companyId: idEmpresaIndurama,
      matriculationId: configuracion?.matriculationId || null,
      calculateDate: configuracion?.calculateDate || null,
      initialSheet: configuracion?.initialSheet || null,
      endSheet: configuracion?.endSheet || null,
    };
    const response = await dispatch(updateExtractionsConfig(data));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message);
      setInitialStep(1);
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const handleDelete = (row) => {
    showDialog({
      title: "Eliminar Columna",
      message: "¿Estás seguro de que deseas eliminar esta columna?",
      onConfirm: async () => {
        const response = await dispatch(deleteExtractionsColumn(row.id));
        if (response.meta.requestStatus === "fulfilled") {
          showSnackbar(response.payload.message);
          buscarColumnas();
          setParam({});
        } else {
          showSnackbar(response.payload.message);
        }
      },
      onCancel: () => { },
    });
  };

  const handleEdit = (row) => {
    setParam(row);
  };

  const buttonMenu = [
    {
      label: "Editar",
      icon: <EditIcon />,
      color: "info",
      onClick: (row, index) => handleEdit(row, index),
    },
    {
      label: "Eliminar",
      icon: <DeleteIcon />,
      color: "error",
      onClick: (row, index) => handleDelete(row, index),
    },
  ];

  const handleEditColumnSearch = (row) => {
    setMostrarFormulario(true);
    const { id, ...rest } = row;
    setParam(rest);
  };

  const handleDeleteColumnSearch = (row) => {
    const newArray = dataColumnsSearch.filter((item) => item.id !== row.id);
    dispatch(setDataColumnsSearch(newArray));
  };

  const buttonMenuColumnsSearch = [
    {
      label: "Editar",
      icon: <EditIcon />,
      color: "info",
      onClick: (row, index) => handleEditColumnSearch(row, index),
    },
    {
      label: "Eliminar",
      icon: <DeleteIcon />,
      color: "error",
      onClick: (row, index) => handleDeleteColumnSearch(row, index),
    },
  ];

  const handleSaveColumn = () => {
    if (!validateForm(param, paramsValidateColums, setErrorsParam)) {
      showSnackbar("Por favor, complete todos los campos");
      return;
    }
    if (param.id) {
      handleEditColumn();
    } else {
      handleCreateColumn();
    }
  };

  const handleEditColumn = async () => {
    const data = {
      id: param.id,
      columnName: "",
      columnIndex: null,
      columnLetter: param.columnLetter,
      dataType: param.mappingToField === "saleDate" ? "DATE" : "TEXT",
      isRequired: true,
      mappingToField: param.mappingToField,
      headerRow: param.headerRow,
      startRow: param.startRow,
      isActive: true,
      selloutConfigurationId: configuracionExtraccionSelloutId,
      hasNegativeValue: false,
    };
    const response = await dispatch(updateExtractionsColumn(data));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message);
      buscarColumnas();
      setParam({});
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const handleCreateColumn = async () => {
    const data = {
      columnName: param.columnName || "",
      columnIndex: param.columnIndex || null,
      columnLetter: param.columnLetter,
      dataType: param.mappingToField === "saleDate" ? "DATE" : "TEXT",
      isRequired: true,
      mappingToField: param.mappingToField,
      headerRow: param.headerRow,
      startRow: param.startRow,
      isActive: true,
      selloutConfigurationId: configuracionExtraccionSelloutId,
      hasNegativeValue: param?.hasNegativeValue || false,

    };
    const response = await dispatch(createColumnSellout(data));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message);
      buscarColumnas();
      setParam({});
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const buscarColumnas = () => {
    dispatch(
      obtenerColumnsExtractionsConfig({
        selloutConfigurationId: configuracionExtraccionSelloutId,
      })
    );
  };

  useEffect(() => {
    obtenerListaMatriculacion(searchMatriculacion);
  }, [calculateDate]);

  useEffect(() => {
    if (configuracionExtraccionSelloutId) {
      buscarColumnas();
    }
  }, [configuracionExtraccionSelloutId]);

  const buscarConfiguraciones = async () => {
    await dispatch(obtenerExtractionsConfig({ search }));
  };

  useEffect(() => {
    buscarConfiguraciones();
  }, [search]);

  const handleSaveArrayColumn = async () => {
    const data = dataColumnsSearch.map(({ id, ...rest }) => ({
      ...rest,
      selloutConfigurationId: configuracionExtraccionSelloutId,
    }));
    const response = await dispatch(createColumnArraySellout(data));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message);
      buscarColumnas();
      setParam({});
      dispatch(setDataColumnsSearch(null));
      setMostrarFormulario(false);
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const handleLimpiarArrayColumn = () => {
    setMostrarFormulario(true);
    setSearch("");
    setConfiguracionId("");
    dispatch(setDataColumnsSearch(null));
    setParam({});
  };

  const obtenerListaMatriculacion = async (value) => {
    dispatch(
      obtenerMatriculacion({
        page: 1,
        limit: 200,
        search: value,
        calculateMonth: calculateDate,
      })
    );
  };

  const limpiarFormulario = () => {
    setMostrarFormulario(true);
    setParam({});
    setErrorsParam({});
  };

  const secciones = [
    {
      key: "datosGenerales",
      title: "Datos Generales",
      content: (
        <>
          <Grid
            container
            spacing={2}
            justifyContent="right"
            alignItems="center"
            mt={1}
            sx={{
              border: "1px solid #e8e8e8",
              borderRadius: 3,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#FFFFFF",
              padding: "16px",
            }}
          >
            <Grid size={12}>
              <AtomTitleForm title="Formulario de Configuración" />
            </Grid>
            <Grid size={4}>

              <AtomDatePicker
                id="calculateMonth"
                required={true}
                height="45px"
                mode="month"
                label="Fecha de carga"
                value={calculateDate || null}
                onChange={(e) => {
                  dispatch(setCalculateDate(e));
                }}
              />
            </Grid>
            <Grid size={4}>
              <AtomAutocompleteLabel
                id="matriculationId"
                label="Matriculación"
                options={busquedaMatriculacion || []}
                inputValue={searchMatriculacion || ""}
                onInputChange={(event, newInputValue) => {
                  setSearchMatriculacion(newInputValue);
                }}
                getOptionLabel={(option) => option?.label || ""}
                value={
                  busquedaMatriculacion.find(
                    (item) => item.id === configuracion?.matriculationId
                  ) || null
                }
                onChange={(event, newValue) => {
                  setConfiguracion({
                    ...configuracion,
                    matriculationId: newValue?.id || null,
                    codeStoreDistributor: newValue?.codeStoreDistributor || "",
                    distributorCompanyName: newValue?.distributor || "",
                    name: newValue?.label || "",
                  });
                  setSearchMatriculacion("");
                }}
              />
            </Grid>
            {camposConfiguracion.map((campo) => (
              <Grid size={campo.size} key={campo.id}>
                <AtomTextField
                  id={campo.id}
                  headerTitle={campo.headerTitle}
                  required={campo.required}
                  disabled={campo.disabled}
                  multiline={campo.multiline}
                  rows={campo.rows}
                  value={configuracion[campo.id] || ""}
                  placeholder={campo.placeholder}
                  error={errorsConfiguracion[campo.id] || false}
                  onChange={(e) => {
                    setConfiguracion({
                      ...configuracion,
                      [campo.id]: e.target.value,
                    });
                  }}
                />
              </Grid>
            ))}
            {/* <Grid size={4}>
              <AtomSelect
                id="sourceType"
                headerTitle="Tipo de fuente"
                value={configuracion.sourceType}
                onChange={(e) =>
                  setConfiguracion({
                    ...configuracion,
                    sourceType: e.target.value,
                  })
                }
                options={SOURCE_TYPE_SELLOUT}
                required={true}
              />
            </Grid> */}
            <Grid size={2}></Grid>
            <Grid size={2}>
              <AtomButtonPrimary
                id="create"
                label={"Guardar"}
                onClick={handleCreate}
              />
            </Grid>
          </Grid>
        </>
      ),
      isExpanded: initialStep === 0,
      onChange: (_, expanded) => {
        setInitialStep(expanded ? 0 : initialStep);
      },
    },
    {
      key: "configuracionColumnas",
      title: "Configuracion de Columnas",
      content: (
        <>
          <Grid
            container
            spacing={2}
            sx={{
              justifyContent: "right",
              display: "flex",
              mt: 2,
            }}
          >
            <Grid size={12}>
              <Grid container spacing={1}>
                <Grid
                  size={6}
                  sx={{
                    border: "1px solid #e8e8e8",
                    borderRadius: 3,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#FFFFFF",
                    padding: "16px",
                  }}
                >
                  <AtomTitleForm title="Búsqueda de configuraciones" />
                  <Grid container spacing={2}>
                    <Grid size={8}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#727176",
                          fontWeight: 400,
                          fontSize: "14px",
                          width: "100%",
                        }}
                      >
                        Seleccionar configuración{" "}
                        <span style={{ color: "#fb5f3f" }}> *</span>
                      </Typography>
                      <Autocomplete
                        id="configuracionId"
                        value={configuracionId}
                        inputValue={search}
                        onInputChange={(event, newInputValue) => {
                          setSearch(newInputValue);
                        }}
                        options={optionsConfiguracionSellout || []}
                        getOptionLabel={(option) => option?.label || ""}
                        onChange={(event, newValue) => {
                          setConfiguracionId(newValue);
                          if (newValue) {
                            dispatch(
                              obtenerColumnsSearch({
                                selloutConfigurationId: newValue.id,
                              })
                            );
                          }
                        }}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.label}
                          </li>
                        )}
                        sx={{
                          borderRadius: "8px",
                          fontSize: "12px",
                          height: "50px",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "transparent",
                              borderRadius: "8px",
                            },
                            "&:hover fieldset": {
                              height: "52px",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#757575",
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            fullWidth
                            placeholder="Seleccionar configuracion"
                            sx={{
                              backgroundColor: "#f5f5f5",
                              borderRadius: "8px",
                              fontSize: "13px",
                              height: "52px",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "transparent",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "#757575",
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid
                      size={3}
                      display="flex"
                      mt={2.5}
                      justifyContent="center"
                    >
                      {dataColumnsSearch.length > 0 && (
                        <>
                          <Tooltip title="Guardar">
                            <IconButton onClick={handleSaveArrayColumn}>
                              <SaveIcon
                                color="success"
                                sx={{
                                  backgroundColor: "#f5f5f5",
                                  borderRadius: "15px",
                                  padding: "5px",
                                  height: "30px",
                                  width: "30px",
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Limpiar datos">
                            <IconButton onClick={handleLimpiarArrayColumn}>
                              <AutoFixHighIcon
                                color="error"
                                sx={{
                                  backgroundColor: "#f5f5f5",
                                  borderRadius: "15px",
                                  padding: "5px",
                                  height: "30px",
                                  width: "30px",
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Grid>

                    {dataColumnsSearch.length > 0 && (
                      <Grid size={12}>
                        <AtomTableForm
                          data={dataColumnsSearch}
                          showIcons={true}
                          actions={buttonMenuColumnsSearch}
                          columns={columnsExtraccion}
                          pagination={false}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid
                  size={6}
                  sx={{
                    border: "1px solid #e8e8e8",
                    borderRadius: 3,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#FFFFFF",
                    padding: "16px",
                    alignItems: "center",
                    justifyContent: "right",
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      justifyContent: "right",
                      display: "flex",
                    }}
                  >
                    <Grid size={10.3}>
                      <AtomTitleForm title="Formulario de columnas" />
                    </Grid>
                    <Grid size={1.7}>
                      <IconButton onClick={limpiarFormulario}>
                        <AutoFixHighIcon color="error" />
                      </IconButton>
                    </Grid>
                    {mostrarFormulario && (
                      <>
                        <Grid size={6}>
                          <AtomSelect
                            id="mappingToField"
                            required={true}
                            headerTitle="Dato a extraer"
                            value={param?.mappingToField || ""}
                            onChange={(e) => {
                              setParam({
                                ...param,
                                mappingToField: e.target.value,
                              });
                            }}
                            options={optionsMappingToField}
                          />
                        </Grid>
                        {camposParam.map((campo) => (
                          <Grid size={campo.size} key={campo.id}>
                            <AtomTextField
                              id={campo.id}
                              type={campo.type}
                              headerTitle={campo.headerTitle}
                              required={campo.required}
                              value={param[campo.id] || ""}
                              placeholder={campo.placeholder}
                              error={errorsParam[campo.id] || false}
                              onChange={(e) =>
                                setParam({
                                  ...param,
                                  [campo.id]: e.target.value,
                                })
                              }
                            />
                          </Grid>
                        ))}
                        <Grid size={2}></Grid>
                        <Grid size={4} mt={3}>
                          <AtomButtonPrimary
                            id="create"
                            label={param.id ? "Editar" : "Crear"}
                            onClick={handleSaveColumn}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              size={12}
              sx={{
                border: "1px solid #e8e8e8",
                borderRadius: 4,
                boxShadow: 2,
              }}
            >
              <AtomTableForm
                data={params}
                showIcons={true}
                actions={buttonMenu}
                columns={columnsExtraccion}
                pagination={false}
              />
            </Grid>
          </Grid>
        </>
      ),
      isExpanded: initialStep === 1,
      onChange: (_, expanded) => {
        if (configuracionExtraccionSelloutId) {
          setInitialStep(expanded ? 1 : initialStep);
        } else {
          showSnackbar(
            "Debe crear una configuración para poder agregar columnas"
          );
          setInitialStep(0);
        }
      },
    },
  ];

  return (
    <Grid container spacing={2}>
      {secciones.map(
        ({ key, title, content, isExpanded = true, onChange, bgColor }) => (
          <Grid size={12} key={key}>
            <AccordionSection
              key={key}
              title={title}
              expanded={isExpanded}
              onChange={onChange}
              backgroundColor={bgColor}
            >
              {content}
            </AccordionSection>
          </Grid>
        )
      )}
    </Grid>
  );
};

export default CrearConfiguracionExtraccion;
