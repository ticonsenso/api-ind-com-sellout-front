import {
  Box,
  Button,
  Divider,
  Autocomplete,
  Checkbox,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Search as SearchIcon,
  SelectAll as SelectAllIcon,
  Deselect as DeselectIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
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
import AtomTextFieldInputForm from "../../atoms/AtomTextField";

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
  const loading = useSelector((state) => state.users.loading);

  const optionsPermisos = useSelector(
    (state) => state?.users?.optionsPermisos || []
  );
  const [openPermisos, setOpenPermisos] = useState(false);
  const [rolId, setRolId] = useState(null);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  const [openRole, setOpenRole] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPermisos = optionsPermisos.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    setPermisosSeleccionados([...optionsPermisos]);
  };

  const handleDeselectAll = () => {
    setPermisosSeleccionados([]);
  };

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
          showSnackbar("Registro eliminado exitosamente", { severity: "success" });
          buscarRoles();
        } else {
          showSnackbar(response.payload.message, { severity: "error" });
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
      showSnackbar("Rol creado correctamente", { severity: "success" });
      handleCloseRole();
      buscarRoles();
    } else {
      showSnackbar(response.payload.error, { severity: "error" });
    }
  };

  const handleSubmit = async () => {
    if (role.name === "") {
      showSnackbar("El nombre es requerido", { severity: "error" });
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
      showSnackbar("Rol actualizado correctamente", { severity: "success" });
      handleCloseRole();
      buscarRoles();
    } else {
      showSnackbar(response.payload.error, { severity: "error" });
    }
  };

  const guardarPermisos = async () => {
    /* if (!permisosSeleccionados.length > 0) {
      showSnackbar("No hay permisos seleccionados", { severity: "error" });
      return;
    } */
    const permisosFinales = permisosSeleccionados.map((p) => p.id);

    const data = {
      rolId: rolId,
      permissions: permisosFinales,
    };

    const response = await dispatch(asignarPermisoRol(data));

    if (response.error) {
      showSnackbar("Error al asignar permisos", { severity: "error" });
    } else {
      showSnackbar("Permisos asignados correctamente", { severity: "success" });
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
    setPermisosSeleccionados(permisos);
    setOpenPermisos(true);
  };

  const handleTogglePermission = (permission) => {
    const isSelected = permisosSeleccionados.some((p) => p.id === permission.id);
    let newSelected;

    if (isSelected) {
      newSelected = permisosSeleccionados.filter((p) => p.id !== permission.id);
    } else {
      newSelected = [...permisosSeleccionados, permission];
    }
    setPermisosSeleccionados(newSelected);
  };

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
                  loading={loading}
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
            maxWidth="lg"
            openDialog={openPermisos}
            buttonCancel={true}
            handleCloseDialog={() => setOpenPermisos(false)}
            titleCrear="Asignar permisos"
            buttonSubmit={true}
            handleSubmit={guardarPermisos}
            textButtonCancel="Cerrar"
            dialogContentComponent={
              <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
                  <Box sx={{ width: "40%" }}>
                    <AtomTextFieldInputForm
                      id="search"
                      color="#eeeeeeff"
                      height="45px"
                      placeholder="Buscar permisos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Box>
                  <Tooltip title="Seleccionar todos">
                    <IconButton onClick={handleSelectAll} color="primary" sx={{ bgcolor: alpha("#0072CE", 0.1), height: "45px", width: "45px" }}>
                      <SelectAllIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Deseleccionar todos">
                    <IconButton onClick={handleDeselectAll} color="error" sx={{ bgcolor: alpha("#d32f2f", 0.1), height: "45px", width: "45px" }}>
                      <DeselectIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    {filteredPermisos.map((option) => {
                      const isSelected = permisosSeleccionados.some((p) => p.id === option.id);
                      return (
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={option.id}>
                          <Card
                            elevation={0}
                            sx={{
                              height: "90px",
                              borderRadius: "16px",
                              border: isSelected ? "2px solid" : "1px solid",
                              borderColor: isSelected ? "primary.main" : "divider",
                              backgroundColor: isSelected ? alpha("#0072CE", 0.08) : "#ffffff",
                              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              boxShadow: isSelected
                                ? "0px 4px 20px rgba(0, 114, 206, 0.15)"
                                : "0px 2px 8px rgba(0,0,0,0.05)",
                              "&:hover": {
                                borderColor: "primary.main",
                                transform: "translateY(-4px)",
                                boxShadow: "0px 12px 24px rgba(0,0,0,0.1)",
                              }
                            }}
                          >
                            <CardActionArea
                              onClick={() => handleTogglePermission(option)}
                              sx={{ height: "100%", p: 2, display: "flex", justifyContent: "center" }} // Center content
                            >
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, width: "100%" }}>
                                <Typography
                                  variant="body1" // Slightly larger text
                                  fontWeight={isSelected ? 600 : 500}
                                  color={isSelected ? "primary.main" : "text.secondary"}
                                  sx={{ transition: "color 0.3s ease" }}
                                >
                                  {option.label}
                                </Typography>
                                {isSelected ? (
                                  <CheckCircleIcon color="primary" sx={{ fontSize: 28, filter: "drop-shadow(0px 2px 4px rgba(0, 114, 206, 0.3))" }} />
                                ) : (
                                  <RadioButtonUncheckedIcon sx={{ color: "action.disabled", fontSize: 28 }} />
                                )}
                              </Box>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      );
                    })}
                    {filteredPermisos.length === 0 && (
                      <Grid size={12}>
                        <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
                          <Typography>No se encontraron permisos</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Box>
            }
          />
        </>
      }
    />
  );
};

export default TabRoles;
