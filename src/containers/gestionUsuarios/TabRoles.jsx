import {
  Box,
  Button,
  Divider,
  Autocomplete,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
import AtomTableForm from "../../atoms/AtomTableForm";
import AtomCard from "../../atoms/AtomCard";
import { useDispatch, useSelector } from "react-redux";
import { obtenerRoles } from "../../redux/userSlice";
import { useEffect, useState } from "react";
import AtomTextField from "../../atoms/AtomTextField";
import AtomDialogForm from "../../atoms/AtomDialogForm";
import Grid from "@mui/material/Grid";
import {
  createRole,
  updateRoleObject,
  updateRole,
  deleteRole,
  asignarPermisoRol,
  obtenerPermissions,
  updateAsignarPermiso,
} from "../../redux/userSlice";
import { useSnackbar } from "../../context/SnacbarContext";
import { useDialog } from "../../context/DialogDeleteContext";
import AddIcon from "@mui/icons-material/Add";
import AtomCheckBox from "../../atoms/AtomCheckBox";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { usePermission } from "../../context/PermisosComtext";
import { columnsRoles, columnsPermisos } from "./constantes";

const TabRoles = () => {
  const { showDialog } = useDialog();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const hasPermission = usePermission();
  const namePermission = hasPermission("ACCIONES ROLES");
  const roles = useSelector((state) => state?.users?.roles || []);
  const role = useSelector((state) => state?.users?.role || {});
  const asignarPermiso = useSelector(
    (state) => state?.users?.asignarPermiso || []
  );

  const optionsPermisos = useSelector(
    (state) => state?.users?.optionsPermisos || []
  );
  const [openPermisos, setOpenPermisos] = useState(false);
  const [rolId, setRolId] = useState(null);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  const [openRole, setOpenRole] = useState(false);

  const actions = [
    {
      label: "Permisos",
      color: "success",
      onClick: (row) => handleOpenPermisos(row),
    },
    {
      label: "Editar",
      color: "info",
      onClick: (row) => handleEditRole(row),
    },
    {
      label: "Eliminar",
      color: "error",
      onClick: (row) => handleDeleteRole(row),
    },
  ];

  const handleEditRole = (row) => {
    dispatch(updateRoleObject({ key: "name", value: row.name }));
    dispatch(updateRoleObject({ key: "id", value: row.id }));
    dispatch(updateRoleObject({ key: "status", value: row.status }));
    handleOpenRole();
  };

  const handleDeleteRole = (row) => {
    showDialog({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar el permiso registrado?",
      onConfirm: async () => {
        const response = await dispatch(deleteRole(row.id));
        if (!response.error) {
          showSnackbar("Registro eliminado exitosamente");
          buscarRoles();
        } else {
          showSnackbar(response.payload.message);
        }
      },
    });
  };

  const onChange = (id, value) => {
    dispatch(updateRoleObject({ key: id, value: value }));
  };

  const handleOpenRole = () => {
    setOpenRole(true);
  };

  const handleCloseRole = () => {
    setOpenRole(false);
    dispatch(updateRoleObject({}));
  };

  const buscarRoles = () => {
    dispatch(obtenerRoles());
  };

  useEffect(() => {
    buscarRoles();
  }, []);

  const guardarRol = async () => {
    const response = await dispatch(createRole(role));
    if (!response.error) {
      showSnackbar("Rol creado correctamente");
      handleCloseRole();
      buscarRoles();
    } else {
      showSnackbar(response.payload.error);
    }
  };

  const handleSubmit = async () => {
    if (role.name === "") {
      showSnackbar("El nombre es requerido");
      return;
    }
    if (role.id) {
      editarRol();
    } else {
      guardarRol();
    }
  };

  const editarRol = async () => {
    const response = await dispatch(updateRole(role));
    if (!response.error) {
      showSnackbar("Rol actualizado correctamente");
      handleCloseRole();
      buscarRoles();
    } else {
      showSnackbar(response.payload.error);
    }
  };

  const guardarPermisos = async () => {
    if (!permisosSeleccionados.length > 0) {
      showSnackbar("No hay permisos seleccionados");
      return;
    }
    const permisosFinales = permisosFinalesVisuales.map((p) => p.id);

    const data = {
      rolId: rolId,
      permissions: permisosFinales,
    };

    const response = await dispatch(asignarPermisoRol(data));

    if (response.error) {
      showSnackbar("Error al asignar permisos");
    } else {
      showSnackbar("Permisos asignados correctamente");
      handleClosePermisos();
    }
  };

  const buscarPermisos = async () => {
    dispatch(obtenerPermissions());
  };

  useEffect(() => {
    buscarPermisos();
  }, []);

  const buscarPermisosRol = async () => {
    dispatch(obtenerPermissions());
  };

  useEffect(() => {
    buscarPermisosRol();
  }, []);

  const handleOpenPermisos = (row) => {
    setRolId(row.id);
    const permisos = row?.permissions || [];
    dispatch(updateAsignarPermiso(permisos));
    setPermisosSeleccionados([]);
    setOpenPermisos(true);
  };

  const handleClosePermisos = () => {
    setOpenPermisos(false);
    dispatch(updateAsignarPermiso([]));
    buscarRoles();
  };

  const onChangePermiso = (permiso) => {
    const yaAsignado = asignarPermiso.some((p) => p.id === permiso.id);
    const yaSeleccionado = permisosSeleccionados.some(
      (p) => p.id === permiso.id
    );

    let actualizados = [...permisosSeleccionados];
    if (yaAsignado) {
      if (!yaSeleccionado) {
        actualizados.push(permiso);
      } else {
        actualizados = actualizados.filter((p) => p.id !== permiso.id);
      }
    } else {
      if (!yaSeleccionado) {
        actualizados.push(permiso);
      } else {
        actualizados = actualizados.filter((p) => p.id !== permiso.id);
      }
    }

    setPermisosSeleccionados(actualizados);
  };

  const permisosFinalesVisuales = [
    ...asignarPermiso.filter(
      (p) => !permisosSeleccionados.some((c) => c.id === p.id)
    ),
    ...permisosSeleccionados.filter(
      (c) => !asignarPermiso.some((p) => p.id === c.id)
    ),
  ];

  return (
    <AtomContainerGeneral
      children={
        <>
          <AtomCard
            // title="Lista de roles"
            border={true}
            nameButton={namePermission ? "Crear" : ""}
            onClick={handleOpenRole}
            children={
              <Box
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
              >
                <AtomTableForm
                  columns={columnsRoles}
                  data={roles}
                  actions={namePermission ? actions : []}
                />
              </Box>
            }
          />
          <AtomDialogForm
            maxWidth="sm"
            openDialog={openRole}
            buttonCancel={true}
            buttonSubmit={true}
            handleCloseDialog={handleCloseRole}
            handleSubmit={handleSubmit}
            titleCrear="Crear rol"
            textButtonCancel="Cerrar"
            dialogContentComponent={
              <Grid width="80%" container spacing={2}>
                <Grid size={12}>
                  <AtomTextField
                    id="name"
                    required={true}
                    headerTitle="Nombre"
                    name="name"
                    value={role.name}
                    onChange={(e) => onChange(e.target.id, e.target.value)}
                  />
                </Grid>
                <Grid size={12}>
                  <AtomCheckBox
                    id="status"
                    label="Estado"
                    checked={role.status}
                    name="status"
                    onChange={(e) => onChange(e.target.id, e.target.checked)}
                  />
                </Grid>
              </Grid>
            }
          />
          <AtomDialogForm
            maxWidth="md"
            openDialog={openPermisos}
            buttonCancel={true}
            handleCloseDialog={() => setOpenPermisos(false)}
            titleCrear="Asignar permisos"
            buttonSubmit={true}
            handleSubmit={guardarPermisos}
            textButtonCancel="Cerrar"
            dialogContentComponent={
              <Grid
                container
                spacing={2}
                justifyContent="center"
                height="100%"
                sx={{ width: "100%" }}
              >
                <Grid size={10} sx={{ mt: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "primary.main",
                      mt: 1,
                      ml: 1,
                      mb: 1,
                      textAlign: "left",
                      width: "80%",
                    }}
                  >
                    Permisos disponibles
                  </Typography>
                  <Autocomplete
                    multiple
                    fullWidth
                    id="roles"
                    value={permisosSeleccionados}
                    options={optionsPermisos}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.label}
                    onChange={() => { }}
                    renderOption={(props, option) => {
                      const estaAsignado = asignarPermiso.some(
                        (p) => p.id === option.id
                      );
                      const estaSeleccionado = permisosSeleccionados.some(
                        (p) => p.id === option.id
                      );

                      const checked =
                        (estaAsignado && !estaSeleccionado) ||
                        (!estaAsignado && estaSeleccionado);

                      return (
                        <li
                          {...props}
                          key={option.id}
                          onClick={(e) => {
                            e.preventDefault();
                            onChangePermiso(option);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Checkbox
                            style={{ marginRight: 8 }}
                            checked={checked}
                          />
                          {option.label}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="Seleccionar permisos"
                        placeholder="Seleccionar permisos"
                      />
                    )}
                  />
                </Grid>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "primary.main",
                    mt: 1,
                    mb: -1,
                    textAlign: "left",
                    width: "80%",
                  }}
                >
                  Permisos asignados
                </Typography>
                <Grid size={10}>
                  <AtomTableForm
                    actions={[]}
                    columns={columnsPermisos}
                    data={asignarPermiso}
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

export default TabRoles;
