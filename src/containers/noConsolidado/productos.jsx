import AtomCard from "../../atoms/AtomCard";
import AtomTableForm from "../../atoms/AtomTableForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import AtomCircularProgress from "../../atoms/AtomCircularProgress";
import { columnsProductNull, styleTableData } from "./constantes";
import {
    obtenerConsolidatedSelloutUnique,
    subirExcelMaestrosProducts,
    exportarExcel,
    cargarExcel
} from "../../redux/configSelloutSlice";
import { debounce, timeSearch, formatDate } from "../constantes";
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

const ProductosNoHomologados = () => {
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
                codeProduct: item.codeProduct?.trim() === "" ? "OTROS" : item.codeProduct
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
                const response = await dispatch(subirExcelMaestrosProducts(chunk));

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

            const valorOriginal = original.codeProduct;
            const valorNuevo = newRow.codeProduct;

            if (valorOriginal === valorNuevo) return;

            const nuevoObjeto = {
                id: newRow.id,
                distributor: newRow.distributor,
                productStore: newRow.codeProductDistributor,
                productDistributor: newRow.descriptionDistributor,
                codeProductSic: Number(valorNuevo) || 0,
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
                    excel_name: "noHomologadosProducts",
                    nombre: "Productos_No_Homologados",
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

                                        <Grid size={11} >
                                            {loading ? (
                                                <AtomCircularProgress />
                                            ) : (
                                                <Box sx={{ width: "100%", borderRadius: 3 }}>
                                                    <DataGrid
                                                        rows={data}
                                                        columns={columnsProductNull}
                                                        getRowHeight={() => "auto"}
                                                        disableSelectionOnClick
                                                        sx={styleTableData}
                                                        processRowUpdate={(newRow) => {
                                                            handleActualizarProducto(newRow);
                                                            return newRow;
                                                        }}
                                                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                                        pagination
                                                        pageSizeOptions={[10]}
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

export default ProductosNoHomologados;

