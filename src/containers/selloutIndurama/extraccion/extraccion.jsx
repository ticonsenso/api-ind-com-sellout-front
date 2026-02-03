import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  CAMPOS_CONFIG_ESTANDAR,
  etiquetasColumnas,
  isClosed,
} from "./constantes";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  UploadFile as UploadFileIcon,
  BrowserUpdated as BrowserUpdatedIcon,
  PictureAsPdf as PictureAsPdfIcon,
  ExpandMore as ExpandMoreIcon,
  InfoOutlined as InfoOutlinedIcon,
  LabelImportant as LabelImportantIcon,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import AtomTextFielInputForm from "../../../atoms/AtomTextField";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import AtomTextField from "../../../atoms/AtomTextField";
import AtomTableExtraccion from "../../../atoms/AtomTableExtraccion";
import { setConfiguracionExtraccionId } from "../../../redux/extraccionSlice";
import AtomButtonPrimary from "../../../atoms/AtomButtonPrimary";
import { useSnackbar } from "../../../context/SnacbarContext";
import AtomContainerGeneral from "../../../atoms/AtomContainerGeneral";
import { obtenerOptionsEmpresas } from "../../../redux/empresasSlice";
import AtomDatePicker from "../../../atoms/AtomDatePicker";
import AtomDialogForm from "../../../atoms/AtomDialogForm";
import {
  obtenerExtractionsConfig,
  setIdEmpresaIndurama,
  sendSellout,
  obtenerColumnsExtractionsConfig,
  createMaestrosStores,
  obtenerMatriculacion,
} from "../../../redux/configSelloutSlice";
import AtomSwitch from "../../../atoms/AtomSwitch";
import AtomAutocompleteLabel from "../../../atoms/AtomAutocomplete";
import * as XLSX from "xlsx";
import { camposMaestrosStores } from "../maestros/constantes";
import AtomAlert from "../../../atoms/AtomAlert";
import AtomCircularProgress from "../../../atoms/AtomCircularProgress";
import { mensajeExtraccion, normalizeSpaces } from "../../constantes";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import * as pdfjsLib from "pdfjs-dist";
import IconoFlotante from "../../../atoms/IconActionPage";
pdfjsLib.GlobalWorkerOptions.workerSrc = "../../../public/pdfWorker.js";
import { normalizarTexto, formatDate } from "./constantes";
import { obtenerMatriculacionConfig } from "../../../redux/selloutDatosSlic";
import { useDialog } from "../../../context/DialogDeleteContext";
import { obtenerListaCategorias } from "../../../redux/diccionarioSlice"
import { setCalculateDate } from "../../../redux/configSelloutSlice";
import BotonProcesarExcel from "./cargarExcel";
import {
  repartirValoresNumerico,
  construirFechaDesdeComponente,
  extraerTextoCelda,
  normalizarFechaISO,
  getUltimoDiaMesActual,
  detectHeader,
  detectarColumnasAutomaticamente,
  validarDescripcion,
  validarAlmacen,
  extractRowsFromWorksheet,
  getSheetIndexes,
  tieneSeparadores
} from "./funciones";
import TablaSeleccionProductos from "./tableProductos";
import Informacion from "./infoExtraccion";
import DetallesExtraccion from "./detallesExtraccion";
import DetallesErrores from "./detailsErrors";

