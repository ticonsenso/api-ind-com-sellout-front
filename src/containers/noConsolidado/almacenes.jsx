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
    height = "52px",
    disabled = false,
}) => {
    const isMonthMode = mode === "month";
    const isYearMode = mode === "year";

    const getViews = () => {
        if (isMonthMode) {
            return ["year", "month"];
        }
        if (isYearMode) {
            return ["year"];
        }
        return ["year", "month", "day"];
    };

    const getFormat = () => {
        if (isMonthMode) {
            return "MMMM YYYY";
        }
        if (isYearMode) {
            return "YYYY";
        }
        return "DD/MM/YYYY";
    };

    const getPlaceholder = () => {
        if (isMonthMode) {
            return "Seleccionar mes";
        }
        if (isYearMode) {
            return "Seleccionar año";
        }
        return "Seleccionar fecha";
    };

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
                        views={getViews()}
                        disabled={disabled}
                        onChange={(newValue) => {
                            if (newValue && dayjs(newValue).isValid()) {
                                let formattedDate;
                                if (isYearMode) {
                                    formattedDate = dayjs(newValue).startOf("year").format("YYYY-MM-DD");
                                } else if (isMonthMode) {
                                    formattedDate = dayjs(newValue).startOf("month").format("YYYY-MM-DD");
                                } else {
                                    formattedDate = dayjs(newValue).format("YYYY-MM-DD");
                                }
                                onChange(formattedDate);
                            } else {
                                onChange("");
                            }
                        }}
                        format={getFormat()}
                        slotProps={{
                            textField: {
                                error: error,
                                helperText: error ? helperText : "",
                                fullWidth: true,
                                placeholder: getPlaceholder(),
                                sx: {
                                    "& .MuiOutlinedInput-root": {
                                        height: height,
                                        borderRadius: "8px",
                                        backgroundColor: color,
                                        padding: 0,
                                        "& fieldset": {
                                            borderColor: error ? "#f44336" : "transparent",
                                            borderRadius: "8px",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        padding: "0 14px",
                                        height: "100%",
                                        boxSizing: "border-box",
                                    },
                                    "& .MuiInputAdornment-root": {
                                        marginRight: "8px",
                                    },
                                },
                            },
                        }}
                    />
                </Box>
            </LocalizationProvider>
        </Box>
    );
};

export default AtomDatePicker;