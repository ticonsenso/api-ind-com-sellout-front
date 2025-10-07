import { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import AtomButtonPrimary from "../../atoms/AtomButtonPrimary";
import Grid from "@mui/material/Grid";
import logoConsenso from "../../assets/logoComplete.svg";
import fondoLogin from "../../assets/fondoLogin.svg";
import { useDispatch } from "react-redux";
import { actionLogoutReducer } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Login() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.auth.token);

  const handleLogout = () => {
    dispatch(actionLogoutReducer());
  };

  useEffect(() => {
    if (token) {
      handleLogout();
    }
  }, [token]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${fondoLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={logoConsenso}
          alt="Logo Consenso"
          style={{
            maxWidth: "200px",
            height: "auto",
          }}
        />
      </Box>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          borderRadius: 2,
          backgroundColor: "white",
          boxShadow: 3,
          width: "350px",
        }}
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                textAlign: "center",
                fontSize: "23px",
                fontWeight: "500",
                fontFamily: "Poppins",
              }}
            >
              Bienvenido
            </Typography>
            <Typography
              sx={{
                color: "white",
                textAlign: "center",
                fontSize: 9,
              }}
            >
              Version 2.1.0
            </Typography>
          </Grid>

          <Grid size={12} mt={2}>
            <AtomButtonPrimary
              label="Iniciar sesión"
              sx={{
                width: "100%",
              }}
              onClick={() => {
                window.location.href =
                  import.meta.env.VITE_API_URL + "api/auth/saml/login";
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;
