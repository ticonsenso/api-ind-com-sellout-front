import AtomCard from "../../atoms/AtomCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import AtomCircularProgress from "../../atoms/AtomCircularProgress";
import { styleTableData } from "./constantes";
import {
    obtenerConsolidatedSelloutUnique,
    subirExcelMaestrosStores,
    exportarExcel, cargarExcel,
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
import {
    obtenerMatriculacionConfig,
} from "../../redux/selloutDatosSlic";


const AlmacenesNoHomologados = () => {
    const dispatch = useDispatch();
    const totalLista = useSelector(
        (state) => state.diccionario.totalColumnsCategorias || 0
    );
    const calculateDate = useSelector(
        (state) => state?.configSellout?.calculateDate || formatDate(new Date())
    );
    const isMonthClosed = (calculateDate, closingDate) => {
        if (!calculateDate || !closingDate) return false;

        const calc = new Date(calculateDate);
        const cierre = new Date(closingDate);

        // Normalizar ambos al primer día del mes
        calc.setDate(1);
        cierre.setDate(1);

        // Si calculateDate está después del mes de cierre -> CERRADO
        return calc > cierre;
    };

    const dataMatriculacionConfig = useSelector(
        (state) => state.selloutDatos.dataMatriculacionConfig
    );

    const matriculacion = dataMatriculacionConfig?.[0];

    const matriculacionCerrada = isMonthClosed(
        calculateDate,
        matriculacion?.closingDate
    );


    console.log(dataMatriculacionConfig);

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


    const columnsStoreNull = [
        {
            field: "distributor",
            headerName: "Distribuidor",
            width: 200,
            flex: 1,
            editable: false,
        },
        {
            field: "codeStoreDistributor",
            headerName: "Almacén Distribuidor",
            width: 200,
            flex: 1,
            editable: false,
        },
        {
            field: "codeStore",
            headerName: "Cod. Almacen SIC",
            width: 200,
            flex: 1,
            editable: true,
        },
        // {
        //     field: "storeName",
        //     headerName: "Nombre Almacen",
        //     width: 200,
        //     flex: 1,
        //     editable: false,
        // },
    ];



    useEffect(() => {
        buscarLista(search);
        buscarMatriculacion();
    }, [calculateDate]);

    const handleOpenMatriculacion = () => {
        setOpenMatriculacion(true);
    };

    const buscarMatriculacion = async () => {
        await dispatch(
            obtenerMatriculacionConfig({ search: "", page: 1, limit: 100 })
        );
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

    const handleActualizarProducto = (newRow) => {
        try {
            const original = data.find((obj) => obj.id === newRow.id);

            if (!original) return;

            const valorOriginal = original.codeStore;
            const valorNuevo = newRow.codeStore;

            if (valorOriginal === valorNuevo) return;

            const nuevoObjeto = {
                id: newRow.id,
                distributor: newRow.distributor,
                storeDistributor: newRow.codeStoreDistributor,
                codeStoreSic: Number(valorNuevo) || 0,
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
                    type: "noHomologadosProducts",
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
            console.error('Error al subir el archivo:', error);
            showSnackbar("Error al cargar archivo");
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
                    <>{!matriculacionCerrada && (
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
                                    document.getElementById("input-excel-almacenes").click()
                                }
                                handleChangeFile={handleFileChange}
                                title="Subir archivo excel almacenes no homologados"
                                id="input-excel-almacenes"
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
                                                        columns={columnsStoreNull.map(col => ({
                                                            ...col,
                                                            editable: !matriculacionCerrada
                                                        }))}
                                                        getRowHeight={() => "auto"}
                                                        sx={styleTableData}
                                                        disableSelectionOnClick
                                                        processRowUpdate={(newRow) => {
                                                            handleActualizarProducto(newRow);
                                                            return newRow;
                                                        }}
                                                        pagination
                                                        pageSizeOptions={[10, 50, 100]}
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

