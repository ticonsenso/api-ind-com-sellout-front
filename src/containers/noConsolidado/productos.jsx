import AtomCard from "../../atoms/AtomCard";
import AtomTableForm from "../../atoms/AtomTableForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import CustomLinearProgress from "../../atoms/CustomLinearProgress";
import { columnsProductNull, styleTableData } from "./constantes";
import {
    obtenerConsolidatedSelloutUnique,
    createMaestrosProducts,
    updateMaestrosProducts,
    exportarExcel,
    subirExcelMaestrosProducts,
    sincronizarDatosConsolidated
} from "../../redux/configSelloutSlice";
import { debounce, timeSearch, formatDate, isMonthClosed, normalizeEncabezados } from "../constantes";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useSnackbar } from "../../context/SnacbarContext";
import {
    Box,
    Paper,
    Chip,
    Typography
} from "@mui/material";
import { setCalculateDate } from "../../redux/configSelloutSlice";
import AtomDatePicker from "../../atoms/AtomDatePicker";
import AtomButtonPrimary from "../../atoms/AtomButtonPrimary";
import IconoFlotante from "../../atoms/IconActionPage";
import {
    obtenerMatriculacionConfig,
} from "../../redux/selloutDatosSlic";
import { columnsMaestrosProducts } from "../selloutIndurama/constantes";
import ExcelJS from "exceljs";
import AtomDialogForm from "../../atoms/AtomDialogForm";
import AtomTableInformationExtraccion from "../../atoms/AtomTableInformationExtraccion";
import { limitGeneral } from "../constantes";

