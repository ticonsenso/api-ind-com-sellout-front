import React from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
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
  },
  typography: { fontFamily: "Poppins" },
  locale: esES,
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DialogProvider>
        <SnackbarProvider>
          <Router>
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