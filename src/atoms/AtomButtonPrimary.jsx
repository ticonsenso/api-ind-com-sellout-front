import React from "react";
import { Button } from "@mui/material";

function AtomButtonPrimary({
  label, onClick, mt, icon, nameIcon, disabled,
  height = "48px",
}) {
  return (
    <Button
      fullWidth
      disabled={disabled}
      sx={{
        height: height,
        mt: mt,
        width: "100%",
        fontSize: "14px",
        color: "white",
        fontWeight: 400,
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