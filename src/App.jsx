import React, { useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login from "./containers/login/login.jsx";
import Index from "./containers/dashboard/contenedor.jsx";
import CrearUser from "./containers/gestionUsuarios/crearUser.jsx";
import { DialogProvider } from "./context/DialogDeleteContext";
import { SnackbarProvider } from "./context/SnacbarContext";
import { esES } from "@mui/material/locale";

const theme = createTheme({
  palette: {
    primary: { main: "#0072CE" },
    secondary: { main: "#B2B4B4" },
    details: { main: "#F39400" },
    title: { main: "#0072CE" },
    text: { main: "#5850EC" },
    textSecondary: { main: "#6b6b6b" },
  },
  typography: { fontFamily: "Poppins" },
  locale: esES,
});

function AuthHandler() {
  const navigate = useNavigate();
  const wasLoggingOut = localStorage.getItem("loggingOut");

  useEffect(() => {
    if (wasLoggingOut) {
      navigate("/");
      localStorage.removeItem("loggingOut");
    }
  }, [wasLoggingOut]);
  return null;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DialogProvider>
        <SnackbarProvider>
          <Router>
            <AuthHandler />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/crearUsuario" element={<CrearUser />} />
            </Routes>
          </Router>
        </SnackbarProvider>
      </DialogProvider>
    </ThemeProvider>
  );
}

export default App;