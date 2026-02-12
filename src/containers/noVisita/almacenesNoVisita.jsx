import AtomCard from "../../atoms/AtomCard";
import AtomTableForm from "../../atoms/AtomTableForm";
import { useEffect, useCallback } from "react";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import {
    obtenerNoDefinidos,
    setCalculateDate
} from "../../redux/configSelloutSlice";
import { columnsAlmacenesNoVisita } from "./constantes";
import { useDispatch, useSelector } from "react-redux";
import { Search as SearchIcon } from "@mui/icons-material";
import { limitGeneral } from "../constantes";
import AtomSelect from "../../atoms/AtomSelect";
import AtomDatePicker from "../../atoms/AtomDatePicker";
import {
    Tooltip,
    TextField,
    IconButton,
    InputAdornment
} from "@mui/material";

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

const AlmacenNoVisita = () => {
    const dispatch = useDispatch();
    const dataNoDefinidos = useSelector(
        (state) => state?.configSellout?.dataNoDefinidos || {}
    );
    const totalNoDefinidos = useSelector(
        (state) => state?.configSellout?.totalNoDefinidos || 0
    );
    const calculateDate = useSelector(
        (state) => state?.configSellout?.calculateDate || formatDate(new Date())
    );
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filtroBusqueda, setFiltroBusqueda] = useState("codeStoreDistributor");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(limitGeneral);

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
            buscarMaestrosStores(value, page, limit);
        }, 1000),
        [filtroBusqueda]
    );

    const buscarMaestrosStores = async (value, page, limit) => {
        setLoading(true);
        try {
            const filtros = {
                [filtroBusqueda]: value,
                page,
                limit,
                calculateDate,
                tipo: "stores",
            };
            await dispatch(obtenerNoDefinidos(filtros));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarMaestrosStores(search, page, limit);
    }, [page, limit, calculateDate]);

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
                            border={false}
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
                                        columns={columnsAlmacenesNoVisita}
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

export default AlmacenNoVisita;
