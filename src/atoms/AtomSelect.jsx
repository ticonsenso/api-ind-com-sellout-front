import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
const AtomSelectInputForm = (props) => {
  const {
    id,
    headerTitle,
    value,
    placeholder = "Seleccionar",
    onChange,
    options = [],
    error = false,
    helperText = "",
    width = "100%",
    height = "51px",
    color = "#f5f5f5",
    required = false,
    multiple = false,
    disabled = false,
  } = props;

  const displayOptions =
    Array.isArray(options) && options?.length > 0
      ? options
      : [{ id: "", label: "No hay opciones disponibles" }];

  return (
    <Box>
      <Typography
        variant="body1"
        sx={{
          color: "#727176",
          fontWeight: 400,
          fontSize: "14px",
          width: "100%",
        }}
      >
        {headerTitle}
        {required ? <span style={{ color: "#fb5f3f" }}> *</span> : ""}
      </Typography>
      <FormControl
        fullWidth
        error={error}
        sx={{
          width: width,
          mb: "10px",
          "& .MuiOutlinedInput-root": {
            backgroundColor: color ? color : "#f5f5f5",
            borderRadius: "8px",
            height: height,
          },
          "& .MuiInputLabel-root": {
            color: "#757575",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "gray",
          },
        }}
      >
        <Select
          labelId={`${id}-label`}
          id={id}
          multiple={multiple}
          disabled={disabled}
          value={value || (multiple ? [] : "")}
          onChange={(e) => {
            if (multiple) {
              onChange({
                target: {
                  id: id,
                  value: e.target.value,
                },
              });
            } else {
              const selectedOption = displayOptions.find(
                (opt) => opt.id === e.target.value
              );
              onChange({
                target: {
                  id: id,
                  value: selectedOption ? selectedOption.id : "",
                },
              });
            }
          }}
          displayEmpty
          renderValue={(selected) => {
            if (
              !selected ||
              (Array.isArray(selected) && selected?.length === 0)
            ) {
              return placeholder;
            }
            if (multiple) {
              const selectedOptions = displayOptions.filter((opt) =>
                selected?.includes(opt.id)
              );
              return selectedOptions
                ?.map((opt) => opt.label || opt.id || opt.value || opt.nombre)
                .join(", ");
            }
            const selectedOption = displayOptions.find(
              (opt) => opt.id === selected
            );
            return selectedOption
              ? selectedOption.label ||
                  selectedOption.nombre ||
                  selectedOption.value ||
                  selectedOption.id
              : "";
          }}
        >
          {Array.isArray(displayOptions) &&
            displayOptions.map((option) => (
              <MenuItem key={option?.id} value={option?.id}>
                {multiple && (
                  <Checkbox
                    checked={value ? value?.indexOf(option?.id) > -1 : false}
                  />
                )}
                <ListItemText
                  primary={
                    option?.label ||
                    option?.nombre ||
                    option?.value ||
                    option?.id ||
                    ""
                  }
                />
              </MenuItem>
            ))}
        </Select>
        {error ? <FormHelperText>{helperText}</FormHelperText> : ""}
      </FormControl>
    </Box>
  );
};

AtomSelectInputForm.propTypes = {
  id: PropTypes.string.isRequired,
  headerTitle: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  ]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string,
      nombre: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  error: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  width: PropTypes.string,
  multiple: PropTypes.bool,
};

export default AtomSelectInputForm;