import AtomCard from "../../atoms/AtomCard";
import AtomTableForm from "../../atoms/AtomTableForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import AtomCircularProgress from "../../atoms/AtomCircularProgress";
import {
    obtenerConsolidatedSelloutUnique,
} from "../../redux/configSelloutSlice";
import { columnsStoreNoHomologado } from "./constantes";
import { debounce, timeSearch } from "../constantes";

const AlmacenesNoHomologados = ({ calculateDate }) => {
    const dispatch = useDispatch();
    const totalLista = useSelector(
        (state) => state.diccionario.totalColumnsCategorias || 0
    );
    console.log(totalLista);
    const [openMatriculacion, setOpenMatriculacion] = useState(false);
    const [search, setSearch] = useState("");

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const debounceSearch = useCallback(
        debounce((value) => {
            buscarLista(value);
        }, timeSearch),
        []
    );

    const buscarLista = async () => {
        setLoading(true);
        try {
            const response = await dispatch(
                obtenerConsolidatedSelloutUnique({
                    calculateDate: calculateDate,
                    codeStore: true,
                }))
            console.log(response, "00000");
            setData(response.payload.items);
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
                                        <Grid size={12}>

                                        </Grid>
                                        <Grid size={12}>
                                            {loading ? (
                                                <AtomCircularProgress />
                                            ) : (
                                                <AtomTableForm
                                                    columns={columnsStoreNoHomologado}
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

export default AlmacenesNoHomologados;
