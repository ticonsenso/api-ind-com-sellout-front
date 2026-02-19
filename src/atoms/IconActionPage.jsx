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
  disabled = false,
}) => {
  const IconComponent = Icons[iconName] || Icons["HelpOutline"];

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
        <span>
          <IconButton
            onClick={disabled ? undefined : handleButtonClick}
            disabled={disabled}
            sx={{
              backgroundColor: disabled ? "grey.400" : "transparent",
              "&:hover": {
                backgroundColor: disabled ? "grey.400" : "transparent",
              }
            }}
          >
            <IconComponent
              sx={{
                color: "white",
                backgroundColor: disabled ? "grey.500" : color,
                borderRadius: 10,
                padding: 0.5,
                transition: "all 0.2s ease-in-out",
                opacity: disabled ? 0.7 : 1,
                "&:hover": {
                  backgroundColor: disabled ? "grey.500" : color,
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