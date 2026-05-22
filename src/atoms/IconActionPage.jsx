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
  right = 0,
  id = "",
  top = 0,
  disabled = false,
}) => {
  const IconComponent = Icons[iconName];

  if (!IconComponent) {
    console.warn(`El ícono "${iconName}" no existe en @mui/icons-material`);
  }

  return (
    <Box>
      <Tooltip title={disabled ? "Deshabilitado" : title}>
        <span>
          <IconButton onClick={handleButtonClick} disabled={disabled}>
            <IconComponent
              sx={{
                color: disabled ? "#94a3b8" : "white",
                height: 20,
                width: 20,
                backgroundColor: disabled ? "#e2e8f0" : color,
                borderRadius: 10,
                padding: 1,
                cursor: disabled ? "not-allowed" : "pointer",
                "&:hover": {
                  backgroundColor: disabled ? "#e2e8f0" : color,
                  transform: disabled ? "none" : "scale(1.1)",
                },
              }}
            />
          </IconButton>
        </span>
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
