import AtomCard from "../../atoms/AtomCard";
import AtomTableForm from "../../atoms/AtomTableForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import AtomCircularProgress from "../../atoms/AtomCircularProgress";
import { columnsProductNoHomologado } from "./constantes";
import {
    obtenerConsolidatedSelloutUnique,
} from "../../redux/configSelloutSlice";
import { debounce, timeSearch } from "../constantes";

const ProductosNoHomologados = ({ calculateDate }) => {
    const dispatch = useDispatch();
    const totalLista = useSelector(
        (state) => state.diccionario.totalColumnsCategorias || 0
    );
    console.log(totalLista);
    const [openMatriculacion, setOpenMatriculacion] = useState(false);
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

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
                }))
            setData(response.payload.items || []);
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

    const actions = [
        {
            label: "Editar",
            color: "info",
            onClick: (row) => handleEdit(row),
        },
    ];


    const handleEdit = (row) => {
        setOpenMatriculacion(true);
    };

    return (
        <>
            <AtomContainerGeneral
                children={
                    <>
                        <AtomCard
                            title=""
                            nameButton={""}
                            border={true}
                            onClick={handleOpenMatriculacion}
                            labelBuscador="Búsqueda por nombre"
                            placeholder="Buscar por nombre"
                            search={true}
                            valueSearch={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                debounceSearch(e.target.value);
                            }}
                            children={
                                <>
                                    <Grid container spacing={2}>
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
                                        <Grid size={12}>

                                        </Grid>
                                        <Grid size={12}>
                                            {loading ? (
                                                <AtomCircularProgress />
                                            ) : (
                                                <AtomTableForm
                                                    columns={columnsProductNoHomologado}
                                                    data={data}
                                                    actions={actions || []}
                                                    pagination={false}

                                                />
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

