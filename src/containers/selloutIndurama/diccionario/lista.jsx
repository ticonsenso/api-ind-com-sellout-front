import AtomCard from "../../../atoms/AtomCard";
import AtomTableForm from "../../../atoms/AtomTableForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import {
    deleteCategorias,
    updateCategorias,
    createCategorias,
    obtenerListaCategorias,
    setListaColumns,
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
import ColumnsCategorias from "./columnsCategorias";
import { columnsListaDiccionario, variablesDiccionario } from "./constantes"
import { debounce, validateForm } from "../../constantes";

const ListaCategorias = () => {
    const hasPermission = usePermission();
    const namePermission = hasPermission("ACCIONES DICCIONARIO");
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();
    const { showDialog } = useDialog();
    const dataConNombre = useSelector(
        (state) => state.diccionario.listaCategorias || []
    );

    const data = dataConNombre.map(item => {
        const diccionarioItem = variablesDiccionario.find(
            (dic) => dic.id === item.name
        );
        const nombre = diccionarioItem ? diccionarioItem.label : item.name;
        return {
            ...item,
            nombre,
        };
    });

    const totalLista = useSelector(
        (state) => state.diccionario.totalCategorias || 0
    );
    const [openMatriculacion, setOpenMatriculacion] = useState(false);
    const [openColumns, setOpenColumns] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(limitGeneral);
    const [edit, setEdit] = useState(false);
    const [idCategoria, setIdCategoria] = useState(null);
    const paramsValidate = ["description", "name"];
    const [loading, setLoading] = useState(false);
    const [matricula, setMatricula] = useState({
        description: "",
        name: "",
    });
    const [errors, setErrors] = useState({});

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setLimit(event.target.value);
        setPage(1);
    };

    const debounceSearch = useCallback(
        debounce((value) => {
            buscarLista(value, page, limit);
        }, 1000),
        []
    );

    const buscarLista = async (value, page, limit) => {
        setLoading(true);
        try {
            await dispatch(
                obtenerListaCategorias({ name: value, page, limit })
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarLista(search, page, limit);
    }, [page, limit]);

    const handleSubmit = async () => {
        const { isValid } = validateForm({
            data: matricula,
            fields: paramsValidate,
            setErrors,
        });

        if (!isValid) return;
        if (matricula.id) {
            editMatriculacion();
        } else {
            crearMatriculacion();
        }
    };

    const editMatriculacion = async () => {
        const data = {
            id: matricula.id,
            description: matricula.description,
            name: matricula.name,
        };
        const response = await dispatch(updateCategorias(data));
        if (response.meta.requestStatus === "fulfilled") {
            showSnackbar(response.payload.message, { severity: "success" });
            buscarLista();
            handleCloseMatriculacion();
        } else {
            showSnackbar(response.payload.message, { severity: "error" });
        }
    };

    const crearMatriculacion = async () => {
        const response = await dispatch(createCategorias(matricula));
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

    const handleOpenColumns = (row) => {
        setIdCategoria(row.id);
        setOpenColumns(true);
    };

    const handleCloseColumns = () => {
        setOpenColumns(false);
    };

    const actions = [
        // {
        //     label: "Editar",
        //     color: "info",
        //     onClick: (row) => handleEdit(row),
        // },
        // {
        //     label: "Eliminar",
        //     color: "error",
        //     onClick: (row) => handleDelete(row),
        // },
        {
            label: "Configurar",
            color: "success",
            onClick: (row) => handleOpenColumns(row),
        }
    ];

    const handleCloseMatriculacion = () => {
        setOpenMatriculacion(false);
        setMatricula({
            description: "",
            name: "",
        });
        setErrors({});
        setEdit(false);
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
                            search={false}
                            valueSearch={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                debounceSearch(e.target.value);
                            }}
                            children={
                                <>
                                    {loading ? (
                                        <AtomCircularProgress />
                                    ) : (
                                        <AtomTableForm
                                            columns={columnsListaDiccionario}
                                            data={data}
                                            actions={namePermission ? actions : []}
                                            pagination={false}
                                            page={page}
                                            limit={limit}
                                            count={totalLista}
                                            setPage={setPage}
                                            setLimit={setLimit}
                                            handleChangePage={handleChangePage}
                                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                                        />
                                    )}
                                </>
                            }
                        />
                    </>
                }
            />
            <AtomDialogForm
                openDialog={openMatriculacion}
                titleCrear="Crear Configuración de Cierre"
                editDialog={edit}
                buttonCancel={true}
                maxWidth="md"
                buttonSubmit={true}
                handleSubmit={handleSubmit}
                handleCloseDialog={handleCloseMatriculacion}
                titleEditar="Editar Configuración de Cierre"
                dialogContentComponent={
                    <Grid container spacing={2} sx={{ width: "90%" }}>
                        <Grid size={6}>
                            <AtomTextField
                                id="name"
                                required={true}
                                headerTitle="Nombre de Categoría"
                                value={matricula.name}
                                onChange={(e) =>
                                    setMatricula({
                                        ...matricula,
                                        name: e.target.value,
                                    })
                                }
                                error={errors.name}
                                helperText={
                                    errors.name ? "El nombre es requerido" : ""
                                }
                            />
                        </Grid>
                        <Grid size={6}>
                            <AtomTextField
                                id="description"
                                required={true}
                                headerTitle="Descripción de la Categoría"
                                value={matricula.description}
                                onChange={(e) =>
                                    setMatricula({
                                        ...matricula,
                                        description: e.target.value,
                                    })
                                }
                                error={errors.description}
                                helperText={
                                    errors.description ? "La descripción es requerida" : ""
                                }
                            />
                        </Grid>
                    </Grid>
                }
            />
            <AtomDialogForm
                openDialog={openColumns}
                titleCrear=""
                buttonCancel={true}
                maxWidth="md"
                handleCloseDialog={handleCloseColumns}
                titleEditar="Editar Configuración de Palabras"
                dialogContentComponent={
                    <ColumnsCategorias id={idCategoria} />
                }
            />
        </>
    );
};

export default ListaCategorias;

/*
    const handleDelete = (row) => {
        showDialog({
            title: "Eliminar registro",
            message: "¿Estás seguro de que deseas eliminar este registro?",
            onConfirm: async () => {
                try {
                    const response = await dispatch(deleteCategorias(row.id));
                    if (response.meta.requestStatus === "fulfilled") {
                        showSnackbar(response.payload.message);
                        buscarLista();
                    } else {
                        showSnackbar(response.payload.message);
                    }
                } catch (error) {
                    showSnackbar(error || "Error al eliminar registro");
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
    */