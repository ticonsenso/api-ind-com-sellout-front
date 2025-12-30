import React, { createContext, useContext, useState } from "react";
import { Slide, Snackbar, IconButton, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar debe ser usado dentro de SnackbarProvider");
  }
  return context;
};

const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [autoHideDuration, setAutoHideDuration] = useState(5000);
  const [TransitionComponent, setTransitionComponent] = useState(() => Slide);
  const [position, setPosition] = useState({
    vertical: "top",
    horizontal: "right",
  });

  const showSnackbar = (newMessage, options = {}) => {
    setMessage(newMessage);
    setSeverity(options.severity || "success");
    setAutoHideDuration(options.duration || 5000);
    setPosition(options.position || { vertical: "top", horizontal: "right" });
    setTransitionComponent(() => options.TransitionComponent || Slide);
    setOpen(true);
  };

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={autoHideDuration}
        slots={{ transition: TransitionComponent }}
        anchorOrigin={position}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

SnackbarProvider.propTypes = {
  children: PropTypes.node,
};

export { SnackbarProvider };