const ExtraccionDatos = () => {
  const { showDialog } = useDialog();

  const calculateDate = useSelector(
    (state) => state?.configSellout?.calculateDate || formatDate(new Date())
  );

  const dataMatriculacionRegistrados = useSelector(
    (state) => state.configSellout?.dataMatriculacionRegistrados
  );
  const optionsMatriculacion = useSelector(
    (state) => state.configSellout?.optionsMatriculacion
  );

  const dataDiccionario = useSelector(
    (state) => state.diccionario.listaCategorias || []
  );

  const COLUMN_KEYWORDS = dataDiccionario.reduce((acc, categoria) => {
    acc[categoria.name] = categoria.keywords.map(k =>
      normalizarTexto(k.keyword)
    );
    return acc;
  }, {});


  useEffect(() => {
    dispatch(obtenerListaCategorias());
  }, []);

  const [openCreateStores, setOpenCreateStores] = useState(false);
  const [maestrosStores, setMaestrosStores] = useState({
    distributor: "",
    storeDistributor: "",
    codeStoreSic: "",
    status: true,
  });
  const [defaultsAplicados, setDefaultsAplicados] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [errors, setErrors] = useState({});
  const paramsValidate = [
    "distributor",
    "storeDistributor",
    "codeStoreSic",
  ];

  const fileInputRef = useRef();
  const pdfFile = useRef();
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const idEmpresaIndurama = useSelector(
    (state) => state?.configSellout?.idEmpresaIndurama
  );
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const optionsEmpresas =
    useSelector((state) => state.empresa?.optionsEmpresas) || [];
  const empresaIndurama =
    optionsEmpresas.find(
      (empresa) => empresa.label?.toUpperCase() === "INDURAMA"
    ) || null;

  useEffect(() => {
    dispatch(setIdEmpresaIndurama(empresaIndurama?.id || null));
  }, [idEmpresaIndurama, empresaIndurama]);

  useEffect(() => {
    if (idEmpresaIndurama !== null) {
      dispatch(obtenerOptionsEmpresas());
    }
  }, [idEmpresaIndurama]);

  const columns = useSelector(
    (state) => state.configSellout?.columnsExtracciones || []
  );

  const optionsConfiguracionSellout = useSelector(
    (state) => state?.configSellout?.optionsConfiguracionSellout || []
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [documento, setDocumento] = useState("");
  const [data, setData] = useState([]);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [configuracionId, setConfiguracionId] = useState(null);
  const [matriculacionData, setMatriculacionData] = useState(null);
  const [errores, setErrores] = useState([]);
  const hayErrores = errores?.some((fila) => Object.keys(fila).length > 0);
  const [celdas, setCeldas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataResponse, setDataResponse] = useState({});
  const [dialogSeparation, setDialogSeparation] = useState(false);
  const [dialogInformation, setDialogInformation] = useState(false);
  const [errorsCalculateDate, setErrorsCalculateDate] = useState({});
  const [preSplitInfo, setPreSplitInfo] = useState([]);
  const [temporalRegistrosSinSeparar, setTemporalRegistrosSinSeparar] = useState([]);
  const [search, setSearch] = useState("");
  const [detallesData, setDetallesData] = useState([]);
  const [searchMatriculacion, setSearchMatriculacion] = useState("");
  const [openDialogoConfirmacion, setOpenDialogoConfirmacion] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    distributor: null,
    codeStoreDistributor: null,
    extraerTodos: false,
    hasNegativeValue: false,
    dividirCantidad: false,
  });
  const [openDialogoConfirmacionNegativo, setOpenDialogoConfirmacionNegativo] =
    useState(false);
  const [openDialogDefaults, setOpenDialogDefaults] = useState(false);
  const [defaultsContent, setDefaultsContent] = useState([]);

  const [filteredData, setFilteredData] = useState(
    dataMatriculacionRegistrados
  );

  const preSplitInfoFiltrado = useMemo(() => {
    if (!busqueda) return preSplitInfo || [];

    const texto = busqueda.toLowerCase();

    return (preSplitInfo || []).filter(item =>
      item.descriptionDistributor
        ?.toLowerCase()
        .includes(texto)
    );
  }, [busqueda, preSplitInfo]);

  const totalUnitsSoldDistributor = data.reduce(
    (acc, row) => acc + Number(row.unitsSoldDistributor),
    0
  );

  const handleOpenDialogoConfirmacion = () => {
    setOpenDialogoConfirmacion(true);
  };

  const buscarConfiguraciones = async () => {
    setLoading(true);
    try {
      await dispatch(obtenerExtractionsConfig({ search }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarConfiguraciones();
  }, [search]);



  const handleChangeDistributorData = () => {
    setTimeout(() => {
      setData((prevData) =>
        prevData.map((item) => ({
          ...item,
          distributor: configuracion.distributor,
        }))
      );
      setDetallesData((prevData) =>
        prevData.map((item) => ({
          ...item,
          distributor: configuracion.distributor,
        }))
      );
    }, 1000);
  };

  const handleChangeCodeStoreDistributorData = () => {
    setTimeout(() => {
      setData((prevData) =>
        prevData.map((item) => ({
          ...item,
          codeStoreDistributor: configuracion.codeStoreDistributor,
        }))
      );
      setDetallesData((prevData) =>
        prevData.map((item) => ({
          ...item,
          storeName: configuracion.codeStoreDistributor,
        }))
      );
    }, 1000);
  };

  const procesarExtraccionDesdeConfiguracion = (
    workbook,
    configuracionId,
    columnasConfig,
    defaultDistributorId,
    hasNegativeValue,
    calculateDate,
    simboloConfig
  ) => {
    const registrosConSeparadores = [];
    const registrosSinSeparar = [];

    const totalHojas = workbook.SheetNames.length;

    const rawInitial = configuracionId?.initialSheet ?? null;
    const rawEnd = configuracionId?.endSheet ?? null;
    const explicitSheetName = configuracionId?.sheetName?.trimEnd?.();

    const hojasAProcesar = [];
    const isDefined = (v) => v !== null && v !== undefined && v !== "";

    const resolveIndex = (val, fallbackIndex) => {
      if (typeof val === "number" || /^\d+$/.test(String(val))) {
        const idx = parseInt(val, 10) - 1;
        if (idx < 0) return 0;
        if (idx >= totalHojas) return totalHojas - 1;
        return idx;
      }
      if (typeof val === "string") {
        const name = val.trim();
        const foundIdx = workbook.SheetNames.indexOf(name);
        return foundIdx === -1 ? fallbackIndex : foundIdx;
      }
      return fallbackIndex;
    };

    if (isDefined(rawInitial) || isDefined(rawEnd)) {
      const inicioIdx = isDefined(rawInitial)
        ? resolveIndex(rawInitial, 0)
        : resolveIndex(rawEnd, 0);
      const finIdx = isDefined(rawEnd)
        ? resolveIndex(rawEnd, inicioIdx)
        : inicioIdx;

      const start = Math.max(0, Math.min(inicioIdx, finIdx));
      const end = Math.min(totalHojas - 1, Math.max(inicioIdx, finIdx));

      for (let i = start; i <= end; i++) {
        hojasAProcesar.push(workbook.SheetNames[i]);
      }
    } else if (isDefined(explicitSheetName) && workbook.Sheets[explicitSheetName]) {
      hojasAProcesar.push(explicitSheetName);
    } else {
      if (totalHojas > 0) hojasAProcesar.push(workbook.SheetNames[0]);
    }
    const columnasActivas = columnasConfig.filter((c) => c.isActive);
    if (!columnasActivas || columnasActivas.length === 0) return [];

    const camposConfigGlobal = columnasActivas.map((col) => ({
      campo: col.mappingToField,
      letra: col.columnLetter,
      tipo: col.dataType,
    }));

    for (const sheetName of hojasAProcesar) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;

      const filaInicio = Math.min(...columnasActivas.map((c) => c.startRow || 2));

      if (!worksheet["!ref"]) continue;
      const rango = XLSX.utils.decode_range(worksheet["!ref"]);
      const filaFin = rango.e.r + 1;

      for (let fila = filaInicio; fila <= filaFin; fila++) {
        const registro = {};
        let filaVacia = true;

        for (const campoConfig of camposConfigGlobal) {
          const cellRef = `${campoConfig.letra}${fila}`;
          const valorRaw = extraerTextoCelda(worksheet[cellRef]);

          if (campoConfig.tipo === "INTEGER") {
            const valorNum = parseFloat(valorRaw);
            registro[campoConfig.campo] = !isNaN(valorNum) ? valorNum : null;

          } else if (campoConfig.tipo === "DATE") {
            registro[campoConfig.campo] = normalizarFechaISO(valorRaw);

          } else {
            registro[campoConfig.campo] =
              typeof valorRaw === "string" ? valorRaw.trim() : valorRaw;
          }

          if (
            registro[campoConfig.campo] !== null &&
            registro[campoConfig.campo] !== "" &&
            registro[campoConfig.campo] !== undefined
          ) {
            filaVacia = false;
          }
        }

        if (filaVacia) continue;

        if (
          !registro.descriptionDistributor ||
          !validarDescripcion(registro.descriptionDistributor)
        ) {
          continue;
        }

        const tieneColumnaCantidad = registro.unitsSoldDistributor !== undefined;

        if (!tieneColumnaCantidad) {
          registro.unitsSoldDistributor = 1;

        } else {
          const rawValue = registro.unitsSoldDistributor;
          const valorLimpio = String(rawValue ?? "").trim();
          const cantidadNumerica = parseFloat(valorLimpio);

          if (
            !valorLimpio ||
            isNaN(cantidadNumerica) ||
            cantidadNumerica === 0 ||
            !Number.isInteger(cantidadNumerica)
          ) {
            continue;
          }

          registro.unitsSoldDistributor = hasNegativeValue
            ? Math.abs(cantidadNumerica)
            : cantidadNumerica;
        }


        if (!registro.saleDate) {
          const diaTexto = registro.saleDay ?? "01";
          const mesTexto = registro.saleMonth ?? null;
          const anioTexto = registro.saleYear ?? null;

          const fechaConstruida = construirFechaDesdeComponente({
            diaTexto,
            mesTexto,
            anioTexto,
          });

          registro.saleDate =
            normalizarFechaISO(registro.saleDate) ||
            fechaConstruida ||
            getUltimoDiaMesActual(calculateDate);
        }

        delete registro.saleDay;
        delete registro.saleMonth;
        delete registro.saleYear;

        registro.distributor =
          registro.distributor ||
          configuracionId?.distributor ||
          defaultDistributorId ||
          null;

        const tieneColumnaAlmacen = columnasConfig.some(
          (c) => c.mappingToField === "codeStoreDistributor"
        );

        if (tieneColumnaAlmacen && registro.codeStoreDistributor !== undefined) {
          const almac = String(registro.codeStoreDistributor || "").trim();
          if (!almac || !validarAlmacen(almac)) continue;
          registro.codeStoreDistributor = almac;

        } else {
          registro.codeStoreDistributor =
            registro.codeStoreDistributor ||
            configuracionId?.codeStoreDistributor ||
            sheetName;
        }
        const registroFinal = {
          ...registro,
          codeProductDistributor: registro.codeProductDistributor || registro.descriptionDistributor,
          observation: "",
        };

        if (tieneSeparadores(registro.descriptionDistributor, simboloConfig)) {
          registrosConSeparadores.push(registroFinal);
        } else {
          registrosSinSeparar.push(...repartirValoresNumerico(registroFinal, simboloConfig));
        }
      }
    }

    return {
      registrosSinSeparar,
      registrosConSeparadores,
    };
  };


  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      showSnackbar("⚠️ No se seleccionó archivo", { severity: "error" });
      return;
    }

    setLoading(true);

    const nombreSinExtension = file.name.replace(/\.[^/.]+$/, "");
    setDocumento(nombreSinExtension);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });

      if (columns.length === 0) {
        showSnackbar("⚠️ No se encontraron columnas en la configuración", { severity: "error" });
        return;
      }

      const mappingFields = new Set(
        columns.map(col => col.mappingToField)
      );

      const columnsFaltantes = new Set();

      if (!mappingFields.has("unitsSoldDistributor")) {
        columnsFaltantes.add("unitsSoldDistributor");
      }

      if (!mappingFields.has("codeStoreDistributor")) {
        columnsFaltantes.add("codeStoreDistributor");
      }

      if (!mappingFields.has("codeProductDistributor")) {
        columnsFaltantes.add("codeProductDistributor");
      }

      setDefaultsAplicados(columnsFaltantes);


      const {
        registrosSinSeparar,
        registrosConSeparadores
      } = procesarExtraccionDesdeConfiguracion(
        workbook,
        configuracionId,
        columns,
        configuracionId?.distributor,
        configuracion.hasNegativeValue,
        calculateDate,
        configuracion.simbolo
      );

      if (
        registrosSinSeparar.length === 0 &&
        registrosConSeparadores.length === 0
      ) {
        showSnackbar("⚠️ Error al obtener los detalles del producto", { severity: "error" });
        return;
      }

      if (registrosConSeparadores.length > 0) {
        setPreSplitInfo(registrosConSeparadores);
        setTemporalRegistrosSinSeparar(registrosSinSeparar);
        setDialogSeparation(true);
        return;
      }

      const registrosFiltrados = filterByCurrentMonth(
        registrosSinSeparar,
        calculateDate
      );

      if (registrosFiltrados.length === 0) {
        showSnackbar(
          "⚠️ No se encontraron registros para el mes seleccionado. Verifica las fechas del archivo.",
          { severity: "info" }
        );
        setData([]);
        setCeldas([]);
        return;
      }

      const agrupados = registrosFiltrados.reduce((acc, item) => {
        const key = `${item.distributor}_${item.codeStoreDistributor}`;

        if (!acc[key]) {
          acc[key] = {
            distributor: item.distributor,
            storeName: item.codeStoreDistributor,
            rowsCount: 0,
            productCount: 0,
          };
        }

        acc[key].rowsCount += 1;

        const unidades = Number(item.unitsSoldDistributor);

        acc[key].productCount += isNaN(unidades) ? 0 : unidades;

        return acc;
      }, {});

      setDetallesData(Object.values(agrupados));

      setData(registrosFiltrados);

      const camposDetectados = Object.keys(registrosFiltrados[0] || {});
      const ordenColumnas = Object.keys(etiquetasColumnas);

      const columnasOrdenadas = [
        ...ordenColumnas.filter((key) => camposDetectados.includes(key)),
        ...camposDetectados.filter((key) => !ordenColumnas.includes(key)),
      ];

      setCeldas(
        columnasOrdenadas.map((key) => ({
          label: etiquetasColumnas[key] || key,
          field: key,
          type: key === "unitsSoldDistributor" ? "NUMBER" : "TEXT",
        }))
      );

      mostrarAvisoDefaults(columnsFaltantes, DEFAULT_FIELD_LABELS);

    } catch (error) {
      showSnackbar(`Error al procesar archivo: ${error.message}`, { severity: "error" });
      setData([]);
      setCeldas([]);
      setDetallesData([]);
    } finally {
      setLoading(false);
      event.target.value = null;
    }
  };


  const handleIconClick = () => {
    setData([]);
    setCeldas([]);
    setDetallesData([]);
    showDialog({
      title: "Confirmación de conversión",
      message:
        "¿Desea convertir las cantidades negativas a positivas? Si no selecciona, se extraerán cantidades positivas y negativas",
      cancelButtonText: "NO",
      confirmButtonText: "SI",
      onConfirm: () => {
        setOpenDialogoConfirmacionNegativo(true);
        setConfiguracion({
          ...configuracion,
          hasNegativeValue: true,
        });
        fileInputRef.current.click();
      },
      onCancel: () => {
        setOpenDialogoConfirmacionNegativo(false);
        setConfiguracion({
          ...configuracion,
          hasNegativeValue: false,
        });
        fileInputRef.current.click();
      },
    });
  };

  const handleFileInputChange = (event) => {
    if (configuracionId?.label === "CONFIGURACION ESTANDAR") {
      handleExtraccionStandar(event);
    } else {
      handleFileChange(event);
    }
  };

  const buscarColumnas = () => {
    dispatch(
      obtenerColumnsExtractionsConfig({
        selloutConfigurationId: configuracionId?.id || null,
      })
    );
  };

  useEffect(() => {
    buscarColumnas();
  }, [configuracionId]);

  const handleGuardar = async () => {
    setLoading(true);

    try {
      const consolidatedDataStores = Array.isArray(data)
        ? data
        : Object.values(data);

      const mappedData = consolidatedDataStores.map((item) => ({
        ...item,
        saleDate: item.saleDate || getUltimoDiaMesActual(formatDate(calculateDate)),
        distributor: normalizeSpaces(item.distributor) || normalizeSpaces(configuracionId?.distributor?.id) || "",
        codeStoreDistributor:
          normalizeSpaces(item.codeStoreDistributor) || normalizeSpaces(configuracionId?.codeStoreDistributor?.id) || "",
        codeProductDistributor: normalizeSpaces(item.codeProductDistributor) || normalizeSpaces(item?.descriptionDistributor) || "",
        calculateDate: formatDate(calculateDate),
        descriptionDistributor: normalizeSpaces(item.descriptionDistributor) || "",
      }));

      const dataContent = {
        consolidated_data_stores: mappedData
      };

      const payload = {
        extractionDate: new Date().toISOString(),
        dataContent,
        selloutConfigurationId: parseInt(configuracionId?.id) || null,
        recordCount: consolidatedDataStores.length,
        dataName: "consolidated_data_stores",
        calculateDate: formatDate(calculateDate),
        productCount: totalUnitsSoldDistributor,
        uploadCount: 1,
        uploadTotal: 1,
        matriculationId: matriculacionData?.id,
        matriculationLogs: detallesData
      };

      const response = await dispatch(sendSellout(payload));
      if (response.meta.requestStatus === "fulfilled") {
        setDataResponse(response.payload.extractedData);
        showSnackbar(response.payload.message, { severity: "success" });
        setDialogInformation(true);
        setConfiguracion({
          hojaInicio: "",
          hojaFin: "",
          extraerTodos: false,
          distributor: "",
          codeStoreDistributor: "",
          dividirCantidad: false,
        });
      } else {
        showSnackbar(response.payload.message || "Error al guardar", { severity: "error" });
      }
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message ||
        error?.message ||
        "Error al guardar la extracción",
        { severity: "error" }
      );

    } finally {
      setLoading(false);
    }
  };



  const limpiarErrores = () => {
    setDataResponse({});
    setDialogInformation(false);
    setErrores([]);
    setData([]);
    setDocumento("");
    setCeldas([]);
    setLoading(false);
    dispatch(setConfiguracionExtraccionId(null));
    setConfiguracion({
      hojaInicio: "",
      hojaFin: "",
      extraerTodos: false,
      distributor: null,
      codeStoreDistributor: null,
    });
    setErrorsCalculateDate({});
    setOpenDialogoConfirmacion(false);
    setOpenCreateStores(false);
    setOpenDialogoConfirmacion(false);
    setConfiguracionId(null);
    setMatriculacionData(null);
    setMensajeAlerta("");
  };

  const downloadEmptyExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datos de Sellout");

    worksheet.columns = [
      { header: "Fecha" },
      { header: "Distribuidor" },
      { header: "Codigo Almacen" },
      { header: "Codigo Producto" },
      { header: "Descripcion Producto" },
      { header: "Unidades Vendidas" },
    ];

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Formato_Sellout.xlsx");
    });
  };

  const avisoCritico = (mensaje) => {
    showSnackbar(`⚠️ ${mensaje}`, { severity: "error" });
    setData([]);
    setCeldas([]);
    setDetallesData([]);
    setLoading(false);
  };

  const handleExtraccionStandar = async (event) => {
    const file = event.target.files?.[0];
    setLoading(true);

    const nombreSinExtension = file.name.replace(/\.[^/.]+$/, "");
    setDocumento(nombreSinExtension);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });

      const totalHojas = workbook.SheetNames.length;
      const { hojaInicio, hojaFin, extraerTodos } = configuracion;

      const sheetIndexes = getSheetIndexes({
        hojaInicio,
        hojaFin,
        extraerTodos,
        totalHojas,
      });

      let registrosSinSeparar = [];
      let registrosConSeparadores = [];

      for (const index of sheetIndexes) {
        const hojaName = workbook.SheetNames[index];
        const worksheet = workbook.Sheets[hojaName];

        const rows = extractRowsFromWorksheet(worksheet);
        const headerInfo = detectHeader(rows, COLUMN_KEYWORDS);
        setDefaultsAplicados(headerInfo.defaultsAplicados);

        if (!headerInfo.header) {
          avisoCritico(`Encabezados no encontrados en hoja: ${hojaName}`);
          continue;
        }

        const { registrosSinSeparar: sinSep, registrosConSeparadores: conSep } =
          processRows(
            rows.slice(headerInfo.rowIndex + 1),
            headerInfo.header,
            hojaName,
            configuracion.distributor || null,
            configuracion.simbolo || null,
            configuracion.hasNegativeValue || false,
          );

        registrosSinSeparar.push(...sinSep);
        registrosConSeparadores.push(...conSep);
      }


      if (registrosSinSeparar.length === 0 && registrosConSeparadores.length === 0) {
        avisoCritico("Error al obtener los detalles del producto");
        return;
      }

      if (registrosConSeparadores.length > 0) {

        setPreSplitInfo(registrosConSeparadores);
        setTemporalRegistrosSinSeparar(registrosSinSeparar);

        setDialogSeparation(true);

        return;
      }

      const registrosFiltrados = filterByCurrentMonth(registrosSinSeparar, calculateDate);
      if (registrosFiltrados.length === 0) {
        avisoCritico(
          "No se encontraron registros para el mes seleccionado. Verifica las fechas del archivo."
        );
        setData([]);
        setCeldas([]);
        return;
      }

      const camposDetectados = Object.keys(registrosFiltrados[0] || {});
      const ordenColumnas = Object.keys(etiquetasColumnas);

      const columnasOrdenadas = [
        ...ordenColumnas.filter((key) => camposDetectados.includes(key)),
        ...camposDetectados.filter((key) => !ordenColumnas.includes(key)),
      ];

      const agrupados = registrosFiltrados.reduce((acc, item) => {
        const key = `${item.distributor}_${item.codeStoreDistributor}`;

        if (!acc[key]) {
          acc[key] = {
            distributor: item.distributor,
            storeName: item.codeStoreDistributor,
            rowsCount: 0,
            productCount: 0,
          };
        }

        acc[key].rowsCount += 1;

        const unidades = Number(item.unitsSoldDistributor);
        acc[key].productCount += isNaN(unidades) ? 0 : unidades;

        return acc;
      }, {});


      setDetallesData(Object.values(agrupados));

      setData(registrosFiltrados);

      setCeldas(
        columnasOrdenadas.map((key) => ({
          label: etiquetasColumnas[key] || key,
          field: key,
          type: key === "unitsSoldDistributor" ? "number" : "TEXT",
        }))
      );

      mostrarAvisoDefaults(defaultsAplicados, DEFAULT_FIELD_LABELS);

    } catch (error) {
      avisoCritico(`Error al procesar archivo: ${error.message}`);
      setData([]);
      setCeldas([]);
    } finally {
      setLoading(false);
      event.target.value = null;
    }
  };

  const filterByCurrentMonth = (registros, calculateDate) => {
    const mesCalculo = new Date(calculateDate).toISOString().slice(0, 7);
    return registros.filter((registro) => {
      if (!registro.saleDate) return false;

      const saleDateStr = registro.saleDate.slice(0, 7);
      return saleDateStr === mesCalculo;
    });
  };

  const processRows = (rows, encabezados, hojaName, defaultDistributorId, simbolo, hasNegativeValue) => {
    const registrosSinSeparar = [];
    const registrosConSeparadores = [];

    const mapeo = detectarColumnasAutomaticamente(encabezados, COLUMN_KEYWORDS);

    for (const fila of rows) {
      const rawDescripcion = extraerTextoCelda(fila[mapeo.descriptionDistributor] || "");
      if (!rawDescripcion || !validarDescripcion(rawDescripcion)) continue;

      let rawCantidad = 1;
      if (mapeo.unitsSoldDistributor !== undefined) {
        const valorExtraido = extraerTextoCelda(fila[mapeo.unitsSoldDistributor]);
        const cantidadNumerica = parseFloat(valorExtraido);
        if (isNaN(cantidadNumerica) || cantidadNumerica === 0) continue;
        rawCantidad = hasNegativeValue ? Math.abs(cantidadNumerica) : cantidadNumerica;
      }

      let saleDate;
      if (mapeo.saleDate !== undefined) {
        const val = extraerTextoCelda(fila[mapeo.saleDate]);
        saleDate = normalizarFechaISO(val);
      }
      if (!saleDate) saleDate = getUltimoDiaMesActual(calculateDate);

      const codeProductDistributor =
        mapeo.codeProductDistributor !== undefined
          ? extraerTextoCelda(fila[mapeo.codeProductDistributor])
          : rawDescripcion;

      const distributor =
        configuracion?.distributor || defaultDistributorId;

      const codeStoreDistributor =
        configuracion?.codeStoreDistributor ||
        (mapeo.codeStoreDistributor !== undefined
          ? extraerTextoCelda(fila[mapeo.codeStoreDistributor])
          : hojaName);

      const registro = {
        descriptionDistributor: rawDescripcion,
        unitsSoldDistributor: rawCantidad,
        codeProductDistributor: codeProductDistributor || rawDescripcion,
        distributor,
        codeStoreDistributor,
        saleDate,
        observation: "",
      };

      if (tieneSeparadores(rawDescripcion, simbolo)) {
        registrosConSeparadores.push(registro);
      } else {
        registrosSinSeparar.push(registro);
      }
    }

    return { registrosSinSeparar, registrosConSeparadores };
  };

  const DEFAULT_FIELD_LABELS = {
    unitsSoldDistributor: "Cantidad",
    codeStoreDistributor: "Almacén",
    codeProductDistributor: "Código de producto",
  };
  const [selectedToSplitIds, setSelectedToSplitIds] = useState([]);

  const handleConfirmarSeparacion = () => {
    if (!preSplitInfo) return;

    const seleccionados = selectedToSplitIds.map((idx) => preSplitInfo[idx]);

    const noSeleccionados = preSplitInfo.filter(
      (_, idx) => !selectedToSplitIds.includes(idx)
    );

    const separados = seleccionados
      .flatMap((item) => repartirValoresNumerico(item, configuracion.simbolo, configuracion.dividirCantidad))
      .map((item) => ({
        ...item,
        observation: "Dato separado",
      }));

    const finalData = [
      ...temporalRegistrosSinSeparar,
      ...separados,
      ...noSeleccionados
    ];

    const registrosFiltrados = filterByCurrentMonth(finalData, calculateDate);
    if (registrosFiltrados.length === 0) {
      avisoCritico(
        "No se encontraron registros para el mes seleccionado. Verifica las fechas del archivo."
      );
      setData([]);
      setCeldas([]);
      handleCloseDialogSeparation();
      return;
    }
    const camposDetectados = Object.keys(registrosFiltrados[0] || {});
    const ordenColumnas = Object.keys(etiquetasColumnas);

    const columnasOrdenadas = [
      ...ordenColumnas.filter((key) => camposDetectados.includes(key)),
      ...camposDetectados.filter((key) => !ordenColumnas.includes(key)),
    ];

    const agrupados = registrosFiltrados.reduce((acc, item) => {
      const key = `${item.distributor}_${item.codeStoreDistributor}`;

      if (!acc[key]) {
        acc[key] = {
          distributor: item.distributor,
          storeName: item.codeStoreDistributor,
          rowsCount: 0,
          productCount: 0,
        };
      }

      acc[key].rowsCount += 1;
      const unidades = Number(item.unitsSoldDistributor);
      acc[key].productCount += isNaN(unidades) ? 0 : unidades;

      return acc;
    }, {});

    setDetallesData(Object.values(agrupados));
    setData(registrosFiltrados);

    setCeldas(
      columnasOrdenadas.map((key) => ({
        label: etiquetasColumnas[key] || key,
        field: key,
        type: "TEXT",
      }))
    );
    setDialogSeparation(false);
    setPreSplitInfo([]);
    setSelectedToSplitIds([]);
    mostrarAvisoDefaults(defaultsAplicados, DEFAULT_FIELD_LABELS);
  };

  const mostrarAvisoDefaults = (
    defaultsAplicados,
    DEFAULT_FIELD_LABELS,
  ) => {
    if (!defaultsAplicados || defaultsAplicados.size === 0) return;

    const camposLegibles = [...defaultsAplicados]
      .map(key => DEFAULT_FIELD_LABELS[key])
      .filter(Boolean);

    if (camposLegibles.length === 0) return;

    setDefaultsContent(camposLegibles);
    setOpenDialogDefaults(true);
  };





  const handleCloseCreateStores = () => {
    setOpenCreateStores(false);
    setDetallesData([]);
  };

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

  const handleGuardarEntidad = async ({
    data,
    dispatchFunction,
    onSuccessCallback,
    onResetForm,
  }) => {
    const response = await dispatch(dispatchFunction(data));

    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message || "Registro exitoso", { severity: "success" });
      onSuccessCallback?.();
      onResetForm?.();
    } else {
      showSnackbar(response.payload.message || "Ocurrió un error", { severity: "error" });
    }
  };

  const handleGuardarMaestrosStores = () => {
    if (!validateForm()) return;
    handleGuardarEntidad({
      data: maestrosStores,
      dispatchFunction: createMaestrosStores,
      onSuccessCallback: () => {
        handleCloseCreateStores();
      },
      onResetForm: handleCloseCreateStores,
    });
  };

  const handleClick = () => {
    pdfFile.current.click();
  };

  const handleFileUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (!file) {
      showSnackbar("⚠️ No se seleccionó archivo", { severity: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);

      try {
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str).join(" ");
          fullText += strings + "\n";
        }

        const rows = extractData(fullText);

        if (rows.length === 0) {
          showSnackbar("⚠️ No se encontraron datos válidos en el PDF.", { severity: "error" });
          return;
        }

        exportToExcel(rows);
      } catch (error) {
        showSnackbar(error || "Ocurrió un error al procesar el PDF", { severity: "error" });
        setLoading(false);
      } finally {
        setLoading(false);
        event.target.value = "";
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const extractData = (text) => {
    const productos = [];

    const registroRegex =
      /(\d+)\s+REGISTROS?\s*-\s*(.+?)\s+SUMAN\s+(\d+(?:[.,]\d+)?)(?!\S)/gi;

    let match;
    while ((match = registroRegex.exec(text)) !== null) {
      const descripcionCompleta = match[2].trim();
      const cantidadStr = match[3].replace(",", ".");
      const cantidad = parseFloat(cantidadStr);

      const codigoMatch = descripcionCompleta.match(/(\d{8,})\s*$/);
      const codigoProducto = codigoMatch ? codigoMatch[1] : null;

      if (!cantidad || !codigoProducto) continue;

      productos.push({
        Fecha: getUltimoDiaMesActual(calculateDate),
        Distribuidor: "MAYOREO_SO",
        "Código Almacén": "",
        "Código Producto": descripcionCompleta,
        "Descripción Producto": descripcionCompleta,
        "Unidades Vendidas": cantidad,
      });
    }

    return productos;
  };

  const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "reporte_inventario.xlsx");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (calculateDate) {
      obtenerConfiguracionCierre();
    }
  }, [calculateDate]);

  const obtenerConfiguracionCierre = async () => {
    const response = await dispatch(
      obtenerMatriculacionConfig({ calculateMonth: formatDate(calculateDate) })
    );
    if (response.meta.requestStatus === "fulfilled") {
      if (response?.payload?.items.length > 0) {
        const status = isClosed(
          response?.payload?.items[0]?.closingDate || null
        );
        setMostrarAlerta(status === "Cerrado ⛔" ? true : false);
        if (status === "Cerrado ⛔") {
          setMensajeAlerta(
            "Acción no permitida: se ha superado la fecha de cierre."
          );
        } else {
          setMensajeAlerta("");
          setMostrarAlerta(false);
        }
      } else {
        setMostrarAlerta(true);
        setMensajeAlerta(
          "Aún no ha creado una fecha de cierre para la fecha de cálculo seleccionada"
        );
      }
    }
  };

  const buscarMatriculacion = async (value) => {
    dispatch(
      obtenerMatriculacion({
        page: 1,
        limit: 50,
        search: value,
        calculateMonth: formatDate(calculateDate),
      })
    );
  };

  useEffect(() => {
    buscarMatriculacion("");
  }, [calculateDate]);

  const handleCloseDialogSeparation = () => {
    setDialogSeparation(false);
    setPreSplitInfo([]);
    setSelectedToSplitIds([]);
  }

  return (
    <>
      <AtomContainerGeneral
        children={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}>
            <>
              <IconoFlotante
                handleButtonClick={limpiarErrores}
                title="Limpiar datos"
                iconName="AutoFixHigh"
                color="#b91818"
                right={120}
              />
              <IconoFlotante
                handleButtonClick={downloadEmptyExcel}
                title="Descargar Formato Estandar"
                iconName="SaveAlt"
                color="#5ab9f6"
              />
              <BotonProcesarExcel />

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleClick}>
                  <ListItemIcon>
                    <PictureAsPdfIcon color="error" />
                  </ListItemIcon>
                  <Typography variant="inherit">Cargar PDF</Typography>
                </MenuItem>

                <MenuItem onClick={downloadEmptyExcel}>
                  <ListItemIcon>
                    <BrowserUpdatedIcon color="success" />
                  </ListItemIcon>
                  <Typography variant="inherit">
                    Descargar Formato Sellout
                  </Typography>
                </MenuItem>
              </Menu>

              <input
                type="file"
                accept=".pdf"
                ref={pdfFile}
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />

              <Accordion
                defaultExpanded
                disableGutters
                elevation={0}
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "24px !important",
                  border: "none",
                  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
                  width: "95vw",
                  margin: "0 auto",
                  mb: 1,
                  "&:before": { display: "none" },
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 15px 50px -10px rgba(0,0,0,0.12)",
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Box sx={{
                      backgroundColor: "rgba(0, 114, 206, 0.1)",
                      borderRadius: "50%",
                      display: "flex"
                    }}>
                      <ExpandMoreIcon sx={{ color: "#0072CE", fontSize: "1.2rem" }} />
                    </Box>
                  }
                  aria-controls="panel-content"
                  id="panel-header"
                  sx={{
                    background: "linear-gradient(90deg, #ffffff 0%, #f8faff 100%)", // Very subtle gradient
                    minHeight: "72px", // Taller header
                    padding: "0 32px",
                    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                      transform: "rotate(180deg)",
                    },
                    "& .MuiAccordionSummary-content": {
                      margin: "12px 0",
                    },
                  }}
                >
                  <Box display="flex" flexDirection="column">
                    <Typography sx={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "primary.main",
                      letterSpacing: "-0.5px"
                    }}>
                      Parámetros de Carga
                    </Typography>
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ padding: 2 }}>
                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid size={{ xs: 12, md: 2.5 }}>
                      <AtomDatePicker
                        id="calculateDate"
                        required={true}
                        mode="month"
                        label="Fecha de carga"
                        value={calculateDate || null}
                        onChange={(e) => {
                          dispatch(setCalculateDate(e));
                          limpiarErrores();
                        }}
                      />
                    </Grid>
                    {mostrarAlerta && mensajeAlerta ? (
                      <Grid size={{ xs: 12, md: 9 }}>
                        <AtomAlert text={mensajeAlerta} severity="error" />
                      </Grid>
                    ) : (
                      <>
                        {calculateDate && (
                          <Grid size={{ xs: 12, md: 2.5 }}>
                            <AtomAutocompleteLabel
                              id="matriculacionId"
                              label="Matriculación"
                              required={true}
                              inputValue={searchMatriculacion}
                              onInputChange={(event, newValue) => {
                                setSearchMatriculacion(newValue);
                                buscarMatriculacion(newValue);
                              }}
                              value={matriculacionData || null}
                              options={optionsMatriculacion}
                              onChange={(event, newValue) => {
                                setMatriculacionData(newValue);
                                setConfiguracion({
                                  ...configuracion,
                                  distributor: newValue?.distributor || "",
                                  codeStoreDistributor:
                                    newValue?.codeStoreDistributor || "",
                                });
                                setConfiguracionId(null);
                                setData([]);
                                setCeldas([]);
                                setDocumento("");
                                setErrors(false);
                                setErrores([]);
                              }}
                            />
                          </Grid>
                        )}
                        {matriculacionData && (
                          <Grid size={{ xs: 12, md: 2.5 }}>
                            <AtomAutocompleteLabel
                              id="configuracionId"
                              required={true}
                              placeholder="Seleccionar..."
                              label="Configuración"
                              value={configuracionId}
                              options={optionsConfiguracionSellout}
                              onChange={(event, newValue) => {
                                setConfiguracionId(newValue); setConfiguracionId(newValue);
                                console.log(newValue);
                                setData([]);
                                setCeldas([]);
                                setDocumento("");
                                setErrors(false);
                                setErrores([]);
                              }}
                            />
                          </Grid>
                        )}
                        {configuracionId?.label === "CONFIGURACION ESTANDAR" && (
                          <>
                            <Grid size={{ xs: 12, md: 3, }}>
                              <AtomTextField
                                id="distributor"
                                disabled
                                headerTitle="Distribuidor"
                                onBlur={handleChangeDistributorData}
                                value={configuracion?.distributor || ""}
                                onChange={(e) => {
                                  setConfiguracion({
                                    ...configuracion,
                                    distributor: e.target.value,
                                  });
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 2.5 }}>
                              <AtomTextField
                                id="codeStoreDistributor"
                                headerTitle="Almacén Distribuidor"
                                value={configuracion?.codeStoreDistributor || ""}
                                onChange={(e) => {
                                  setConfiguracion({
                                    ...configuracion,
                                    codeStoreDistributor: e.target.value,
                                  });
                                }}
                                onBlur={handleChangeCodeStoreDistributorData}
                              />
                            </Grid>
                            {CAMPOS_CONFIG_ESTANDAR.map((campo) => (
                              <Grid size={campo.size} key={campo.id}>
                                <AtomTextField
                                  id={campo.id}
                                  headerTitle={campo.headerTitle}
                                  required={campo.required}
                                  type={campo.type}
                                  multiline={campo.multiline}
                                  rows={campo.rows}
                                  value={configuracion[campo.id] || ""}
                                  placeholder={campo.placeholder}
                                  onChange={(e) =>
                                    setConfiguracion({
                                      ...configuracion,
                                      [campo.id]: e.target.value,
                                    })
                                  }
                                />
                              </Grid>
                            ))}
                            <Grid size={{ xs: 12, md: 1.5 }}>
                              <AtomSwitch
                                id="extraerTodos"
                                title="Todas"
                                tooltip="Define si se extraen todas las hojas"
                                checked={configuracion.extraerTodos || false}
                                onChange={(e) =>
                                  setConfiguracion({
                                    ...configuracion,
                                    extraerTodos: e.target.checked,
                                  })
                                }
                              />
                            </Grid>
                          </>
                        )}
                        {configuracionId && (
                          <>
                            <Grid size={{ xs: 12, md: 3 }}>
                              <AtomTextFielInputForm
                                id="documento"
                                required
                                headerTitle="Seleccionar Excel"
                                placeholder="Seleccionar"
                                value={documento}
                                fullWidth
                                endIcon={true}
                                nameEndIcon={UploadFileIcon}
                                onClickEndIcon={handleIconClick}
                                onChange={handleIconClick}
                              />
                            </Grid>

                          </>
                        )}
                        {data.length > 0 && (
                          <Grid mt={2.5} size={{ xs: 12, md: 1.3, }}>
                            <AtomButtonPrimary
                              onClick={handleOpenDialogoConfirmacion}
                              label="Guardar"
                              disabled={loading}
                            />
                          </Grid>
                        )}
                      </>
                    )}
                    {hayErrores && (
                      <Grid
                        item
                        size={12}
                        sx={{
                          width: "100%",
                          mt: -2,
                          mb: 1,
                        }}
                      >
                        <DetallesErrores errores={errores} />
                      </Grid>
                    )}

                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Box>
                {loading ? (
                  <AtomCircularProgress />
                ) : (
                  <AtomTableExtraccion
                    loading={loading}
                    data={data}
                    setData={setData}
                    celdas={celdas}
                    errors={errores}
                    setErrores={setErrores}
                    showIndex={true}
                  />
                )}
              </Box>
            </>
          </Box>
        }
      />
      <AtomDialogForm
        openDialog={dialogInformation}
        titleCrear="Información de carga de extracción"
        buttonSubmit={true}
        maxWidth="md"
        handleSubmit={limpiarErrores}
        textButtonSubmit="Aceptar"
        dialogContentComponent={
          <Informacion dataResponse={dataResponse} />
        }
      />
      <AtomDialogForm
        maxWidth="md"
        openDialog={openDialogDefaults}
        buttonCancel={false}
        buttonSubmit={true}
        textButtonSubmit="Aceptar"
        handleCloseDialog={() => setOpenDialogDefaults(false)}
        handleSubmit={() => setOpenDialogDefaults(false)}
        titleCrear="Detalles de extracción"
        dialogContentComponent={
          <Box sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: '#ecf6ffff',
            width: '80%'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <InfoOutlinedIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="400">
                Se han aplicado valores por defecto a los siguientes campos:
              </Typography>
            </Box>
            <List>
              {defaultsContent.map((field, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LabelImportantIcon color="info" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={field}
                      sx={{
                        fontWeight: 400,
                        color: 'text.secondary'
                      }}
                    />
                  </ListItem>
                  {index < defaultsContent.length - 1 && <Divider component="li" variant="inset" marginLeft={0} />}
                </React.Fragment>
              ))}
            </List>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mt: 2,
                textAlign: 'center',
                display: 'block',
                fontStyle: 'italic',
              }}
            >
              * Revise que estos valores sean correctos para su reporte.
            </Typography>
          </Box >
        }
      />

      < AtomDialogForm
        openDialog={openCreateStores}
        titleCrear={"Crear almacén"}
        buttonCancel={true}
        maxWidth="md"
        buttonSubmit={true}
        handleSubmit={handleGuardarMaestrosStores}
        handleCloseDialog={handleCloseCreateStores}
        dialogContentComponent={
          < Grid
            container
            spacing={2}
            sx={{ width: "80%", justifyContent: "right" }}
          >
            {
              camposMaestrosStores.map((campo) => (
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
              ))
            }

            < Grid size={6} >
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
            </Grid >
          </Grid >
        }
      />
      < AtomDialogForm
        openDialog={openDialogoConfirmacion}
        titleCrear="Confirmación de guardado"
        buttonSubmit={loading ? false : true}
        textButtonSubmit="Confirmar"
        maxWidth="xl"
        buttonCancel={loading ? false : true}
        handleSubmit={handleGuardar}
        handleCloseDialog={() => {
          setOpenDialogoConfirmacion(false);
          setLoading(false);
          setData([...data]);
        }}
        dialogContentComponent={
          < Box sx={{ height: "100%" }}>
            {
              loading ? (
                <AtomCircularProgress />
              ) : (
                <Grid
                  container
                  spacing={1}
                  justifyContent="center"
                  sx={{
                    backgroundColor: "white",
                    width: "100%",
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Grid size={12}>
                    <AtomAlert text={mensajeExtraccion} severity="info" />
                  </Grid>

                  {data?.length > 0 && (
                    <>
                      <DetallesExtraccion
                        data={data}
                        detallesData={detallesData} />
                    </>
                  )}
                </Grid>
              )}
          </Box >
        }
      />
      < AtomDialogForm
        openDialog={dialogSeparation}
        titleCrear="Productos detectados para separación"
        buttonSubmit={true}
        textButtonSubmit="Continuar"
        handleSubmit={handleConfirmarSeparacion}
        buttonCancel={true}
        handleCloseDialog={() => { handleCloseDialogSeparation(); }}
        maxWidth="xl"
        dialogContentComponent={
          < Grid container spacing={1} justifyContent="space-between" alignItems="center">
            <Grid size={4} mt={2}>
              <AtomTextField
                id="busqueda"
                placeholder="Buscar descripción..."
                height={"45px"}
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPage(0);
                }}
              />
            </Grid>
            <Grid size={3} >
              <AtomSwitch
                height={"45px"}
                id="dividirCantidad"
                title="Dividir cantidad"
                tooltip="Define si se divide la cantidad"
                checked={configuracion.dividirCantidad || false}
                onChange={(e) =>
                  setConfiguracion({
                    ...configuracion,
                    dividirCantidad: e.target.checked,
                  })
                }
              />
            </Grid>

            <Grid size={12} sx={{ height: "100%", width: "100%" }}>
              <TablaSeleccionProductos
                columns={[
                  { label: "Descripción", field: "descriptionDistributor", type: "TEXT" },
                  { label: "Cantidad", field: "unitsSoldDistributor", type: "NUMBER" },
                  { label: "Almacén", field: "codeStoreDistributor", type: "TEXT" }
                ]}
                data={preSplitInfoFiltrado || []}
                pagination={true}
                page={page}
                limit={limit}
                count={preSplitInfoFiltrado.length || 0}
                selectable={true}
                selected={selectedToSplitIds}
                setSelected={setSelectedToSplitIds}
                setPage={setPage}
                setLimit={setLimit}
              />
            </Grid>
          </Grid >
        }
      />
    </>
  );
};
export default ExtraccionDatos;