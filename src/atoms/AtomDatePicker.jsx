import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const AtomDatePicker = ({
  id,
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  mode = "date",
  color = "#f5f5f5",
  disabled = false,
}) => {
  const isMonthMode = mode === "month";

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <Box>
          <Typography
            variant="body1"
            sx={{
              color: "#727176",
              fontWeight: 400,
              fontSize: "14px",
              mb: "0px",
            }}
          >
            {label}
            {required ? <span style={{ color: "#fb5f3f" }}> *</span> : ""}
          </Typography>
          <DatePicker
            id={id}
            value={value ? dayjs(value) : null}
            views={isMonthMode ? ["year", "month"] : ["year", "month", "day"]}
            disabled={disabled}
            onChange={(newValue) => {
              if (newValue && dayjs(newValue).isValid()) {
                const formattedDate = isMonthMode
                  ? dayjs(newValue).startOf("month").format("YYYY-MM-DD")
                  : dayjs(newValue).format("YYYY-MM-DD");
                onChange(formattedDate);
              } else {
                onChange("");
              }
            }}
            format={isMonthMode ? "MMMM YYYY" : "DD/MM/YYYY"}
            slotProps={{
              textField: {
                error: error,
                helperText: error ? helperText : "",
                fullWidth: true,
                placeholder: isMonthMode
                  ? "Seleccionar mes"
                  : "Seleccionar fecha",
                sx: {
                  backgroundColor: color,
                  border: error ? "1px solid red" : "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  height: "52px",
                  "& .MuiOutlinedInput-root": {
                    height: "52px",
                    borderRadius: "8px",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },
                },
              },
              popper: {
                modifiers: [
                  {
                    name: "preventOverflow",
                    options: {
                      boundary: "viewport",
                    },
                  },
                ],
                sx: {
                  overflow: "auto",
                  maxHeight: "50vh",
                },
              },
            }}
            error={error}
            helperText={helperText}
          />
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default AtomDatePicker;