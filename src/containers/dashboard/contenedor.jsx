import { useEffect, useState } from "react";
import ButtonAppBar from "./buttonAppBar.jsx";
import MenuIndex from "./menuPrincipal.jsx";
import FooterGeneral from "./footer.jsx";
import Box from "@mui/material/Box";
import styles from "./styles";
import { useSelector } from "react-redux";
import {
  setToken,
  getRolesUsuarioLogin,
  setRolesUsuario,
} from "../../redux/authSlice.js";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
} from "@mui/material";
import Encabezado from "./encabezado.jsx";
import componentMap from "./componentMap.jsx";
function Index() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.auth.token) || null;
  const rolesUsuario =
    useSelector((state) => state.auth.auth.rolesUsuario) || [];
  const rolSelected = useSelector((state) => state.auth.auth.rolSelected);
  const obtenerToken = async () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("token")) {
      dispatch(setToken(params.get("token")));
      obtenerRolesUsuario(params.get("token"));
      eliminarTokenUrl();
    }
  };

  const obtenerRolesUsuario = async (tokenData) => {
    const tokenFinal = tokenData || token;
    const response = await dispatch(getRolesUsuarioLogin(tokenFinal));
    if (response.payload) {
      if (response.payload.length > 1) {
        setOpen(true);
      } else {
        dispatch(setRolesUsuario(response.payload[0]));
      }
    } else {
      dispatch(setRolesUsuario({}));
    }
  };

  useEffect(() => {
    if (token === null) {
      obtenerToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (rolSelected?.id === undefined) {
      obtenerRolesUsuario();
    }
  }, []);

  const eliminarTokenUrl = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("token");
    const nuevaUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""
      }`;
    window.history.replaceState({}, "", nuevaUrl);
  };

  const [open, setOpen] = useState(false);

  const handleClose = (role) => {
    setOpen(false);
    dispatch(setRolesUsuario(role));
  };

  const menuSelect = useSelector((state) => state.navigator.selectMenu);
  const renderComponent = () => {
    return componentMap[menuSelect.id] || <div>Componente no encontrado</div>;
  };

  return (
    <Box sx={styles.mainContainer}>
      <ButtonAppBar />
      {menuSelect.id !== 0 && (
        <Box sx={styles.encabezado}>
          <Encabezado
            title={menuSelect.name}
            nameButton={menuSelect.nameButton}
            menuSellout={menuSelect.menuSellout}
            nameInfo={menuSelect.nameInfo}
          />
        </Box>
      )}
      <MenuIndex />
      <Box
        sx={{
          ...styles.contentBox,
        }}
      >
        {renderComponent()}
      </Box>

      <Box sx={styles.footer}>
        <FooterGeneral />
      </Box>
      {rolesUsuario && (
        <Dialog open={open}>
          <DialogTitle>Roles registrados en el sistema</DialogTitle>
          <DialogContent>
            {rolesUsuario.length > 0 ? (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                {rolesUsuario?.map((role) => (
                  <Button
                    key={role.id}
                    onClick={() => {
                      handleClose(role);
                    }}
                  >
                    {role.name}
                  </Button>
                ))}
              </Box>
            ) : (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <Typography>No hay roles registrados en el sistema</Typography>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}

export default Index;
