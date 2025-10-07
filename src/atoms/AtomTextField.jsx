import React from "react";
import { InputAdornment, TextField, Typography, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

const AtomTextFielInputForm = (props) => {
  const {
    id,
    icon = false,
    nameIcon: IconComponent,
    endIcon = false,
    nameEndIcon: EndIconComponent,
    onClickEndIcon,
    headerTitle,
    phone = false,
    value = "",
    type = "string",
    placeholder = "Ingrese",
    onChange,
    tooltip = headerTitle,
    error = false,
    required = false,
    helperText = "",
    disabled = false,
    multiline = false,
    acceptsPositiveDecimal = true,
    numberPositive = false,
    onBlur,
    onDragOver,
    onDrop,
  } = props;

  const handleUserChange = (e) => {
    const inputValue = e.target.value;

    if (phone) {
      const re = /^[0-9]*$/;
      if (
        (re.test(inputValue) || inputValue === "") &&
        inputValue.length <= 10
      ) {
        onChange(e);
      }
    } else if (type === "number") {
      let value = inputValue.replace(",", ".");
      const re = /^\d*(\.\d*)?$/;
      if (re.test(value) || value === "") {
        onChange({
          ...e,
          target: {
            ...e.target,
            value: value,
          },
        });
      } else {
        const re = /^\d+$/;
        if (re.test(value) || value === "") {
          onChange({
            ...e,
            target: {
              ...e.target,
              value: value,
            },
          });
        }
      }
    } else {
      onChange(e);
    }
  };

  return (
    <Box>
      <Typography
        variant="body1"
        sx={{
          color: "#727176",
          fontWeight: 400,
          fontSize: "14px",
        }}
      >
        {headerTitle}
        {required ? <span style={{ color: "#fb5f3f" }}> *</span> : ""}
      </Typography>
      <TextField
        id={id}
        variant="outlined"
        value={value || ""}
        type={type}
        fullWidth
        onBlur={onBlur}
        disabled={disabled}
        onChange={handleUserChange}
        placeholder={placeholder}
        error={typeof error === "string" ? true : error}
        helperText={helperText}
        multiline={multiline}
        rows={multiline ? 2 : 1}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            onChange({
              target: {
                name: id,
                value: file,
                files: e.dataTransfer.files,
              },
            });
            e.dataTransfer.clearData();
          }
        }}
        slotProps={{
          input: {
            startAdornment: icon && IconComponent && (
              <InputAdornment position="start">
                <IconComponent />
              </InputAdornment>
            ),
            endAdornment: endIcon && EndIconComponent && (
              <InputAdornment
                position="end"
                sx={{
                  cursor: "pointer",
                  backgroundColor: "details.main",
                  color: "white",
                  borderRadius: "20px",
                  padding: "2px",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "details.main",
                    scale: 1.1,
                    transition: "scale 0.3s ease",
                  },
                }}
              >
                <Tooltip title={tooltip}>
                  <EndIconComponent
                    onClick={onClickEndIcon}
                    sx={{ color: "white", fontSize: "20px", padding: "3px" }}
                  />
                </Tooltip>
              </InputAdornment>
            ),
            style: {
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 400,
            },
          },
        }}
        sx={{
          fontSize: "14px",
          flexGrow: 1,
          mb: 1,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "gray",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#757575",
          },
        }}
      />
    </Box>
  );
};

AtomTextFielInputForm.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.bool,
  nameIcon: PropTypes.elementType,
  headerTitle: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  required: PropTypes.bool,
  helperText: PropTypes.string,
  multiline: PropTypes.bool,
  acceptsPositiveDecimal: PropTypes.bool, // Nueva propiedad para permitir decimales
};

export default AtomTextFielInputForm;