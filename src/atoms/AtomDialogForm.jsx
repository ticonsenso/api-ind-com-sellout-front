import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import AtomInfoView from './AtomInfoView.jsx';
import Grid from "@mui/material/Grid";
const AtomDialogCreate = (props) => {
  const {
    openDialog,
    handleCloseDialog,
    maxWidth = "sm",
    editDialog,
    fullScreen,
    titleEditar,
    titleCrear,
    info = false,
    closeButton = false,
    textInfo,
    buttonCancel,
    buttonSubmit,
    textButtonSubmit = "Guardar",
    textButtonCancel = "Cerrar",
    dialogContentComponent,
    handleSubmit,
  } = props;
  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={maxWidth}
      open={openDialog}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h7"
            sx={{ color: "textSecondary.main", fontWeight: 600 }}
          >
            {editDialog ? titleEditar : titleCrear}
          </Typography>
          {closeButton && (
            <IconButton
              sx={{
                backgroundColor: "#ffcbcb",
                "&:hover": {
                  backgroundColor: "#ffb3b3",
                },
              }}
              onClick={handleCloseDialog}
            >
              <CloseIcon color="error" />
            </IconButton>
          )}
        </Box>
        {/* {info && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <AtomInfoView
              text={textInfo}
              width={'80%'}
            />
          </Box>
        )} */}
      </DialogTitle>
      <DialogContent
        sx={{
          justifyContent: "center",
          display: "flex",
        }}
      >
        {dialogContentComponent}
      </DialogContent>

      <DialogActions
        sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}
      >
        <Box sx={{ gap: 2, display: "flex", justifyContent: "center" }}>
          {buttonCancel && (
            <Button
              variant="outlined"
              sx={{
                color: "primary.main",
                textTransform: "none",
                borderColor: "primary.main",
                height: "40px",
                minWidth: "150px",
                width: "auto",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  backgroundColor: "#F4F4F4",
                },
              }}
              onClick={handleCloseDialog}
            >
              {textButtonCancel}
            </Button>
          )}
          {buttonSubmit && (
            <Button
              variant="contained"
              color="primary"
              sx={{
                color: "white",
                fontWeight: 300,
                minWidth: "150px",
                height: "40px",
                width: "auto",
                backgroundColor: "primary.main",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
              onClick={handleSubmit}
            >
              {textButtonSubmit}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AtomDialogCreate;