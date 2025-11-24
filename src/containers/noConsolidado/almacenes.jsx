import AtomCard from "../../atoms/AtomCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import AtomCircularProgress from "../../atoms/AtomCircularProgress";
import { columnsStoreNull, styleTableData } from "./constantes";
import {
    obtenerConsolidatedSelloutUnique,
    subirExcelMaestrosStores,
    exportarExcel,
    cargarExcel
} from "../../redux/configSelloutSlice";
import { debounce, timeSearch, formatDate, isMonthClosed } from "../constantes";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useSnackbar } from "../../context/SnacbarContext";
import {
    Box,
    Paper,
} from "@mui/material";
import { setCalculateDate } from "../../redux/configSelloutSlice";
import AtomDatePicker from "../../atoms/AtomDatePicker";
import AtomButtonPrimary from "../../atoms/AtomButtonPrimary";
import IconoFlotante from "../../atoms/IconActionPage";
import {
    obtenerMatriculacionConfig,
} from "../../redux/selloutDatosSlic";

const AlmacenesNoHomologados = () => {
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
        matriculacionConfigrada?.closingDate
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
                    codeStore: true,
                })
            );
            const items = response.payload.items || [];
            const dataTransformada = items.map(item => ({
                ...item,
                // codeStore: item.codeStore?.trim() === "" ? "NO SE VISITA" : item.codeStore
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

    const handleGuardarExcel = async () => {
        if (resultadosActualizados.length === 0) {
            showSnackbar("No hay cambios para guardar");
            return;
        }

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
            const chunks = splitInChunks(resultadosActualizados, chunkSize);

            for (const [index, chunk] of chunks.entries()) {
                const response = await dispatch(subirExcelMaestrosStores(chunk));

                if (response.meta.requestStatus !== "fulfilled") {
                    throw new Error(
                        response.payload?.message || `Error al subir el chunk ${index + 1}`
                    );
                }
            }

            showSnackbar("Cambios guardados correctamente");
            setResultadosActualizados(null);
        } catch (error) {
            showSnackbar(error.message || "Ocurrió un error al guardar");
        } finally {
            buscarLista(search);
        }
    };

    const handleActualizarProducto = async (newRow) => {
        if (newRow.codeStore === "") {
            return;
        }
        try {
            const nuevoObjeto = {
                id: newRow.id,
                distributor: newRow.distributor,
                storeDistributor: newRow.codeStoreDistributor,
                codeStoreSic: newRow.codeStore || null,
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
            showSnackbar(error.message);
        }
    };

    const exportExcel = async () => {
        setLoading(true);
        try {
            const response = await dispatch(
                exportarExcel({
                    excel_name: "noHomologadosStores",
                    nombre: "Almacenes_No_Homologados",
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

    const enviarArchivo = async (file) => {

        try {
            const response = await dispatch(
                cargarExcel({
                    type: "noHomologadosStore",
                    date: calculateDate,
                    file
                })
            );

            if (response.meta.requestStatus !== 'fulfilled') {
                throw response.payload || 'Error al subir el archivo.';
            }
            showSnackbar("Archivo cargado correctamente");
            buscarLista(search);
        } catch (error) {
            setLoading(false);
            showSnackbar(error || "Error al cargar archivo");
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        enviarArchivo(file);
    }

    return (
        <>
            <AtomContainerGeneral
                children={
                    <>
                        {matriculacionCerrada === "abierto" && (
                            <>
                                <IconoFlotante
                                    handleButtonClick={exportExcel}
                                    title="Descargar excel"
                                    iconName="SaveAlt"
                                    color="#5ab9f6"
                                    right={70}
                                />
                                <IconoFlotante
                                    handleButtonClick={() =>
                                        document.getElementById("input-excel-productos").click()
                                    }
                                    handleChangeFile={handleFileChange}
                                    title="Subir archivo excel productos no homologados"
                                    id="input-excel-productos"
                                    iconName="DriveFolderUploadOutlined"
                                />
                            </>
                        )}

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
                                    <Grid container spacing={2} sx={{ justifyContent: "center", display: "flex" }}>
                                        <Grid size={3}>
                                            <AtomDatePicker
                                                id="calculateDate"
                                                required={true}
                                                mode="month"
                                                label="Fecha de búsqueda"
                                                color="#ffffff"
                                                height="45px"
                                                value={calculateDate}
                                                onChange={(e) => {
                                                    dispatch(setCalculateDate(e));
                                                    setResultadosActualizados(null);
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={5}>

                                        </Grid>
                                        <Grid size={1.5} mt={1.5}>
                                            {resultadosActualizados != null && (
                                                <AtomButtonPrimary
                                                    label="Guardar"
                                                    onClick={handleGuardarExcel}

                                                />
                                            )}
                                        </Grid>

                                        <Grid size={11} >
                                            {loading ? (
                                                <AtomCircularProgress />
                                            ) : (
                                                <Box sx={{ width: "100%", borderRadius: 3 }}>
                                                    <DataGrid
                                                        rows={data}
                                                        columns={columnsStoreNull.map(col => ({
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
                                                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                                        pagination
                                                        pageSizeOptions={[10, 50, 100]}
                                                        initialState={{
                                                            pagination: { paginationModel: { pageSize: 10, page: 0 } },
                                                        }}
                                                    />

                                                </Box>
                                            )}
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

export default AlmacenesNoHomologados;

