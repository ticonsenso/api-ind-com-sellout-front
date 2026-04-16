import { useEffect, useState } from "react";
import { Typography, Box, keyframes, styled } from "@mui/material";
import AtomButtonPrimary from "../../atoms/AtomButtonPrimary";
import { useDispatch, useSelector } from "react-redux";
import { actionLogoutReducer, setToken } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../service/apiService";
import logoConsenso from "../../assets/logoComplete.svg";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 114, 206, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(0, 114, 206, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 114, 206, 0); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const LoginContainer = styled(Box)({
  width: "100vw",
  height: "100vh",
  background: "linear-gradient(-45deg, #B2B4B4, #5d8ab6, #0072CE, #00509e)",
  backgroundSize: "400% 400%",
  animation: `${gradientShift} 15s ease infinite`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
});

const GlassCard = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(25px)",
  WebkitBackdropFilter: "blur(25px)", // Safari support
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderTop: "1px solid rgba(255, 255, 255, 0.5)",
  borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
  borderRadius: "30px",
  padding: theme.spacing(5),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "400px",
  minHeight: "500px",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
  position: "relative",
  zIndex: 1,
  transition: "all 0.4s ease-in-out",
  overflow: "hidden", // Ensures internal glows stay inside
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
    transition: "0.5s",
  },
  "&:hover": {
    transform: "translateY(-5px) scale(1.02)",
    boxShadow: "0 15px 45px 0 rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    "&:before": {
      left: "100%",
    }
  },
}));

const Orb = styled(Box)(({ size, color, top, left, delay }) => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: "50%",
  background: color,
  filter: "blur(40px)",
  opacity: 0.4,
  top: top,
  left: left,
  animation: `${float} 6s ease-in-out infinite`,
  animationDelay: delay,
  zIndex: 0,
}));

const LogoImage = styled("img")({
  maxWidth: "240px",
  height: "auto",
  marginBottom: "12px",
  filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  userSelect: "none",
  "&:hover": {
    transform: "scale(1.05) translateY(-2px)",
    filter: "drop-shadow(0 12px 24px rgba(0, 114, 206, 0.5)) brightness(1.1)",
  },
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.auth.token);
  const [loading, setLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showSecretButton, setShowSecretButton] = useState(false);

  const handleLogout = () => {
    dispatch(actionLogoutReducer());
  };

  useEffect(() => {
    if (token) {
      handleLogout();
    }
  }, []); // Only logout on mount if a token exists

  const handleVersionClick = () => {
    setClickCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount === 10) {
        setShowSecretButton(true);
      }
      return nextCount;
    });
  };

  const handleSecretLogin = async () => {
    setLoading(true);
    try {
      const response = await apiService
        .setUrl(import.meta.env.VITE_API_URL + "api/auth/token")
        .setMethod("GET")
        .send();

      if (response && response.token) {
        dispatch(setToken(response.token));
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      }
    } catch (error) {
      console.error("Error al obtener el token:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Orb size="300px" color="#0072CE" top="-100px" left="-100px" delay="0s" />
      <Orb size="400px" color="#F39400" top="60%" left="70%" delay="2s" />

      <GlassCard>
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LogoImage src={logoConsenso} alt="Logo Consenso" />
          <Box
            sx={{
              height: '1px',
              width: '100%',
              maxWidth: '280px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
              mt: 3,
              boxShadow: '0 0 10px rgba(234, 236, 238, 0.25)',
            }}
          />
        </Box>

        <Typography
          variant="h4"
          sx={{
            color: "#FFFFFF",
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "800",
            textShadow: "2 2px 4px rgba(0,0,0,0.3)",
            mb: 0
          }}
        >
          Bienvenido
        </Typography>

        <Typography
          onClick={handleVersionClick}
          sx={{
            color: "rgba(255, 255, 255, 0.92)",
            textAlign: "center",
            fontSize: "10px",
            mb: 6,
            letterSpacing: "0.8px"
          }}
        >
          SISTEMA DE GESTIÓN V 2.2.25
        </Typography>

        <AtomButtonPrimary
          label="Iniciar Sesión"
          loading={loading}
          sx={{
            width: "100%",
            height: "48px",
            borderRadius: "30px",
            fontSize: "1rem",
            background: "linear-gradient(135deg, #0072CE 0%, #00509e 100%)",
            boxShadow: "0 4px 15px rgba(0, 114, 206, 0.4)",
            border: "1px solid rgba(255,255,255,0.2)",
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #00509e 0%, #003c7a 100%)",
              boxShadow: "0 6px 20px rgba(0, 114, 206, 0.6)",
              transform: "scale(1.02)"
            }
          }}
          onClick={() => {
            setLoading(true);
            window.location.href =
              import.meta.env.VITE_API_URL + "api/auth/saml/login";
          }}
        />
        {showSecretButton && (
          <AtomButtonPrimary
            label={loading ? "Cargando..." : "Acceso Directo"}
            disabled={loading}
            sx={{
              mt: 2,
              height: "58px",
              fontSize: "16px",
              fontWeight: 600,
              background: loading
                ? "#94a3b8"
                : "linear-gradient(90deg, #f39400 0%, #ffb74d 100%)",
              borderRadius: "16px",
              border: "none",
              color: "white",
              boxShadow: loading ? "none" : "0 12px 24px -6px rgba(243, 148, 0, 0.4)",
              "&:hover": {
                background: loading
                  ? "#94a3b8"
                  : "linear-gradient(90deg, #e68a00 10%, #f39400 100%)",
                boxShadow: loading ? "none" : "0 16px 32px -8px rgba(243, 148, 0, 0.5)",
                transform: loading ? "none" : "translateY(-2px)",
              },
            }}
            onClick={handleSecretLogin}
          />
        )}

        <Typography
          sx={{
            position: 'absolute',
            bottom: 20,
            fontWeight: 300,
            color: "rgba(255, 255, 255, 1)",
            fontSize: "10px",
          }}
        >
          © {new Date().getFullYear()} Sellout. Todos los derechos reservados.
        </Typography>
      </GlassCard>
    </LoginContainer>
  );
}

export default Login;