const ProductosNoHomologados = () => {
    const dispatch = useDispatch();
    const calculateDate = useSelector(
        (state) => state?.configSellout?.calculateDate || formatDate(new Date())
    );

    const dataMatriculacionConfig = useSelector(
        (state) => state.selloutDatos.dataMatriculacionConfig
    );
    const monthToCompare = calculateDate;
    const matriculacionConfigrada = dataMatriculacionConfig?.find(
        (config) => config.month === monthToCompare
    );
    const matriculacionCerrada = isMonthClosed(
        matriculacionConfigrada?.closingDate,
        matriculacionConfigrada?.startDate
    );
    const { showSnackbar } = useSnackbar();
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultadosActualizados, setResultadosActualizados] = useState([]);
    const [datosExcel, setDatosExcel] = useState([]);
    const [openUploadExcel, setOpenUploadExcel] = useState(false);

    const debounceSearch = useCallback(
        debounce((value) => {
            buscarLista(value);
        }, timeSearch),
        [calculateDate]
    );

    const buscarLista = async () => {
        setLoading(true);
        try {
            const response = await dispatch(
                obtenerConsolidatedSelloutUnique({
                    calculateDate: calculateDate,
                    codeProduct: true,
                })
            );
            const items = response.payload.items || [];
            setData(items);
        } finally {
            setLoading(false);
        }
    };

    const buscarMatriculacion = async () => {
        await dispatch(
            obtenerMatriculacionConfig({ search: "", page: 1, limit: 1000 })
        );
    };

    useEffect(() => {
        buscarLista(search);
        buscarMatriculacion();
    }, [calculateDate]);



    const normalizeSicCode = (code) => {
        if (!code) return code;
        return String(code).trim().toUpperCase();
    };

    const handleCloseUploadExcel = () => {
        setOpenUploadExcel(false);
        setDatosExcel([]);
    };

    const handleGuardarExcel = async (bulkData = null) => {
        const dataToProcess = bulkData && Array.isArray(bulkData) ? bulkData : resultadosActualizados;

        if (!dataToProcess || dataToProcess.length === 0) {
            showSnackbar("No hay cambios para guardar", { severity: "info" });
            return;
        }

        setLoading(true);
        try {
            const dataToSave = dataToProcess.map(({ id, ...rest }) => ({
                ...rest,
                codeProductSic: normalizeSicCode(rest.codeProductSic)
            }));
            const response = await dispatch(createMaestrosProducts(dataToSave));

            if (response.meta.requestStatus !== "fulfilled") {
                throw new Error(
                    response.payload?.message || "Error al guardar los maestros"
                );
            }

            showSnackbar("Cambios guardados correctamente", { severity: "success" });
            setResultadosActualizados([]);
            handleCloseUploadExcel();
        } catch (error) {
            showSnackbar(error.message || "Ocurrió un error al guardar", { severity: "error" });
        } finally {
            setLoading(false);
            handleSincronizar();
        }
    };

    const handleActualizarProducto = (newRow) => {
        try {
            const original = data.find((obj) => obj.id === newRow.id);
            if (!original) return;

            const valorOriginal = original.codeProduct;
            const valorNuevo = normalizeSicCode(newRow.codeProduct);

            if (valorOriginal === valorNuevo) return;

            const nuevoObjeto = {
                id: newRow.id,
                distributor: newRow.distributor,
                productStore: newRow.codeProductDistributor,
                productDistributor: newRow.descriptionDistributor,
                codeProductSic: valorNuevo || null,
                periodo: calculateDate
            };

            setResultadosActualizados((prev) => {
                const lista = prev || [];
                const existe = lista.find((obj) => obj.id === nuevoObjeto.id);

                if (existe) {
                    return lista.map((obj) =>
                        obj.id === nuevoObjeto.id ? nuevoObjeto : obj
                    );
                }

                return [...lista, nuevoObjeto];
            });
        } catch (error) {
            showSnackbar(error.message, { severity: "error" });
        }
    };

    const exportExcel = async () => {
        setLoading(true);
        try {
            const response = await dispatch(
                exportarExcel({
                    excel_name: "noHomologadosProducts",
                    nombre: "Productos_No_Homologados",
                    calculateDate: calculateDate,
                })
            );
            if (response.meta.requestStatus === "fulfilled") {
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
                throw new Error("No se encontraron hojas en el archivo");
            }

            const headerRow = worksheet.getRow(1);
            const headersOriginal = headerRow.values.slice(1);
            const headers = headersOriginal.map((h) => normalizeEncabezados(h));

            const expectedHeaders = columnsMaestrosProducts
                .filter((col) => col.field !== "status")
                .map((col) => normalizeEncabezados(col.label));

            const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));

            if (missingHeaders.length > 0) {
                throw new Error(`Faltan columnas en el Excel: ${missingHeaders.join(", ")}`);
            }

            const dataRows = [];
            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                if (rowNumber === 1) return;

                const rowValues = row.values.slice(1);
                const item = {};

                columnsMaestrosProducts.forEach(({ field, label }) => {
                    if (field === "status") {
                        item[field] = true;
                    } else {
                        const colIndex = headers.indexOf(normalizeEncabezados(label));
                        let val = colIndex !== -1 ? rowValues[colIndex] ?? "" : "";

                        if (field === "periodo" && val) {
                            const date = new Date(val);
                            if (!isNaN(date.getTime())) {
                                const year = date.getUTCFullYear();
                                const month = String(date.getUTCMonth() + 1).padStart(2, "0");
                                val = `${year}-${month}-01`;
                            }
                        }
                        item[field] = val;
                    }
                });
                dataRows.push(item);
            });

            if (dataRows.length === 0) {
                throw new Error("No se encontraron datos válidos en el archivo.");
            }

            setDatosExcel(dataRows);
            setOpenUploadExcel(true);
            showSnackbar("Archivo procesado correctamente.", { severity: "success" });
        } catch (error) {
            showSnackbar(error.message || "Error leyendo el archivo Excel.", { severity: "error" });
        } finally {
            setLoading(false);
            event.target.value = null;
        }
    };

    const handleSincronizar = async () => {
        setLoading(true);
        const [year, month] = calculateDate.split("-");
        const dataSincronizar = {
            month: month,
            year: year,
        }
        const response = await dispatch(
            sincronizarDatosConsolidated(dataSincronizar)
        );
        if (response.meta.requestStatus === "fulfilled") {
            showSnackbar(response.payload.message, { severity: "success" });
            buscarLista(search);
        } else {
            showSnackbar(response.payload.message, { severity: "error" });
        }
        setLoading(false);
    };

    return (
        <>
            <AtomContainerGeneral
                children={
                    <>
                        {matriculacionCerrada !== "abierto" && (
                            <Box
                                sx={{
                                    position: "fixed",
                                    width: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    top: 104,
                                    right: 30,
                                    zIndex: 1000,
                                }}
                            >
                                <Chip
                                    label="Mes cerrado"
                                    color="error"
                                    sx={{ fontWeight: "500", height: "20px", fontSize: "0.85rem", top: 50, position: "relative", right: 0 }}
                                />
                            </Box>
                        )}
                        <Box sx={{
                            position: "fixed",
                            top: 85,
                            maxWidth: "220px",
                            right: 100,
                        }}>
                            <AtomDatePicker
                                id="calculateDate"
                                required={true}
                                mode="month"
                                label="Fecha de búsqueda"
                                color="#ffffff"
                                height="40px"
                                value={calculateDate}
                                onChange={(e) => {
                                    dispatch(setCalculateDate(e));
                                    setResultadosActualizados([]);
                                }}
                            />
                        </Box>
                        <>
                            <IconoFlotante
                                handleButtonClick={exportExcel}
                                title={"Descargar excel"}
                                iconName="SaveAlt"
                                color="#5ab9f6"
                                right={50}
                                top={97}
                            />
                            <IconoFlotante
                                handleButtonClick={() =>
                                    document.getElementById("input-excel-productos").click()
                                }
                                handleChangeFile={handleFileChange}
                                title={matriculacionCerrada === "abierto" ? "Subir archivo excel productos" : "Mes cerrado"}
                                id="input-excel-productos"
                                iconName="DriveFolderUploadOutlined"
                                top={97}
                                right={10}
                                disabled={matriculacionCerrada !== "abierto"}
                            />
                        </>

                        <AtomCard
                            title=""
                            nameButton={""}
                            border={true}
                            onClick={() => { }}
                            labelBuscador="Búsqueda por nombre"
                            placeholder="Buscar por nombre"
                            search={false}
                            valueSearch={search}
                            onChange={(e) => {
                                setSearch(e.target.value.toUpperCase());
                                debounceSearch(e.target.value.toUpperCase());
                            }}
                            children={
                                <>
                                    <Grid container spacing={2} justifyContent="right" sx={{ width: "100%" }}>
                                        {resultadosActualizados.length > 0 && (
                                            <Grid size={2} sx={{ position: "fixed", bottom: 25, right: 10, zIndex: 1000 }}>
                                                <AtomButtonPrimary
                                                    label="Guardar"
                                                    height="40px"
                                                    loading={loading}
                                                    onClick={() => handleGuardarExcel()}
                                                />
                                            </Grid>
                                        )}

                                        <Grid size={12}>
                                            {loading && <CustomLinearProgress />}
                                            <DataGrid
                                                rows={data}
                                                columns={columnsProductNull.map(col => ({
                                                    ...col,
                                                    editable: matriculacionCerrada === "abierto"
                                                }))}
                                                getRowHeight={() => "auto"}
                                                disableSelectionOnClick
                                                sx={styleTableData}
                                                processRowUpdate={(newRow) => {
                                                    const normalizedRow = {
                                                        ...newRow,
                                                        codeProduct: normalizeSicCode(newRow.codeProduct)
                                                    };
                                                    handleActualizarProducto(normalizedRow);
                                                    return normalizedRow;
                                                }}
                                                localeText={{
                                                    ...esES.components.MuiDataGrid.defaultProps.localeText,
                                                    noRowsLabel: "No existen datos registrados",
                                                    errorOverlayDefaultLabel: "Ha ocurrido un error.",
                                                }}
                                                pagination
                                                pageSizeOptions={[10, 50, 100]}
                                                initialState={{
                                                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                </>
                            }
                        />
                    </>
                }
            />
            <AtomDialogForm
                openDialog={openUploadExcel}
                titleCrear={loading ? "Procesando..." : "Productos No Homologados"}
                buttonCancel={!loading}
                handleSubmit={() => handleGuardarExcel(datosExcel)}
                buttonSubmit={!loading}
                loading={loading}
                maxWidth="xl"
                handleCloseDialog={handleCloseUploadExcel}
                dialogContentComponent={
                    <Box sx={{ width: "100%", justifyContent: "center" }}>
                        {loading ? (
                            <CustomLinearProgress />
                        ) : (
                            <>
                                {datosExcel.length > 0 ? (
                                    <AtomTableInformationExtraccion
                                        columns={columnsMaestrosProducts}
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

export default ProductosNoHomologados;

