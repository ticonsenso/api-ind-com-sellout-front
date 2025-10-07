import React from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid";

const AtomCard = (props) => {
  const {
    title,
    children,
    border = false,
    nameButton = "Crear",
    onClick,
    valueSearch,
    onChange,
    search,
    labelBuscador = "",
    placeholder = "Buscar...",
  } = props;

  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 5,
        padding: 2,
      }}
    >
      <Grid size={4}>
        <Typography
          sx={{
            width: "100%",
            fontSize: "18px",
            display: "flex",
            fontWeight: 600,
            justifyContent: "left",
            textAlign: "left",
            color: "textSecondary.main",
          }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid size={4}>
        {search && (
          <Tooltip title={labelBuscador}>
            <Box sx={{ width: "100%" }}>
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
            </Box>
          </Tooltip>
        )}
      </Grid>
      <Grid
        size={4}
        sx={{
          display: "flex",
          justifyContent: "right",
        }}
      >
        {nameButton && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onClick}
            sx={{
              minWidth: "170px",
              maxWidth: "300px",
              fontWeight: 300,
              height: "40px",
              width: "auto",
              fontSize: "13px",
              backgroundColor: "primary.main",
              textTransform: "none",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "primary.main",
                color: "#FFFFFF",
              },
            }}
          >
            {nameButton}
          </Button>
        )}
      </Grid>
      <Grid
        size={12}
        sx={{
          padding: border ? 1 : 0,
          borderRadius: 4,
          border: border ? "1px solid #E6EDFF" : "none",
        }}
      >
        {children}
      </Grid>
    </Grid>
  );
};

export default AtomCard;