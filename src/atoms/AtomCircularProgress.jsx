import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const AtomCircularProgress = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "transparent",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flexDirection: "column",
          height: "100%",
          padding: 2,
          gap: 3,
          borderRadius: 6,
          border: "10px solid rgb(248, 248, 248)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CircularProgress />
        <Typography>Estamos trabajando...</Typography>
      </Box>
    </Box>
  );
};

export default AtomCircularProgress;