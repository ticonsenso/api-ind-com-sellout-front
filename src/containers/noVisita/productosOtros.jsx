import AtomCard from "../../atoms/AtomCard";
import AtomTableForm from "../../atoms/AtomTableForm";
import { useEffect, useCallback } from "react";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { useState } from "react";
import { useSnackbar } from "../../context/SnacbarContext";
import {
    obtenerNoDefinidos,
    exportarExcel,
    setCalculateDate,
} from "../../redux/configSelloutSlice";
import { columnsProductosOtros } from "./constantes";
import { useDispatch, useSelector } from "react-redux";
import { useDialog } from "../../context/DialogDeleteContext";
import { limitGeneral } from "../constantes";
import AtomSelect from "../../atoms/AtomSelect";
import AtomDatePicker from "../../atoms/AtomDatePicker";
import {
    Grid,
    Tooltip,
} from "@mui/material";
import AtomTextFielInputForm from "../../atoms/AtomTextField";

const formatDate = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getUTCDate()).padStart(2, "0");
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
    const anio = fecha.getUTCFullYear();
    return `${anio}-${mes}-${dia}`;
};

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

const ProductosOtros = () => {
    const dispatch = useDispatch();
    const { showDialog } = useDialog();
    const { showSnackbar } = useSnackbar();
    const [datosExcel, setDatosExcel] = useState([]);
    const [openUploadExcel, setOpenUploadExcel] = useState(false);

    // Selectors matching AlmacenNoVisita pattern
    const dataNoDefinidos = useSelector(
        (state) => state?.configSellout?.dataNoDefinidos || {}
    );
    const totalNoDefinidos = useSelector(
        (state) => state?.configSellout?.totalNoDefinidos || 0
    );
    const calculateDate = useSelector(
        (state) => state?.configSellout?.calculateDate || formatDate(new Date())
    );

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(limitGeneral);
    const [loading, setLoading] = useState(false);
    const [filtroBusqueda, setFiltroBusqueda] = useState("codeStoreDistributor"); // Default filter

    const [fullScreen, setFullScreen] = useState(false);

    const handleFullScreen = () => {
        setFullScreen(!fullScreen);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setLimit(event.target.value);
        setPage(1);
    };

    const debounceSearchAddress = useCallback(
        debounce((value) => {
            buscarProductos(value, page, limit);
        }, 1000),
        [filtroBusqueda]
    );

    const buscarProductos = async (value, page, limit) => {
        setLoading(true);
        try {
            const filtros = {
                [filtroBusqueda]: value,
                page,
                limit,
                calculateDate,
                tipo: "products",
            };
            await dispatch(obtenerNoDefinidos(filtros));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarProductos(search, page, limit);
    }, [page, limit, calculateDate]);

    const exportExcel = async () => {
        setLoading(true);
        try {
            const response = await dispatch(
                exportarExcel({
                    excel_name: "mt. alm",
                    nombre: "Maestros Almacén",
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

    const confirmarExportarExcel = () => {
        showDialog({
            title: "Confirmación de descarga",
            message:
                "Usted va a realizar la descarga del archivo excel de maestros almacenes",
            onConfirm: exportExcel,
            onCancel: () => { },
        });
    };

    const optionsFiltros = [
        {
            id: "codeStoreDistributor",
            label: "Código almacén distribuidor",
        },
        {
            id: "codeProductDistributor",
            label: "Código producto distribuidor",
        },
        {
            id: "descriptionDistributor",
            label: "Descripción Distribuidor",
        },
    ];

    return (
        <>
            <AtomContainerGeneral
                children={
                    <>

                        <AtomCard
                            fullScreen={fullScreen}
                            handleFullScreen={handleFullScreen}
                            title=""
                            nameButton=""
                            border={true}
                            onClick={() => { }}
                            search={false}
                            extra={
                                <Grid
                                    container
                                    spacing={2}
                                    sx={{ justifyContent: "center", mt: -5 }}
                                >
                                    <Grid size={2.5}>
                                        <AtomDatePicker
                                            required={true}
                                            mode="month"
                                            color="#ffffff"
                                            height="45px"
                                            label="Fecha de carga"
                                            value={calculateDate}
                                            onChange={(value) => dispatch(setCalculateDate(value))}
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <AtomSelect
                                            color="#ffffff"
                                            height="45px"
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
                                        <Tooltip title="Buscar por distribuidor, código almacén, código producto y descripción">
                                            <AtomTextFielInputForm
                                                variant="outlined"
                                                value={search}
                                                onChange={(e) => {
                                                    setPage(1);
                                                    setLimit(5);
                                                    setSearch(e.target.value);
                                                    debounceSearchAddress(e.target.value);
                                                }}
                                                placeholder="Buscar..."
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            }
                            children={
                                <>
                                    <AtomTableForm
                                        columns={columnsProductosOtros}
                                        data={dataNoDefinidos}
                                        showIcons={true}
                                        actions={[]}
                                        pagination={true}
                                        page={page}
                                        limit={limit}
                                        count={totalNoDefinidos}
                                        handleChangePage={handleChangePage}
                                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                                        loading={loading}
                                    />
                                </>
                            }
                        />
                    </>
                }
            />
        </>
    );
};

export default ProductosOtros;
