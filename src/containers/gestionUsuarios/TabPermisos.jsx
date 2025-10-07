import { Container, Box, Typography, Checkbox } from "@mui/material";
import AtomTitleComponent from "../../atoms/AtomTitleComponent";
import AtomTableForm from "../../atoms/AtomTableForm";
import AtomCard from "../../atoms/AtomCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AtomDialogForm from "../../atoms/AtomDialogForm";
import AtomTextField from "../../atoms/AtomTextField";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "../../context/SnacbarContext";
import {
  createPermission,
  updatePermissionObject,
  obtenerPermissions,
  updatePermission,
  deletePermission,
} from "../../redux/userSlice";
import { useDialog } from "../../context/DialogDeleteContext";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import AtomCheckBox from "../../atoms/AtomCheckBox";
import { columnsPermisos } from "./constantes";
import { usePermission } from "../../context/PermisosComtext";

const TabPermisos = () => {
  const { showDialog } = useDialog();
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const hasPermission = usePermission();
  const namePermission = hasPermission("ACCIONES PERMISOS");
  const permissions = useSelector((state) => state.users.permissions);
  const permiso = useSelector((state) => state.users.permiso);
  const [openPermission, setOpenPermission] = useState(false);

  const [clickCount, setClickCount] = useState(0);

  const handleTitleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  const showCreateButton = clickCount >= 5;

  const onChange = (id, value) => {
    dispatch(updatePermissionObject({ key: id, value: value }));
  };

  const handleOpenPermission = () => {
    setOpenPermission(true);
  };

  const handleClosePermission = () => {
    setOpenPermission(false);
    dispatch(updatePermissionObject({}));
  };

  const handleSubmit = async () => {
    if (permiso.name === "") {
      showSnackbar("El nombre es requerido");
    } else {
      if (permiso.id) {
        editarPermiso();
      } else {
        guardarPermiso();
      }
    }
  };

  const editarPermiso = async () => {
    const response = await dispatch(updatePermission(permiso));
    if (!response.error) {
      showSnackbar("Permiso editado correctamente");
      handleClosePermission();
      buscarPermisos();
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const guardarPermiso = async () => {
    const response = await dispatch(createPermission(permiso));
    if (!response.error) {
      showSnackbar("Permiso creado correctamente");
      handleClosePermission();
      buscarPermisos();
    } else {
      showSnackbar(response.payload.message);
    }
  };

  const buscarPermisos = () => {
    dispatch(obtenerPermissions());
  };

  useEffect(() => {
    buscarPermisos();
  }, []);

  const actions = [
    {
      label: "Editar",
      color: "info",
      onClick: (row) => handleEditPermission(row),
    },
    {
      label: "Eliminar",
      color: "error",
      onClick: (row) => handleDeletePermission(row),
    },
  ];

  const handleEditPermission = (row) => {
    dispatch(updatePermissionObject({ key: "id", value: row.id }));
    dispatch(updatePermissionObject({ key: "name", value: row.name }));
    dispatch(
      updatePermissionObject({ key: "description", value: row.description })
    );
    dispatch(updatePermissionObject({ key: "status", value: row.status }));
    handleOpenPermission();
  };

  const handleDeletePermission = (row) => {
    showDialog({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar el permiso registrado?",
      onConfirm: async () => {
        const response = await dispatch(deletePermission(row.id));
        if (!response.error) {
          showSnackbar("Registro eliminado exitosamente");
          buscarPermisos();
        } else {
          showSnackbar(response.payload.message);
        }
      },
      onCancel: () => {},
    });
  };
  return (
    <AtomContainerGeneral
      children={
        <>
          <AtomCard
            border={true}
            title={
              <div onClick={handleTitleClick} style={{ cursor: "pointer" }}>
                Lista de permisos
              </div>
            }
            nameButton={showCreateButton ? "Crear" : ""}
            onClick={handleOpenPermission}
            children={
              <Box
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
              >
                <AtomTableForm
                  actions={namePermission ? actions : []}
                  columns={columnsPermisos}
                  data={permissions}
                />
              </Box>
            }
          />
          <AtomDialogForm
            maxWidth="sm"
            openDialog={openPermission}
            buttonCancel={true}
            buttonSubmit={true}
            handleCloseDialog={handleClosePermission}
            handleSubmit={handleSubmit}
            titleCrear="Crear permiso"
            dialogContentComponent={
              <Grid container spacing={2} width="80%">
                <Grid size={12}>
                  <AtomTextField
                    id="name"
                    required={true}
                    headerTitle="Nombre"
                    name="name"
                    value={permiso.name}
                    onChange={(e) => onChange(e.target.id, e.target.value)}
                  />
                </Grid>
                <Grid size={8.5}>
                  <AtomTextField
                    id="description"
                    required={true}
                    headerTitle="Descripción"
                    name="description"
                    value={permiso.description}
                    onChange={(e) => onChange(e.target.id, e.target.value)}
                  />
                </Grid>
                <Grid size={3.5}>
                  <AtomCheckBox
                    id="status"
                    label="Estado"
                    checked={permiso.status}
                    name="status"
                    onChange={(e) => onChange(e.target.id, e.target.checked)}
                  />
                </Grid>
                <Grid size={12}>
                  <AtomTextField
                    id="shortDescription"
                    required={true}
                    headerTitle="Detalles"
                    name="shortDescription"
                    value={permiso.shortDescription}
                    onChange={(e) => onChange(e.target.id, e.target.value)}
                    multiline={true}
                    rows={4}
                  />
                </Grid>
              </Grid>
            }
          />
        </>
      }
    />
  );
};

export default TabPermisos;
