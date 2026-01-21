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
  styled,
  alpha
} from "@mui/material";
import Encabezado from "./encabezado.jsx";
import componentMap from "./componentMap.jsx";
import {
  setIdEmpresaIndurama,
} from "../../redux/configSelloutSlice.js";

// --- Styled Components for Glass Dialog ---
const GlassDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(8px)",
    backgroundColor: "rgba(10, 25, 47, 0.7)", // Deep blue tint
  },
  "& .MuiPaper-root": {
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.1)", // Glass
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    minWidth: "320px",
    padding: theme.spacing(2),
  },
}));

const GlassDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: "#ffffff",
  textAlign: "center",
  fontWeight: 700,
  fontSize: "1.2rem",
  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
}));

const GlassRoleButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: "12px 24px",
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.05)",
  color: "#fff",
  textTransform: "none",
  fontSize: "1rem",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
  justifyContent: "flex-start",
  "&:hover": {
    background: "linear-gradient(90deg, rgba(0, 114, 206, 0.2) 0%, rgba(0, 114, 206, 0.05) 100%)",
    border: "1px solid rgba(0, 114, 206, 0.5)",
    transform: "translateX(5px)",
    boxShadow: "0 4px 12px rgba(0, 114, 206, 0.2)",
  },
}));

function Index() {
  const dispatch = useDispatch();

  const optionsEmpresas = useSelector(
    (state) => state.empresa.optionsEmpresas || []
  );
  const idEmpresaIndurama = useSelector(
    (state) => state?.configSellout?.idEmpresaIndurama
  );

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

  useEffect(() => {
    if (optionsEmpresas && idEmpresaIndurama == null) {
      const empresaIndurama = optionsEmpresas.find(empresa => empresa.label === 'INDURAMA');
      if (empresaIndurama) {
        dispatch(setIdEmpresaIndurama(empresaIndurama.id));
      }
    }
  }, [optionsEmpresas, idEmpresaIndurama]);

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
    return componentMap[menuSelect.id] || <Typography sx={{ color: 'white', p: 4 }}>Componente no encontrado</Typography>;
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
      <Box sx={styles.contentBox}>
        {renderComponent()}
      </Box>

      <Box sx={styles.footer}>
        <FooterGeneral />
      </Box>

      {/* Role Selection Glass Dialog */}
      {rolesUsuario && (
        <GlassDialog open={open}>
          <GlassDialogTitle>Seleccione su Perfil</GlassDialogTitle>
          <DialogContent>
            {rolesUsuario.length > 0 ? (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "0.8rem", mt: 1 }}
              >
                {rolesUsuario?.map((role) => (
                  <GlassRoleButton
                    key={role.id}
                    onClick={() => {
                      handleClose(role);
                    }}
                  >
                    {role.name}
                  </GlassRoleButton>
                ))}
              </Box>
            ) : (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <Typography sx={{ color: 'white', opacity: 0.7 }}>No hay roles registrados en el sistema</Typography>
              </Box>
            )}
          </DialogContent>
        </GlassDialog>
      )}
    </Box>
  );
}

export default Index;
