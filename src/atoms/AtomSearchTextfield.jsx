import React from "react";
import {
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const AtomSearchTextfield = ({
  valueSearch,
  onChange,
  onSearch,
  labelBuscador = "Buscar",
  placeholder = "Buscar...",
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Tooltip title={labelBuscador}>
        <TextField
          variant="outlined"
          value={valueSearch}
          onChange={onChange}
          placeholder={placeholder}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => onSearch(value)}
                    aria-label="buscar"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
              style: {
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                fontSize: "15px",
                height: "52px",
              },
            },
          }}
          sx={{
            fontFamily: "Visby Round CF, Arial, sans-serif,bold",
            fontSize: "14px",
            width: "100%",
            maxWidth: "500px",
            minWidth: "200px",
            height: "40px",
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
      </Tooltip>
    </Box>
  );
};

export default AtomSearchTextfield;