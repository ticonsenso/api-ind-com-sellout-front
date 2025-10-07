import React, { useState, useRef, useEffect } from "react";
import AtomCard from "../../../atoms/AtomCard";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Menu,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  COLUMN_KEYWORDS,
  CAMPOS_CONFIG_ESTANDAR,
  PALABRAS_INVALIDAS,
  NOMBRES_CAMPOS,
  etiquetasColumnas,
  isClosed,
} from "./constantes";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  UploadFile as UploadFileIcon,
  MoreVert as MoreVertIcon,
  BrowserUpdated as BrowserUpdatedIcon,
  PictureAsPdf as PictureAsPdfIcon,
  AutoFixHigh as AutoFixHighIcon,
  AddCircle as AddCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
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
import { mensajeExtraccion } from "../../constantes";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import * as pdfjsLib from "pdfjs-dist";
import AtomTableForm from "../../../atoms/AtomTableForm";
import AtomSearchTextfield from "../../../atoms/AtomSearchTextfield";
import IconoFlotante from "../../../atoms/IconActionPage";
pdfjsLib.GlobalWorkerOptions.workerSrc = "../../../public/pdfWorker.js";
import { styles } from "./constantes";
import { obtenerMatriculacionConfig } from "../../../redux/selloutDatosSlic";
import { useDialog } from "../../../context/DialogDeleteContext";

const formatDate = (fechaISO) => {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getUTCDate()).padStart(2, "0");
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const anio = fecha.getUTCFullYear();
  return `${anio}-${mes}-${dia}`;
};

