import AtomCard from "../../../atoms/AtomCard";
import AtomTableForm from "../../../atoms/AtomTableForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import {
    obtenerColumns,
    createColumns,
    updateColumns,
    deleteColumns
} from "../../../redux/diccionarioSlice";
import AtomDialogForm from "../../../atoms/AtomDialogForm";
import AtomTextField from "../../../atoms/AtomTextField";
import AtomContainerGeneral from "../../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "../../../context/SnacbarContext";
import { useDialog } from "../../../context/DialogDeleteContext";
import AtomCircularProgress from "../../../atoms/AtomCircularProgress";
import { usePermission } from "../../../context/PermisosComtext";
import { limitGeneral } from "../../constantes";
import AtomDatePicker from "../../../atoms/AtomDatePicker";
import { Box } from "@mui/material";
import AtomAlert from "../../../atoms/AtomAlert";

const columns = [
    {
        label: "Palabra",
        field: "keyword",
    },
];

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

const ColumnsCategorias = ({ id }) => {

    const hasPermission = usePermission();
    const namePermission = hasPermission("ACCIONES DICCIONARIO");
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();
    const { showDialog } = useDialog();
    const dataDiccionario = useSelector(
        (state) => state.diccionario.listaCategorias || []
    );

    const data = useSelector(
        (state) => state.diccionario.listaColumnsCategorias || []);

    const totalLista = useSelector(
        (state) => state.diccionario.totalColumnsCategorias || 0
    );
    const [openMatriculacion, setOpenMatriculacion] = useState(false);
    const [search, setSearch] = useState("");

    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [matricula, setMatricula] = useState({
        keyword: "",
        categoryId: id,
    });
    const [errors, setErrors] = useState({});

    const existeKeywordGlobal = (keyword) => {
        if (!keyword) return false;

        const normalizado = keyword.trim().toLowerCase();

        return dataDiccionario.some(item =>
            item.keywords.some(k =>
                (k.keyword || "").trim().toLowerCase() === normalizado
            )
        );
    }

    const debounceSearch = useCallback(
        debounce((value) => {
            buscarLista(value);
        }, 1000),
        []
    );

    const buscarLista = async (value) => {
        setLoading(true);
        try {
            await dispatch(
                obtenerColumns({ keyword: value, categoryId: id })
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarLista(search);
    }, []);

    const handleSubmit = async () => {
        if (!matricula.keyword) {
            showSnackbar("La descripción de la configuración es requerida", { severity: "error" });
            return;
        }
        const duplicado = existeKeywordGlobal(matricula.keyword);

        if (duplicado) {
            showSnackbar(" ⚠️ La palabra ya existe", { severity: "error" });
            return;
        }
        if (matricula.id) {
            editMatriculacion();
        } else {
            crearMatriculacion();
        }
    };

    const editMatriculacion = async () => {
        const data = {
            id: matricula.id,
            keyword: matricula.keyword,
            categoryId: id,
        };
        const response = await dispatch(updateColumns(data));
        if (response.meta.requestStatus === "fulfilled") {
            showSnackbar(response.payload.message, { severity: "success" });
            buscarLista();
            handleCloseMatriculacion();
        } else {
            showSnackbar(response.payload.message, { severity: "error" });
        }
    };

    const crearMatriculacion = async () => {
        const response = await dispatch(createColumns(matricula));
        if (response.meta.requestStatus === "fulfilled") {
            showSnackbar(response.payload.message, { severity: "success" });
            handleCloseMatriculacion();
            buscarLista();
        } else {
            showSnackbar(response.payload.message, { severity: "error" });
        }
    };

    const handleOpenMatriculacion = () => {
        setOpenMatriculacion(true);
    };

    const actions = [
        {
            label: "Editar",
            color: "info",
            onClick: (row) => handleEdit(row),
        },
        {
            label: "Eliminar",
            color: "error",
            onClick: (row) => handleDelete(row),
        },
    ];


    const handleCloseMatriculacion = () => {
        setOpenMatriculacion(false);
        setMatricula({
            keyword: "",
            categoryId: id
        });
        setErrors({});
        setEdit(false);
    };

    const handleDelete = (row) => {
        showDialog({
            title: "Eliminar registro",
            message: "¿Estás seguro de que deseas eliminar este registro?",
            onConfirm: async () => {
                try {
                    const response = await dispatch(deleteColumns(row.id));
                    if (response.meta.requestStatus === "fulfilled") {
                        showSnackbar(response.payload.message, { severity: "success" });
                        buscarLista();
                    } else {
                        showSnackbar(response.payload.message, { severity: "error" });
                    }
                } catch (error) {
                    showSnackbar(error || "Error al eliminar registro", { severity: "error" });
                }
            },
            onCancel: () => { },
        });
    };

    const handleEdit = (row) => {
        setMatricula(row);
        setEdit(true);
        setOpenMatriculacion(true);
    };

    return (
        <>
            <AtomContainerGeneral
                color="#ffffffff"
                children={
                    <>
                        <Box sx={{ mt: 1, mb: 1 }}>
                            <AtomAlert
                                severity="info"
                                text="El sistema no diferencia entre mayúsculas y minúsculas. Si una palabra ya existe como 'fecha', no podrá registrar 'FECHA', 'Fecha' ni ninguna otra variación."
                            />
                        </Box>

                        <AtomCard
                            title="Palabras"
                            nameButton={namePermission ? "Crear" : ""}
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
                                                    columns={columns}
                                                    data={data}
                                                    actions={namePermission ? actions : []}
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
            <AtomDialogForm
                openDialog={openMatriculacion}
                titleCrear="Nueva Palabra"
                editDialog={edit}
                buttonCancel={true}
                maxWidth="sm"
                buttonSubmit={true}
                handleSubmit={handleSubmit}
                handleCloseDialog={handleCloseMatriculacion}
                titleEditar="Nueva Palabra"
                dialogContentComponent={
                    <Grid container spacing={2} sx={{ width: "90%" }}>
                        <Grid size={12}>
                            <AtomTextField
                                id="keyword"
                                required={true}
                                headerTitle="Palabra"
                                value={matricula.keyword}
                                onChange={(e) =>
                                    setMatricula({
                                        ...matricula,
                                        keyword: e.target.value,
                                    })
                                }
                                error={errors.keyword}
                                helperText={
                                    errors.keyword ? "El campo es requerido" : ""
                                }
                            />
                        </Grid>
                    </Grid>
                }
            />
        </>
    );
};

export default ColumnsCategorias;
