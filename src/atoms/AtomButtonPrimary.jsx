import React from "react";
import { Button } from "@mui/material";

function AtomButtonPrimary({ label, onClick, mt, icon, nameIcon, disabled }) {
  return (
    <Button
      variant="contained"
      fullWidth
      disabled={disabled}
      sx={{
        height: "48px",
        mt: mt,
        width: "100%",
        fontSize: "14px",
        fontWeight: 300,
        overflow: "hidden",
        backgroundColor: "#0072CE",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#0072CE",
          scale: 1.05,
        },
      }}
      onClick={onClick}
      startIcon={icon}
      endIcon={nameIcon}
    >
      {label}
    </Button>
  );
}

export default AtomButtonPrimary;