const ExtraccionDatos = () => {
  const { showDialog } = useDialog();
  const dataMatriculacionRegistrados = useSelector(
    (state) => state.configSellout?.dataMatriculacionRegistrados
  );
  const optionsMatriculacion = useSelector(
    (state) => state.configSellout?.optionsMatriculacion
  );

  const [openCreateStores, setOpenCreateStores] = useState(false);
  const [maestrosStores, setMaestrosStores] = useState({
    distributor: "",
    storeDistributor: "",
    codeStoreSic: "",
    status: true,
  });
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
  const [dialogInformation, setDialogInformation] = useState(false);
  const [calculateDate, setCalculateDate] = useState(formatDate(new Date()));
  const [errorsCalculateDate, setErrorsCalculateDate] = useState({});
  const [search, setSearch] = useState("");
  const [detallesData, setDetallesData] = useState([]);
  const [searchMatriculacion, setSearchMatriculacion] = useState("");
  const [openDialogoConfirmacion, setOpenDialogoConfirmacion] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    distributor: null,
    codeStoreDistributor: null,
    extraerTodos: false,
    hasNegativeValue: false,
  });
  const [openDialogoConfirmacionNegativo, setOpenDialogoConfirmacionNegativo] =
    useState(false);

  const [filteredData, setFilteredData] = useState(
    dataMatriculacionRegistrados
  );

  const totalUnitsSoldDistributor = data.reduce(
    (acc, row) => acc + Number(row.unitsSoldDistributor),
    0
  );

  const [errorsConfiguracion, setErrorsConfiguracion] = useState({});

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

  const getUltimoDiaMesActual = (fechaInput) => {
    const [year, month, day] = fechaInput.split("-").map(Number);
    if (!year || !month || !day)
      throw new Error(`Fecha inválida: ${fechaInput}`);

    const ultimoDia = new Date(year, month, 0); // month base 1, día 0 del siguiente mes

    const yyyy = ultimoDia.getFullYear();
    const mm = String(ultimoDia.getMonth() + 1).padStart(2, "0");
    const dd = String(ultimoDia.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

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
          codeStoreDistributor: configuracion.codeStoreDistributor,
        }))
      );
    }, 1000);
  };

  const construirFechaDesdeComponente = ({ diaTexto, mesTexto, anioTexto }) => {
    if (!mesTexto || !anioTexto) return null;

    const meses = {
      enero: 1,
      febrero: 2,
      marzo: 3,
      abril: 4,
      mayo: 5,
      junio: 6,
      julio: 7,
      agosto: 8,
      septiembre: 9,
      setiembre: 9, 
      noviembre: 11,
      diciembre: 12,
    };

    const normalizarTexto = (texto) =>
      texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const mesNormalizado = normalizarTexto(String(mesTexto));
    const mes =
      !isNaN(mesTexto) && mesTexto !== ""
        ? parseInt(mesTexto, 10)
        : meses[mesNormalizado] ?? null;

    const anio = parseInt(anioTexto, 10);
    const dia = diaTexto ? parseInt(diaTexto, 10) : 1;

    if (!mes || isNaN(anio) || isNaN(dia)) return null;

    const fecha = new Date(anio, mes - 1, dia);
    if (isNaN(fecha.getTime())) return null;

    return fecha.toISOString().split("T")[0]; // formato: YYYY-MM-DD
  };

  const repartirValoresNumerico = (registroOriginal) => {
    const descripcion = registroOriginal.descriptionDistributor || "";

    const productos = descripcion
      .split(/\r?\n/)
      .map((linea) => linea.trim())
      .filter((linea) => linea !== "");

    if (productos.length <= 1) {
      return [registroOriginal];
    }
    const cantidadOriginal = Number(registroOriginal.unitsSoldDistributor) || 1;
    const cantidadDividida = parseFloat(
      (cantidadOriginal / productos.length).toFixed(2)
    );

    return productos.map((prod) => ({
      ...registroOriginal,
      descriptionDistributor: prod,
      codeProductDistributor: prod,
      unitsSoldDistributor: cantidadDividida,
    }));
  };

  const procesarExtraccionDesdeConfiguracion = (
    workbook,
    configuracionId,
    columnasConfig,
    defaultDistributorId,
    calculateDate
  ) => {
    const registros = [];

    let sheetName = configuracionId?.sheetName;
    if (!sheetName || !workbook.Sheets[sheetName]) {
      sheetName = workbook.SheetNames[0];
    }
    const worksheet = workbook.Sheets[sheetName];

    const columnasActivas = columnasConfig.filter((c) => c.isActive);
    const filaInicio = Math.min(...columnasActivas.map((c) => c.startRow || 2));
    const rango = XLSX.utils.decode_range(worksheet["!ref"]);
    const filaFin = rango.e.r + 1;

    const camposConfig = columnasActivas.map((col) => ({
      campo: col.mappingToField,
      letra: col.columnLetter,
      tipo: col.dataType,
    }));

    const hasNegative =
      configuracion?.hasNegativeValue?.toString().trim().toLowerCase() ===
        "true" || configuracion?.hasNegativeValue?.toString().trim() === "1";

    for (let fila = filaInicio; fila <= filaFin; fila++) {
      const registro = {};
      let filaVacia = true;

      for (const campoConfig of camposConfig) {
        const valorRaw = extraerTextoCelda(
          worksheet[`${campoConfig.letra}${fila}`]
        );

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

      if (
        !registro.codeProductDistributor ||
        registro.codeProductDistributor === ""
      ) {
        registro.codeProductDistributor = registro.descriptionDistributor;
      }
      if (!registro.saleDate) {
        const diaTexto = registro.saleDay ?? null;
        const mesTexto = registro.saleMonth ?? null;
        const anioTexto = registro.saleYear ?? null;

        const fechaConstruida = construirFechaDesdeComponente({
          diaTexto,
          mesTexto,
          anioTexto,
        });
        registro.saleDate =
          normalizarFechaISO(registro?.saleDate) ||
          fechaConstruida ||
          getUltimoDiaMesActual(calculateDate);
      }
      delete registro.saleDay;
      delete registro.saleMonth;
      delete registro.saleYear;

      if (
        !registro.descriptionDistributor ||
        !validarDescripcion(registro.descriptionDistributor)
      ) {
        continue;
      }

      let cantidad = 1;
      const tieneColumnaCantidad = registro.unitsSoldDistributor !== undefined;
      if (tieneColumnaCantidad) {
        cantidad = parseFloat(registro.unitsSoldDistributor);
        if (!isNaN(cantidad) && cantidad !== 0) {
          registro.unitsSoldDistributor = hasNegative
            ? Math.abs(cantidad)
            : cantidad;
        } else {
          registro.unitsSoldDistributor = 1;
        }
      }

      registro.distributor =
        defaultDistributorId ||
        configuracion?.distributor ||
        registro?.distributor ||
        null;

      registro.codeStoreDistributor =
        configuracion?.codeStoreDistributor ||
        registro?.codeStoreDistributor ||
        configuracionId?.codeStoreDistributor ||
        sheetName;

      if (filaVacia) continue;
      registros.push(...repartirValoresNumerico(registro));
    }

    return registros;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      showSnackbar("⚠️ No se seleccionó archivo");
      return;
    }
    setLoading(true);
    const nombreSinExtension = file.name.replace(/\.[^/.]+$/, "");
    setDocumento(nombreSinExtension);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      if (columns.length === 0) {
        showSnackbar("⚠️ No se encontraron columnas en la configuración");
        setData([]);
        setCeldas([]);
        return;
      }
      const registrosExtraidos = procesarExtraccionDesdeConfiguracion(
        workbook,
        configuracionId,
        columns,
        configuracionId?.distributor,
        calculateDate
      );

      const registrosFiltrados = filterByCurrentMonth(
        registrosExtraidos,
        calculateDate
      );
      if (registrosFiltrados.length === 0) {
        showSnackbar(
          "⚠️ No se encontraron registros del mes seleccionado. Verifica las fechas del archivo si coincide con la fecha de cálculo seleccionada."
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

      let detallesData = Object.values(agrupados);

      if (detallesData.length < 2) {
        detallesData = [];
      }

      setDetallesData(detallesData);
      setData(registrosFiltrados);
      setCeldas(
        Object.keys(registrosFiltrados[0] || {}).map((columna) => ({
          label: etiquetasColumnas[columna] || columna,
          field: columna,
        }))
      );
    } catch (error) {
      showSnackbar(`Error al procesar archivo: ${error.message}`);
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

    const chunkSize = 2000;
    const splitInChunks = (array, size) => {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    };

    try {
      const consolidatedDataStores = Array.isArray(data)
        ? data
        : Object.values(data);

      const chunks = splitInChunks(consolidatedDataStores, chunkSize);

      for (const [index, chunk] of chunks.entries()) {
        const dataContent = {
          consolidated_data_stores: chunk.map((item) => ({
            ...item,
            saleDate:
              item.saleDate || getUltimoDiaMesActual(formatDate(calculateDate)),
            distributor:
              item.distributor || configuracionId?.distributor?.id || "",
            codeStoreDistributor:
              item.codeStoreDistributor ||
              configuracionId?.codeStoreDistributor?.id ||
              "",
            codeProductDistributor:
              item.codeProductDistributor || item?.descriptionDistributor || "",
            calculateDate: formatDate(calculateDate),
          })),
        };

        const payload = {
          extractionDate: new Date().toISOString(),
          dataContent,
          selloutConfigurationId: parseInt(configuracionId?.id) || null,
          recordCount: consolidatedDataStores.length,
          dataName: "consolidated_data_stores",
          calculateDate: formatDate(calculateDate),
          productCount: totalUnitsSoldDistributor,
          uploadCount: index + 1,
          uploadTotal: chunks.length,
          matriculationId: matriculacionData?.id,
          matriculationLogs: detallesData,
        };

        const response = await dispatch(sendSellout(payload));

        if (response.meta.requestStatus === "fulfilled") {
          if (index === chunks.length - 1) {
            setDataResponse(response.payload.extractedData);
            showSnackbar(response.payload.message);
            setDialogInformation(true);
            setConfiguracion({
              hojaInicio: "",
              hojaFin: "",
              extraerTodos: false,
              distributor: "",
              codeStoreDistributor: "",
            });
          }
        } else {
          showSnackbar(
            response.payload.message || `Error al guardar el chunk ${index + 1}`
          );
        }
      }
    } catch (error) {
      showSnackbar(error || "Error al guardar la extracción");
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

  const extraerTextoCelda = (celda) => {
    if (celda == null || celda == undefined) return "";

    if (typeof celda === "string") return celda.trim();

    if (typeof celda === "number") return String(celda);

    if (Object.prototype.toString.call(celda) === "[object Date]") {
      return celda.toISOString();
    }

    if (typeof celda === "object") {
      if ("v" in celda) {
        if (typeof celda.v === "string") return celda.v.trim();
        if (typeof celda.v === "number") return String(celda.v);
        if (celda.v instanceof Date) return celda.v.toISOString();
      }
      if ("text" in celda && typeof celda.text === "string")
        return celda.text.trim();
      if ("result" in celda && typeof celda.result === "string")
        return celda.result.trim();
      if ("richText" in celda && Array.isArray(celda.richText)) {
        return celda.richText
          .map((rt) => rt.text)
          .join("")
          .trim();
      }
    }

    return "";
  };

  const detectHeader = (rows) => {
    for (let i = 0; i < Math.min(50, rows.length); i++) {
      const fila = rows[i];
      const cleanedRow = fila.map((celda) => extraerTextoCelda(celda));
      const nonEmptyCells = cleanedRow.filter((c) => c !== "");

      if (nonEmptyCells.length < 2) continue;

      const mapeo = detectarColumnasAutomaticamente(cleanedRow);
      if (mapeo.descriptionDistributor !== undefined) {
        return { header: fila, rowIndex: i };
      }
    }
    return { header: null, rowIndex: -1 };
  };

  const detectarColumnasAutomaticamente = (fila) => {
    const resultado = {};

    const headers = fila.map((celda) =>
      extraerTextoCelda(celda)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    );

    console.log("headers", headers);

    for (const [tipo, keywords] of Object.entries(COLUMN_KEYWORDS)) {
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        for (const keyword of keywords) {
          if (header === keyword) {
            if (resultado[tipo] === undefined) {
              resultado[tipo] = i;
              break;
            }
          }
        }
      }
    }
    // if (resultado.descriptionDistributor === undefined) {
    //   avisoCritico("⚠️ No se pudo detectar la columna de Descripción de Producto");
    // }
    
    return resultado;
  };

  const validarDescripcion = (desc) => {
    const descripcion = desc.trim().toLowerCase();
    if (descripcion.length < 2) {
      // avisoCritico("⚠️ La descripción del producto es demasiado corta, verificar descripción en columna: " + (columnaNumber || "No encontrada"));
      return false;
    }
    if (!/[a-z]/.test(descripcion)) {
            // avisoCritico("⚠️ La descripción no es valida, verificar datos en columna: " + (columnaNumber || "No encontrada"));
      return false;
    }

    for (const palabra of PALABRAS_INVALIDAS) {
      const regex = new RegExp(`\\b${palabra.toLowerCase()}\\b`);
      if (regex.test(descripcion)) {
        // avisoCritico("⚠️ La descripción contiene palabras inválidas, verificar datos en columna: " + (columnaNumber || "No encontrada"));
        return false;
      }
    }

    return true;
  };

  const normalizarFechaISO = (valorCelda) => {
    if (!valorCelda && valorCelda !== 0) return null;

    let fecha = null;

    if (typeof valorCelda === "number") {
      // Redondear el número serial de Excel para evitar errores de coma flotante
      const serial = Math.round(valorCelda); // ← Esto es clave

      if (serial < 1 || serial > 2958465) return null;

      fecha = new Date((serial - 25569) * 86400 * 1000);
    } else if (Object.prototype.toString.call(valorCelda) === "[object Date]") {
      fecha = valorCelda;
    } else if (typeof valorCelda === "string") {
      const texto = valorCelda.trim();

      // Caso: número serial como string (ej: "45796")
      const matchSerial = texto.match(/^\+?0*(\d{4,7})(\.\d+)?$/);
      if (matchSerial) {
        const serial = Math.round(parseFloat(matchSerial[1])); // Redondear también si es string

        if (serial >= 1 && serial <= 2958465) {
          fecha = new Date((serial - 25569) * 86400 * 1000);
        }
      }

      if (!fecha) {
        const regexFecha = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/;
        const match = texto.match(regexFecha);
        if (match) {
          const dia = parseInt(match[1], 10);
          const mes = parseInt(match[2], 10);
          const anio = parseInt(match[3], 10);

          fecha = new Date(anio, mes - 1, dia);

          if (
            fecha.getFullYear() !== anio ||
            fecha.getMonth() + 1 !== mes ||
            fecha.getDate() !== dia
          ) {
            fecha = null;
          }
        }
      }

      if (!fecha) {
        const matchLetras = texto.match(/^(\d{1,2})-([A-Za-z]+)-(\d{2,4})$/);
        if (matchLetras) {
          const dia = parseInt(matchLetras[1], 10);
          const mesStr = matchLetras[2].toLowerCase();
          const anioCorto = parseInt(matchLetras[3], 10);

          const meses = {
            jan: 0,
            feb: 1,
            mar: 2,
            apr: 3,
            may: 4,
            jun: 5,
            jul: 6,
            aug: 7,
            sep: 8,
            oct: 9,
            nov: 10,
            dec: 11,
          };

          const mes = meses[mesStr.slice(0, 3)];
          let anio = anioCorto < 100 ? 2000 + anioCorto : anioCorto;

          if (!isNaN(dia) && mes !== undefined && !isNaN(anio)) {
            fecha = new Date(anio, mes, dia);
          }
        }
      }

      if (!fecha) {
        const timestamp = Date.parse(texto);
        if (!isNaN(timestamp)) {
          fecha = new Date(timestamp);
        }
      }
    }

    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
      return fecha.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    }

    return null;
  };

  const avisoCritico = (mensaje) => {
  showSnackbar(`⚠️ ${mensaje}`);
  setData([]);
  setCeldas([]);
  setDetallesData([]);
  setLoading(false);
  throw new Error(mensaje); 
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
      const { hojaInicio, hojaFin, extraerTodos, distributor } = configuracion;

      const sheetIndexes = getSheetIndexes({
        hojaInicio,
        hojaFin,
        extraerTodos,
        totalHojas,
      });

      let registros = [];

      for (const index of sheetIndexes) {
        const hojaName = workbook.SheetNames[index];
        const worksheet = workbook.Sheets[hojaName];

        const rows = extractRowsFromWorksheet(worksheet);
        const headerInfo = detectHeader(rows);
        if (!headerInfo.header) {
          avisoCritico(`Encabezados no encontrados en hoja: ${hojaName}`);
        }

        const processedRecords = processRows(
          rows.slice(headerInfo.rowIndex + 1),
          headerInfo.header,
          hojaName,
          configuracion.distributor || null
        );

        registros.push(...processedRecords);
      }

      if (registros.length === 0) {
        avisoCritico("⚠️ No se extrajeron registros del archivo");
      }
      const registrosFiltrados = filterByCurrentMonth(registros, calculateDate);
      const camposDetectados = Object.keys(registrosFiltrados[0] || {});
      const ordenColumnas = Object.keys(etiquetasColumnas);

      const columnasOrdenadas = [
        ...ordenColumnas.filter((key) => camposDetectados.includes(key)),
        ...camposDetectados.filter((key) => !ordenColumnas.includes(key)),
      ];
      if (registrosFiltrados.length === 0) {
avisoCritico("⚠️ No se encontraron registros del mes seleccionado. Verifica las fechas del archivo si coincide con la fecha de cálculo seleccionada."
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

      let detallesData = Object.values(agrupados);

      if (detallesData.length < 2) {
        detallesData = [];
      }

      setDetallesData(detallesData);

      setData(registrosFiltrados);
      setCeldas(
        columnasOrdenadas.map((key) => ({
          label: etiquetasColumnas[key] || key,
          field: key,
        }))
      );
    } catch (error) {
      showSnackbar(`Error al procesar archivo: ${error.message}`);
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

  const extractRowsFromWorksheet = (worksheet, limiteVacias = 5) => {
    let rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      blankrows: false,
    });

    if (!rows.length) return [];

    let resultadoFinal = [];
    let consecutivasVacias = 0;

    for (let i = 0; i < rows.length; i++) {
      const fila = rows[i];
      const filaVacia = fila.every(
        (cell) => cell === "" || cell === null || cell === undefined
      );

      if (filaVacia) {
        consecutivasVacias++;
        if (consecutivasVacias >= limiteVacias) {
          console.warn(
            `⚠️ Se detuvo la lectura en la fila ${i} por exceso de filas vacías consecutivas`
          );
          break;
        }
        continue;
      } else {
        consecutivasVacias = 0;
      }

      // --- Recorte de columnas ---
      let consecutivasColVacias = 0;
      let ultimaColumnaConDato = fila.length - 1;

      for (let j = 0; j < fila.length; j++) {
        const cell = fila[j];
        if (cell === "" || cell === null || cell === undefined) {
          consecutivasColVacias++;
          if (consecutivasColVacias >= limiteVacias) {
            ultimaColumnaConDato = j - limiteVacias;
            break;
          }
        } else {
          consecutivasColVacias = 0;
          ultimaColumnaConDato = j;
        }
      }

      resultadoFinal.push(fila.slice(0, ultimaColumnaConDato + 1));
    }

    return resultadoFinal;
  };

  const getSheetIndexes = ({
    hojaInicio,
    hojaFin,
    extraerTodos,
    totalHojas,
  }) => {
    const start = parseInt(hojaInicio, 10) - 1;
    const end = parseInt(hojaFin, 10) - 1;

    const isValidStart = !isNaN(start) && start >= 0 && start < totalHojas;
    const isValidEnd = !isNaN(end) && end >= start && end < totalHojas;

    if (extraerTodos) return Array.from({ length: totalHojas }, (_, i) => i);
    if (isValidStart && isValidEnd)
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    if (isValidStart) return [start];
    return [0];
  };

  const processRows = (rows, encabezados, hojaName, defaultDistributorId) => {
    const registros = [];
    const mapeo = detectarColumnasAutomaticamente(encabezados);
    console.log("mapeo", mapeo);
    const tieneColumnaCantidad = mapeo.unitsSoldDistributor !== undefined;
      const columnaNumber = Number(mapeo.descriptionDistributor) + 1;
    for (const fila of rows) {
      const rawDescripcion =
        extraerTextoCelda(fila[mapeo.descriptionDistributor] || "") || "";

      if (!rawDescripcion || !validarDescripcion(rawDescripcion)) {
        continue;
      };

      let rawCantidad = 1;
      if (tieneColumnaCantidad) {
        const valorExtraido = extraerTextoCelda(
          fila[mapeo.unitsSoldDistributor]
        );
        const cantidadNumerica = parseFloat(valorExtraido);
        const hasNegativeValue = configuracion.hasNegativeValue;

        if (!isNaN(cantidadNumerica) && cantidadNumerica !== 0) {
          rawCantidad = hasNegativeValue
            ? Math.abs(cantidadNumerica)
            : cantidadNumerica;
        } else {
          continue;
        }
      }

      let saleDate;
      if (mapeo.saleDate !== undefined) {
        const val = extraerTextoCelda(fila[mapeo.saleDate]);
        saleDate = normalizarFechaISO(val);
      }

      if (!saleDate) {
        saleDate = getUltimoDiaMesActual(calculateDate);
      }

      const codeProductDistributor =
        mapeo.codeProductDistributor !== undefined
          ? extraerTextoCelda(fila[mapeo.codeProductDistributor])
          : rawDescripcion;

      const distributor =
        configuracion?.distributor || mapeo.distributor !== undefined
          ? extraerTextoCelda(fila[mapeo.distributor])
          : defaultDistributorId;

      const codeStoreDistributor =
        configuracion?.codeStoreDistributor ||
        mapeo.codeStoreDistributor !== undefined
          ? extraerTextoCelda(fila[mapeo.codeStoreDistributor])
          : hojaName;

      const registroBase = {
        descriptionDistributor: rawDescripcion,
        unitsSoldDistributor: rawCantidad,
        codeProductDistributor,
        distributor: configuracion?.distributor || distributor,
        codeStoreDistributor:
          configuracion?.codeStoreDistributor || codeStoreDistributor,
        saleDate,
      };
      registros.push(...repartirValoresNumerico(registroBase));
    }
    if (registros.length === 0) {
          if (registros.map((r) => r.descriptionDistributor).every((desc) => !desc || desc.trim() === "")) {
          avisoCritico(`Por favor verificar la descripcion en la hoja: ${hojaName}, columna: ` + (columnaNumber  || "No encontrada"));  
    }}
    return registros;
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
      showSnackbar(response.payload.message || "Registro exitoso");
      onSuccessCallback?.();
      onResetForm?.();
    } else {
      showSnackbar(response.payload.message || "Ocurrió un error");
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
      showSnackbar("⚠️ No se seleccionó archivo");
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
          showSnackbar("⚠️ No se encontraron datos válidos en el PDF.");
          return;
        }

        exportToExcel(rows);
      } catch (error) {
        showSnackbar(error || "Ocurrió un error al procesar el PDF");
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
        limit: 10,
        search: value,
        calculateMonth: formatDate(calculateDate),
      })
    );
  };

  useEffect(() => {
    buscarMatriculacion("");
  }, [calculateDate]);

  return (
    <>
      <AtomContainerGeneral
        children={
          <AtomCard
            nameButton=""
            border={false}
            children={
              <>
                <IconoFlotante
                  handleButtonClick={limpiarErrores}
                  title="Limpiar datos"
                  iconName="AutoFixHigh"
                  color="#b91818"
                  right={80}
                />
                <IconoFlotante
                  handleButtonClick={handleMenuOpen}
                  title="Mas opciones"
                  iconName="MoreVert"
                />
                {data.length > 0 && (
                  <Box
                    sx={{
                      position: "fixed",
                      right: 40,
                      top: 170,
                      zIndex: 1000,
                    }}
                  >
                    <AtomButtonPrimary
                      onClick={handleOpenDialogoConfirmacion}
                      label="Guardar"
                      disabled={loading}
                    />
                  </Box>
                )}
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

                <Grid
                  container
                  spacing={1.5}
                  justifyContent="left"
                  mb={2}
                  mt={-2}
                >
                  <Grid size={3}>
                    <AtomDatePicker
                      id="calculateDate"
                      required={true}
                      mode="month"
                      label="Fecha de cálculo"
                      value={calculateDate || null}
                      onChange={(e) => {
                        setCalculateDate(e);
                        setErrorsCalculateDate({});
                      }}
                      error={errorsCalculateDate.dateStart}
                      helperText={
                        errorsCalculateDate.dateStart
                          ? "La fecha de cálculo es requerida"
                          : ""
                      }
                    />
                  </Grid>
                  {mostrarAlerta && mensajeAlerta ? (
                    <Grid size={9} mt={2}>
                      <AtomAlert text={mensajeAlerta} severity="error" />
                    </Grid>
                  ) : (
                    <>
                      {calculateDate && (
                        <Grid size={3}>
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
                        <Grid size={3}>
                          <AtomAutocompleteLabel
                            id="configuracionId"
                            required={true}
                            label="Configuracion de extracción"
                            value={configuracionId}
                            options={optionsConfiguracionSellout}
                            onChange={(event, newValue) => {
                              setConfiguracionId(newValue);
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
                          <Grid size={3}>
                            <AtomTextField
                              id="distributor"
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
                          <Grid size={3}>
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
                                error={errorsConfiguracion[campo.id] || false}
                                onChange={(e) =>
                                  setConfiguracion({
                                    ...configuracion,
                                    [campo.id]: e.target.value,
                                  })
                                }
                              />
                            </Grid>
                          ))}
                          <Grid size={2.5} mt={0.5}>
                            <AtomSwitch
                              id="extraerTodos"
                              title="Extraer todas"
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
                        <Grid size={3.5}>
                          <AtomTextFielInputForm
                            id="documento"
                            headerTitle="Seleccionar Documento"
                            placeholder="Seleccionar"
                            value={documento}
                            fullWidth
                            endIcon={true}
                            nameEndIcon={UploadFileIcon}
                            onClickEndIcon={handleIconClick}
                            onChange={handleIconClick}
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
                      <Accordion
                        sx={{
                          "&:before": {
                            display: "none",
                          },
                        }}
                        elevation={0}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon color="error" />}
                          aria-controls="panel-content"
                          id="panel-header"
                          sx={{
                            backgroundColor: "#ffe6e6",
                            flexDirection: "row-reverse",
                            "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded":
                              {
                                transform: "rotate(180deg)",
                              },
                            "& .MuiAccordionSummary-content": {
                              justifyContent: "center",
                            },
                          }}
                        >
                          <Typography
                            color="error"
                            sx={{ fontWeight: "bold", fontSize: "15px" }}
                          >
                            Errores encontrados (
                            {errores.reduce(
                              (sum, err) => sum + Object.keys(err).length,
                              0
                            )}
                            )
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails
                          sx={{
                            border: "1px solid #ff4d4d",
                          }}
                        >
                          <Box
                            sx={{
                              maxHeight: 300,
                              overflowY: "auto",
                              px: 2,
                              pb: 2,
                              display: "flex",
                              flexDirection: "row",
                              gap: 1,
                            }}
                          >
                            <ul
                              style={{
                                paddingLeft: "20px",
                                margin: 0,
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                              }}
                            >
                              {errores.map((filaError, rowIndex) =>
                                Object.entries(filaError).map(
                                  ([columna, mensaje], idx) => (
                                    <Grid
                                      item
                                      size={6}
                                      key={`${rowIndex}-${idx}`}
                                    >
                                      <li
                                        key={`${rowIndex}-${idx}`}
                                        style={{
                                          color: "#d32f2f",
                                          fontSize: "13px",
                                        }}
                                      >
                                        Fila {rowIndex + 1}, Columna "{columna}
                                        ": {mensaje}
                                      </li>
                                    </Grid>
                                  )
                                )
                              )}
                            </ul>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  <Grid size={12}>
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
                  </Grid>
                </Grid>
              </>
            }
          />
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
          <Box sx={{ width: "80%" }}>
            <Typography variant="h6">Extracción de datos</Typography>
            <Typography variant="body1">
              Fecha de extracción:{" "}
              {formatDate(dataResponse?.extractionDate || "")}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Registros</Typography>
            <Typography variant="body1">
              Cantidad de registros: {dataResponse?.recordCount || ""}
            </Typography>
            <Typography variant="body1">
              ¿Procesado?: {dataResponse?.isProcessed ? "Sí" : "No"}
            </Typography>
            <Typography variant="body1">
              Duración del procesamiento:{" "}
              {dataResponse?.processingDetails?.duration || ""}
            </Typography>
            <Typography color="red">
              Errores: {dataResponse?.processingDetails?.error || 0}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {dataResponse?.processingDetails?.smsErrors?.length > 0 && (
              <Accordion sx={{ mt: 1 }}>
                <AccordionSummary
                  sx={{ backgroundColor: "#ffd6d6" }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography sx={{ color: "red" }}>
                    Ver detalles de errores
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {dataResponse.processingDetails.smsErrors.map(
                    (error, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                        • {error}
                      </Typography>
                    )
                  )}
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        }
      />
      <AtomDialogForm
        openDialog={openCreateStores}
        titleCrear={"Crear almacén"}
        buttonCancel={true}
        maxWidth="md"
        buttonSubmit={true}
        handleSubmit={handleGuardarMaestrosStores}
        handleCloseDialog={handleCloseCreateStores}
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
        openDialog={openDialogoConfirmacion}
        titleCrear="Confirmación de guardado"
        buttonCancel={true}
        textButtonSubmit="Confirmar"
        maxWidth="xl"
        buttonSubmit={loading ? false : true}
        handleSubmit={handleGuardar}
        handleCloseDialog={() => {
          setOpenDialogoConfirmacion(false);
          setLoading(false);
        }}
        dialogContentComponent={
          <Box sx={{ height: "100%" }}>
            {loading ? (
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
                    <Grid item size={6}>
                      <Box sx={styles.container}>
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          gutterBottom
                        >
                          Primer Registro
                        </Typography>
                        <TableContainer
                          component={Paper}
                          elevation={0}
                          sx={styles.table}
                        >
                          <Table size="small">
                            <TableBody>
                              {Object.keys(NOMBRES_CAMPOS).map((key) => (
                                <TableRow key={key}>
                                  <TableCell sx={styles.tableCell}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={styles.typography}
                                    >
                                      {NOMBRES_CAMPOS[key]}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={styles.tableCellDetail}>
                                    {data[0]?.[key] || "N/A"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Grid>

                    <Grid size={6}>
                      <Box sx={styles.container}>
                        <Typography variant="subtitle2" color="primary">
                          Último Registro
                        </Typography>

                        <TableContainer
                          component={Paper}
                          elevation={0}
                          sx={styles.table}
                        >
                          <Table size="small">
                            <TableBody>
                              {Object.keys(NOMBRES_CAMPOS).map((key) => (
                                <TableRow key={key}>
                                  <TableCell sx={styles.tableCell}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={styles.typography}
                                    >
                                      {NOMBRES_CAMPOS[key]}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={styles.tableCellDetail}>
                                    {data[data.length - 1]?.[key] || "N/A"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Grid>
                    {detallesData.length > 0 && (
                      <Grid size={12}>
                        <Box sx={styles.container}>
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            gutterBottom
                          >
                            Detalles de la extracción
                          </Typography>

                          <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={styles.table}
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={styles.tableCell}>
                                    <Typography sx={styles.typography}>
                                      Distribuidor
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    <Typography sx={styles.typography}>
                                      Almacén
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    <Typography sx={styles.typography}>
                                      Filas / Registros
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    <Typography sx={styles.typography}>
                                      Unidades Vendidas
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {detallesData.map((detalle, index) => (
                                  <TableRow
                                    key={`${detalle.distributor}-${detalle.codeStoreDistributor}-${index}`}
                                  >
                                    <TableCell sx={styles.tableCellDetail}>
                                      {detalle.distributor}
                                    </TableCell>
                                    <TableCell sx={styles.tableCellDetail}>
                                      {detalle.storeName}
                                    </TableCell>
                                    <TableCell sx={styles.tableCellDetail}>
                                      {detalle.rowsCount}
                                    </TableCell>
                                    <TableCell sx={styles.tableCellDetail}>
                                      {detalle.productCount}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </Grid>
                    )}

                    <Grid size={12}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          gutterBottom
                          sx={styles.title}
                        >
                          Total Filas/Registros:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {data.length}
                          </span>
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          gutterBottom
                          sx={styles.title}
                        >
                          Total Unidades Vendidas:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {totalUnitsSoldDistributor}
                          </span>
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </Box>
        }
      />
    </>
  );
};

export default ExtraccionDatos;
