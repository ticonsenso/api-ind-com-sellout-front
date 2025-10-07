import React, { createContext, useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Grid from "@mui/material/Grid";

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Aceptar",
  });

  const showDialog = ({
    title,
    message,
    cancelButtonText,
    confirmButtonText,
    onConfirm,
    onCancel,
  }) => {
    setDialogState({
      open: true,
      title,
      message,
      cancelButtonText,
      confirmButtonText,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeDialog();
      },
      onCancel: () => {
        if (onCancel) onCancel();
        closeDialog();
      },
    });
  };

  const closeDialog = () => {
    setDialogState((prevState) => ({ ...prevState, open: false }));
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <Dialog open={dialogState.open} onClose={closeDialog}>
        <DialogTitle className="titleDialog" sx={{ textAlign: "center" }}>
          {dialogState.title}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>{dialogState.message}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pt: 2 }}>
          <Grid container justifyContent="space-between" spacing={2}>
            <Grid item xs={6}>
              <Button
                sx={{
                  height: "45px",
                  width: "100%",
                  minWidth: "150px",
                  fontSize: "14px",
                  color: "#5850EC",
                  borderColor: "#5850EC",
                  fontWeight: 300,
                  overflow: "hidden",
                  backgroundColor: "white",
                  textTransform: "none",
                  "&:hover": {
                    scale: 1.01,
                    backgroundColor: "#f9f9f9",
                  },
                }}
                variant="outlined"
                onClick={dialogState.onCancel}
              >
                {dialogState?.cancelButtonText || "Cancelar"}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                sx={{
                  height: "45px",
                  width: "100%",
                  minWidth: "150px",
                  fontSize: "14px",
                  fontWeight: 300,
                  overflow: "hidden",
                  backgroundColor: "#5850EC",
                  textTransform: "none",
                  "&:hover": {
                    scale: 1.01,
                    backgroundColor: "#4a45c6",
                  },
                }}
                variant="contained"
                onClick={dialogState.onConfirm}
              >
                {dialogState?.confirmButtonText || "Aceptar"}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);
