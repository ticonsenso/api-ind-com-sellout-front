import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import AtomTableForm from "../../atoms/AtomTableForm";
import AtomCard from "../../atoms/AtomCard";
import { useState, useEffect } from "react";
import CreateUser from "./crearUser";
import AtomDialogForm from "../../atoms/AtomDialogForm";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserObject,
  createUser,
  clearUserObject,
  obtenerUsuarios,
  updateEditUser,
  updateUser,
} from "../../redux/userSlice";
import { useSnackbar } from "../../context/SnacbarContext";
import { Autocomplete, Checkbox, TextField, Button, FormGroup, FormControlLabel, Card, CardActionArea, IconButton, Tooltip, Typography, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  asignarRolUsuario,
  updateAsignarRol,
  obtenerRoles,
} from "../../redux/userSlice";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { usePermission } from "../../context/PermisosComtext";
import { columnsUsuarios } from "./constantes";
import AtomTextFieldInputForm from "../../atoms/AtomTextField";
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Search as SearchIcon,
  SelectAll as SelectAllIcon,
  Deselect as DeselectIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

const ListUsers = () => {
  const { showSnackbar } = useSnackbar();
  const hasPermission = usePermission();
  const namePermission = hasPermission("ACCIONES USUARIO");
  const dispatch = useDispatch();
  const dataUsers = useSelector((state) => state.users.users);
  const users = dataUsers.map((user) => ({
    ...user,
    company: user?.company?.name || "Sin empresa",
    companyId: user?.company?.id || null,
  }));
  const userObject = useSelector((state) => state.users.user);
  const asignarRol = useSelector((state) => state.users.asignarRol);
  const optionsRoles = useSelector((state) => state.users.optionsRoles);
  const loading = useSelector((state) => state.users.loading);

  const paramsValidate = ["dni", "name", "email", "phone"];
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
  const [openUser, setOpenUser] = useState(false);
  const [errors, setErrors] = useState({});
  const [openRoles, setOpenRoles] = useState(false);
  const [userId, setUserId] = useState(null);
  const [editUser, setEditUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = optionsRoles.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    setRolesSeleccionados(optionsRoles.map((r) => r.id));
  };

  const handleDeselectAll = () => {
    setRolesSeleccionados([]);
  };

  const validForm = () => {
    const newErrors = {};
    let isValid = true;
    paramsValidate.forEach((field) => {
      if (!userObject[field]) {
        newErrors[field] = true;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleOpenUser = () => {
    setOpenUser(true);
  };

  const handleCloseUser = () => {
    setOpenUser(false);
    dispatch(clearUserObject());
    setEditUser(false);
  };

  const onChange = (id, value) => {
    setErrors((prevErrors) => ({ ...prevErrors, [id]: false }));
    dispatch(updateUserObject({ key: id, value: value }));
  };

  const actions = [
    {
      label: "Roles",
      color: "success",
      onClick: (row) => handleOpenRoles(row),
    },
    {
      label: "Editar",
      color: "info",
      onClick: (row) => handleEditUser(row),
    },
  ];


  const handleOpenRoles = (row) => {
    setUserId(row.id);
    const roles = row.roles.map((rol) => ({ id: rol.id, label: rol.name }));
    dispatch(updateAsignarRol(roles));
    setRolesSeleccionados(row.roles.map((rol) => rol.id));
    setOpenRoles(true);
  };

  const handleToggleRole = (role) => {
    const isSelected = rolesSeleccionados.includes(role.id);
    let newSelectedIds;
    let newSelectedObjects;

    if (isSelected) {
      newSelectedIds = rolesSeleccionados.filter((id) => id !== role.id);
      newSelectedObjects = asignarRol.filter((r) => r.id !== role.id);
    } else {
      newSelectedIds = [...rolesSeleccionados, role.id];
      newSelectedObjects = [...asignarRol, role];
    }

    setRolesSeleccionados(newSelectedIds);
    dispatch(updateAsignarRol(newSelectedObjects));
  };

  const handleCloseRoles = () => {
    setOpenRoles(false);
  };

  const handleEditUser = (row) => {
    setEditUser(true);
    setUserId(row.id);
    dispatch(updateEditUser(row));
    setOpenUser(true);
  };

  const handleSubmit = async () => {
    if (!validForm()) {
      showSnackbar("Complete los campos requeridos", { severity: "error" });
    } else {
      if (userObject.id) {
        editarUsuario();
      } else {
        guardarUsuario();
      }
    }
  };

  const editarUsuario = async () => {
    const response = await dispatch(updateUser(userObject));
    if (!response.error) {
      showSnackbar("Usuario editado correctamente", { severity: "success" });
      handleCloseUser();
      buscarUsuarios();
    } else {
      showSnackbar(response.payload.message, { severity: "error" });
    }
  };

  const guardarUsuario = async () => {
    const response = await dispatch(createUser(userObject));
    if (!response.error) {
      showSnackbar("Usuario creado correctamente", { severity: "success" });
      handleCloseUser();
      buscarUsuarios();
    } else {
      showSnackbar(response.payload.message, { severity: "error" });
    }
  };

  const buscarUsuarios = async () => {
    dispatch(obtenerUsuarios());
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const guardarRoles = async () => {
    const data = {
      userId: userId,
      roleIds: rolesSeleccionados,
    };
    const response = await dispatch(asignarRolUsuario(data));
    if (!response.error) {
      showSnackbar("Roles asignados correctamente", { severity: "success" });
      handleCloseRoles();
      buscarUsuarios();
    } else {
      showSnackbar(response.payload.message, { severity: "error" });
    }
  };

  const buscarRoles = async () => {
    dispatch(obtenerRoles());
  };

  useEffect(() => {
    buscarRoles();
  }, []);

  return (
    <AtomContainerGeneral
      children={
        <>
          <AtomCard
            // title="Lista de usuarios"s
            onClick={handleOpenUser}
            nameButton={""}
            border={true}
            children={
              <AtomTableForm
                columns={columnsUsuarios}
                data={users}
                actions={namePermission ? actions : []}
                loading={loading}
              />
            }
          />
          <AtomDialogForm
            maxWidth="md"
            openDialog={openUser}
            buttonCancel={true}
            buttonSubmit={true}
            handleCloseDialog={handleCloseUser}
            handleSubmit={handleSubmit}
            titleCrear={editUser ? "Editar usuario" : "Crear usuario"}
            dialogContentComponent={
              <Box>
                <CreateUser
                  userObject={userObject}
                  onChange={onChange}
                  errors={errors}
                  editUser={editUser}
                />
              </Box>
            }
          />
          <AtomDialogForm
            maxWidth="lg"
            openDialog={openRoles}
            buttonCancel={true}
            buttonSubmit={true}
            handleSubmit={guardarRoles}
            handleCloseDialog={handleCloseRoles}
            titleCrear="Asignar roles"
            dialogContentComponent={
              <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
                  <Box sx={{ width: "40%" }}>
                    <AtomTextFieldInputForm
                      id="search-roles"
                      color="#eeeeeeff"
                      height="45px"
                      placeholder="Buscar roles..."
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

                <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1, maxHeight: "60vh" }}>
                  <Grid container spacing={2}>
                    {filteredRoles.map((option) => {
                      const isSelected = rolesSeleccionados.includes(option.id);
                      return (
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={option.id}>
                          <Card
                            elevation={0}
                            sx={{
                              height: "90px", // Fixed height
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
                              onClick={() => handleToggleRole(option)}
                              sx={{ height: "100%", p: 2, display: "flex", justifyContent: "center" }} // Center content
                            >
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, width: "100%" }}>
                                <Typography
                                  variant="body1"
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
                    {filteredRoles.length === 0 && (
                      <Grid size={12}>
                        <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
                          <Typography>No se encontraron roles</Typography>
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

export default ListUsers;
