import React from "react";
import { Alert, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const AtomAlert = (props) => {
  const { text, severity = "success" } = props;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "auto",
        mt: 1,
      }}
    >
      <Alert
        sx={{
          borderRadius: "10px",
          border: "2px solid",
          width: "80%",
          borderColor:
            severity === "error"
              ? "error.light"
              : severity === "warning"
              ? "warning.light"
              : severity === "info"
              ? "info.light"
              : "success.light",
        }}
        severity={severity}
      >
        <Typography sx={{ fontSize: "12px" }}>{text}</Typography>
      </Alert>
    </Box>
  );
};

AtomAlert.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  severity: PropTypes.string,
};

export default AtomAlert;