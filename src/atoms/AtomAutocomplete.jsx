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
  color = "#f5f5f5",
  height = "52px",
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
              fontSize: "13px",
              "& .MuiOutlinedInput-root": {
                paddingTop: 0,
                paddingBottom: 0,
                height: height,
                borderRadius: "8px",
                backgroundColor: color,
                "& fieldset": {
                  borderColor: error ? "#f44336" : "transparent",
                  borderRadius: "8px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: error ? "#f44336" : "blue",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#757575",
              },
              "& .MuiInputBase-input": {
                padding: "0px 14px",
                height: "100%",
                boxSizing: "border-box",
              },
            }}
          />
        )}
        sx={{
          mt: 0.5,
          borderRadius: "8px",
          height: height,
        }}
      />
    </>
  );
};

export default AtomAutocompleteLabel;