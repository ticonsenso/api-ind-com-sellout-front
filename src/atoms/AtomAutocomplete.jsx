import React from "react";
import { Autocomplete, TextField, Typography } from "@mui/material";

const AtomAutocompleteLabel = ({
  id,
  label,
  required = false,
  value,
  inputValue,
  onInputChange,
  onChange,
  options = [],
  getOptionLabel = (option) => option?.label || "",
  placeholder = "Seleccionar...",
  disabled = false,
  error = false,
  helperText = "",
  name,
  ...rest
}) => {
  return (
    <>
      {label && (
        <Typography
          variant="body1"
          sx={{
            color: "#727176",
            fontWeight: 400,
            fontSize: "14px",
            width: "100%",
            mb: -0.5,
          }}
        >
          {label}
          {required && <span style={{ color: "#fb5f3f" }}> *</span>}
        </Typography>
      )}

      <Autocomplete
        id={id}
        value={value}
        inputValue={inputValue}
        onInputChange={onInputChange}
        onChange={(event, newValue) => {
          onChange(event, newValue);
        }}
        options={options}
        noOptionsText="No hay opciones disponibles"
        getOptionLabel={getOptionLabel}
        filterSelectedOptions
        isOptionEqualToValue={(option, value) =>
          option.id === value?.id || option.id === value || null
        }
        disabled={disabled}
        {...rest}
        renderOption={(props, option) => (
          <li {...props} key={option?.id || null}>
            {getOptionLabel(option || null)}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            variant="outlined"
            fullWidth
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              fontSize: "13px",
              height: "52px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: error ? "#f44336" : "transparent",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#757575",
              },
            }}
          />
        )}
        sx={{
          mt: 0.5,
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: error ? "#f44336" : "transparent",
              borderRadius: "8px",
            },
          },
        }}
      />
    </>
  );
};

export default AtomAutocompleteLabel;