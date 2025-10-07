import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import "dayjs/locale/es";

import { Box, Typography } from "@mui/material";

dayjs.locale("es");

const AtomTimeField = ({
  id,
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box>
        <Typography
          variant="body1"
          sx={{
            color: "#727176",
            fontWeight: 400,
            fontSize: "14px",
          }}
        >
          {label}
          {required ? <span style={{ color: "#fb5f3f" }}> *</span> : ""}
        </Typography>
        <TimeField
          id={id}
          ampm={true}
          value={value ? dayjs(value, ["HH:mm", "HH:mm:ss"]) : null}
          onChange={(newValue) => {
            if (newValue && dayjs(newValue).isValid()) {
              onChange(dayjs(newValue).format("HH:mm")); // solo hora y minutos
            } else {
              onChange(null);
            }
          }}
          slotProps={{
            textField: {
              error: error,
              helperText: error ? helperText : "",
              sx: {
                width: "100%",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                fontFamily: "Visby Round CF, Arial, sans-serif, bold",
                fontSize: "14px",
                flexGrow: 1,
                border: "none",
                height: "48px",
                mb: 1.7,
              },
              InputProps: {
                style: {
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  fontFamily: "Visby Round CF, Arial, sans-serif, bold",
                  fontSize: "14px",
                  border: "none",
                  height: "52px",
                },
              },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default AtomTimeField;