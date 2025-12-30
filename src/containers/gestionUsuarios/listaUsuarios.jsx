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
import { Autocomplete, Checkbox, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  asignarRolUsuario,
  updateAsignarRol,
  obtenerRoles,
} from "../../redux/userSlice";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { usePermission } from "../../context/PermisosComtext";
import { columnsUsuarios } from "./constantes";

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

  const paramsValidate = ["dni", "name", "email", "phone"];
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
  const [openUser, setOpenUser] = useState(false);
  const [errors, setErrors] = useState({});
  const [openRoles, setOpenRoles] = useState(false);
  const [userId, setUserId] = useState(null);
  const [editUser, setEditUser] = useState(false);

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
    setOpenRoles(true);
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

  const onChangeAsignarRol = (id, value) => {
    const selectedIds = value.map((option) => option.id);
    setRolesSeleccionados(selectedIds);
    dispatch(updateAsignarRol(value));
  };


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
            maxWidth="md"
            openDialog={openRoles}
            buttonCancel={true}
            buttonSubmit={true}
            handleSubmit={guardarRoles}
            handleCloseDialog={handleCloseRoles}
            titleCrear="Asignar roles"
            dialogContentComponent={
              <Box sx={{ height: "100%", width: "100%" }}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid size={10} sx={{ mt: 2 }}>
                    <Autocomplete
                      multiple
                      id="roles"
                      value={asignarRol}
                      options={optionsRoles}
                      disableCloseOnSelect
                      onChange={onChangeAsignarRol}
                      getOptionLabel={(option) => option?.label}
                      renderOption={(props, option, { selected }) => {
                        const { key, ...optionProps } = props;

                        return (
                          <li key={key} {...optionProps}>
                            <Checkbox
                              style={{ marginRight: 8 }}
                              checked={asignarRol.some(
                                (rol) => rol.id === option.id
                              )}
                              value={asignarRol}
                            />
                            {option.label}
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Roles asignados"
                          variant="outlined"
                          fullWidth
                          placeholder="Seleccionar roles"
                        />
                      )}
                    />
                  </Grid>
                  {/* <Grid size={3} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      sx={{ height: "53px" }}
                      color="success"
                      startIcon={<AddIcon />}
                      onClick={guardarRoles}
                    >
                      Asignar roles
                    </Button>
                  </Grid> */}
                </Grid>
              </Box>
            }
          />
        </>
      }
    />
  );
};

export default ListUsers;
