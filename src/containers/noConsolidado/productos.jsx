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
    exportarExcel,
    cargarExcel,
    sincronizarDatosConsolidated
} from "../../redux/configSelloutSlice";
import { debounce, timeSearch, formatDate, isMonthClosed } from "../constantes";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useSnackbar } from "../../context/SnacbarContext";
import {
    Box,
    Paper,
    Chip
} from "@mui/material";
import { setCalculateDate } from "../../redux/configSelloutSlice";
import AtomDatePicker from "../../atoms/AtomDatePicker";
import AtomButtonPrimary from "../../atoms/AtomButtonPrimary";
import IconoFlotante from "../../atoms/IconActionPage";
import {
    obtenerMatriculacionConfig,
} from "../../redux/selloutDatosSlic";

const ProductosNoHomologados = () => {
    const dispatch = useDispatch();
    const totalLista = useSelector(
        (state) => state.diccionario.totalColumnsCategorias || 0
    );
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
    const [openMatriculacion, setOpenMatriculacion] = useState(false);
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultadosActualizados, setResultadosActualizados] = useState(null);

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
            const dataTransformada = items.map(item => ({
                ...item,
                // codeProduct: item.codeProduct?.trim() === "" ? "OTROS" : item.codeProduct
            }));
            setData(dataTransformada);
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

    const handleOpenMatriculacion = () => {
        setOpenMatriculacion(true);
    };

    const handleGuardarMaestros = async () => {
        if (resultadosActualizados.length === 0) {
            showSnackbar("No hay cambios para guardar", { severity: "info" });
            return;
        }

        setLoading(true);
        try {
            const dataToSave = resultadosActualizados.map(({ id, ...rest }) => rest);
            console.log("Enviando maestros productos:", dataToSave);
            const response = await dispatch(createMaestrosProducts(dataToSave));

            if (response.meta.requestStatus !== "fulfilled") {
                throw new Error(
                    response.payload?.message || "Error al guardar los maestros"
                );
            }

            showSnackbar("Cambios guardados correctamente", { severity: "success" });
            setResultadosActualizados(null);
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
            const valorNuevo = newRow.codeProduct;

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

    const enviarArchivo = async (file) => {
        try {
            const response = await dispatch(
                cargarExcel({
                    type: "noHomologadosProducts",
                    date: calculateDate,
                    file
                })
            );

            if (response.meta.requestStatus !== 'fulfilled') {
                throw response.payload || 'Error al subir el archivo.';
            }
            showSnackbar("Archivo cargado correctamente", { severity: "success" });
        } catch (error) {
            setLoading(false);
            showSnackbar(error || "Error al cargar archivo", { severity: "error" });
        } finally {
            setLoading(false);
            handleSincronizar();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        enviarArchivo(file);
    }

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
            setLoading(false);
            buscarLista(search);
        } else {
            showSnackbar(response.payload.message, { severity: "error" });
            setLoading(false);
        }
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
                                    setResultadosActualizados(null);
                                }}
                            />
                        </Box>
                        <>
                            <IconoFlotante
                                handleButtonClick={exportExcel}
                                // title={matriculacionCerrada === "abierto" ? "Descargar excel" : "Revise la fecha de cierre"}
                                title={"Descargar excel"}
                                iconName="SaveAlt"
                                color="#5ab9f6"
                                right={50}
                                top={97}
                            // disabled={matriculacionCerrada !== "abierto"}
                            />
                            <IconoFlotante
                                handleButtonClick={() =>
                                    document.getElementById("input-excel-productos").click()
                                }
                                handleChangeFile={handleFileChange}
                                title={matriculacionCerrada === "abierto" ? "Subir archivo excel productos no homologados" : "Mes cerrado"}
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
                            onClick={handleOpenMatriculacion}
                            labelBuscador="Búsqueda por nombre"
                            placeholder="Buscar por nombre"
                            search={false}
                            valueSearch={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                debounceSearch(e.target.value);
                            }}
                            children={
                                <>
                                    <Grid container spacing={2} justifyContent="right" sx={{ width: "100%" }}>
                                        {resultadosActualizados != null && (
                                            <Grid size={2} sx={{ position: "fixed", bottom: 25, right: 10, zIndex: 1000 }}>
                                                <AtomButtonPrimary
                                                    label="Guardar"
                                                    height="40px"
                                                    loading={loading}
                                                    onClick={handleGuardarMaestros}

                                                />
                                            </Grid>
                                        )}

                                        <Grid size={12}>
                                            {loading && <CustomLinearProgress />}
                                            <DataGrid
                                                rows={data}
                                                columns={columnsProductNull.map(col => ({
                                                    ...col,
                                                    editable: matriculacionCerrada === "abierto" ? true : false
                                                }))}
                                                getRowHeight={() => "auto"}
                                                disableSelectionOnClick
                                                sx={styleTableData}
                                                processRowUpdate={(newRow) => {
                                                    handleActualizarProducto(newRow);
                                                    return newRow;
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
        </>
    );
};

export default ProductosNoHomologados;

