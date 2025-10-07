import React, { useRef } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import * as Icons from "@mui/icons-material";

const IconoFlotante = ({
  accept = ".xlsx, .xls",
  title = "",
  iconName = "DriveFolderUploadOutlined",
  handleButtonClick,
  handleChangeFile,
  ref,
  color = "details.main",
  right = 28,
  id = "",
  top = 80,
}) => {
  const IconComponent = Icons[iconName];

  if (!IconComponent) {
    console.warn(`El ícono "${iconName}" no existe en @mui/icons-material`);
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: top,
        right: right,
        zIndex: 1000,
      }}
    >
      <Tooltip title={title}>
        <IconButton onClick={handleButtonClick}>
          <IconComponent
            sx={{
              color: "white",
              backgroundColor: color,
              borderRadius: 10,
              padding: 1,
              "&:hover": {
                backgroundColor: color,
                transform: "scale(1.1)",
              },
            }}
          />
        </IconButton>
      </Tooltip>

      <input
        id={id}
        type="file"
        accept={accept}
        ref={ref}
        onChange={handleChangeFile}
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default IconoFlotante;