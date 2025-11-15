import AtomCard from "../../atoms/AtomCard";
import AtomTableForm from "../../atoms/AtomTableForm";
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
} from "../../redux/configSelloutSlice";
import { debounce, timeSearch, formatDate } from "../constantes";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { useSnackbar } from "../../context/SnacbarContext";
import {
    Box,
    Paper,
} from "@mui/material";
import AtomButtonPrimary from "../../atoms/AtomButtonPrimary";
import { setCalculateDate } from "../../redux/configSelloutSlice";
import AtomDatePicker from "../../atoms/AtomDatePicker";
import IconoFlotante from "../../atoms/IconActionPage";

const AlmacenesNoHomologados = () => {
    const dispatch = useDispatch();
    const totalLista = useSelector(
        (state) => state.diccionario.totalColumnsCategorias || 0
    );
    const calculateDate = useSelector(
        (state) => state?.configSellout?.calculateDate || formatDate(new Date())
    );
    const { showSnackbar } = useSnackbar();
    console.log(totalLista);
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

    console.log("resultadosActualizados", resultadosActualizados);

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
                codeStore: item.codeStore?.trim() === "" ? "NO SE VISITA" : item.codeStore
            }));
            setData(dataTransformada);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarLista(search);
    }, [calculateDate]);

    const handleOpenMatriculacion = () => {
        setOpenMatriculacion(true);
    };

    const handleGuardarExcel = async () => {
        if (resultadosActualizados.length === 0) {
            showSnackbar("No hay cambios para guardar");
            return;
        }

        console.log("ENVIANDO:", resultadosActualizados);
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
            setLoading(false);
        }
    };

    const handleActualizarProducto = (newRow) => {
        try {
            const original = data.find((obj) => obj.id === newRow.id);

            if (!original) return;

            const valorOriginal = original.codeStore;
            const valorNuevo = newRow.codeStore;

            // No registrar si no hubo cambio REAL
            if (valorOriginal === valorNuevo) return;

            const nuevoObjeto = {
                id: newRow.id,
                distributor: newRow.distributor,
                storeDistributor: newRow.codeStoreDistributor,
                codeStoreSic: Number(valorNuevo) || 0,
            };

            setResultadosActualizados((prev) => {
                const lista = prev || []; // evitar error por null
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
                    excel_name: "consolidated_data_stores",
                    nombre: "Plantilla estándar",
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

    return (
        <>
            <AtomContainerGeneral
                children={
                    <>
                        <IconoFlotante
                            handleButtonClick={exportExcel}
                            title="Descargar excel"
                            iconName="SaveAlt"
                            color="#5ab9f6"
                            right={20}
                        />
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
                                        {/* <Grid size={4}>
                                            <AtomTextFielInputForm
                                                headerTitle="Buscar por:"
                                                placeholder="Identificación, código y nombre del colaborador"
                                                value={search}
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                    debounceSearch(e.target.value);
                                                }}
                                            />
                                        </Grid> */}

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

                                        <Grid size={10}>
                                            {loading ? (
                                                <AtomCircularProgress />
                                            ) : (
                                                <Box component={Paper} sx={{ width: "100%", borderRadius: 3 }}>
                                                    <DataGrid
                                                        rows={data}
                                                        columns={columnsStoreNull}
                                                        getRowHeight={() => "auto"}
                                                        sx={styleTableData}
                                                        disableSelectionOnClick
                                                        // hideFooter
                                                        processRowUpdate={(newRow) => {
                                                            handleActualizarProducto(newRow);
                                                            return newRow;
                                                        }}
                                                        pagination
                                                        pageSizeOptions={[10]}
                                                        initialState={{
                                                            pagination: { paginationModel: { pageSize: 10, page: 0 } },
                                                        }}
                                                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
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

