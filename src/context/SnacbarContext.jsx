import React, { createContext, useContext, useState } from "react";
import { Slide, Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

const SnackbarContext = createContext();

// Hook para usar el contexto del Snackbar
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar debe ser usado dentro de SnackbarProvider");
  }
  return context;
};

// Provider del Snackbar
const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [autoHideDuration, setAutoHideDuration] = useState(5000); // Duración por defecto
  const [TransitionComponent, setTransitionComponent] = useState(() => Slide);
  const [position, setPosition] = useState({
    vertical: "bottom",
    horizontal: "center",
  });

  // Función para mostrar el Snackbar
  const showSnackbar = (newMessage, options = {}) => {
    setMessage(newMessage);
    setAutoHideDuration(options.duration || 5000); // Tiempo por defecto de 3 segundos
    setPosition(options.position || { vertical: "top", horizontal: "right" });
    setTransitionComponent(() => options.TransitionComponent || Slide);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        onClose={handleClose}
        message={message}
        autoHideDuration={autoHideDuration}
        slots={{ transition: TransitionComponent }}
        anchorOrigin={position}
        key={TransitionComponent?.name}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </SnackbarContext.Provider>
  );
};

SnackbarProvider.propTypes = {
  children: PropTypes.node,
};

export { SnackbarProvider };
