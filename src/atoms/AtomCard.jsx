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
    nameButton = "Crear",
    onClick,
    valueSearch,
    onChange,
    search,
    labelBuscador = "",
    placeholder = "Buscar...",
    color = "#f5f5f5"
  } = props;

  return (
    <Grid
      container
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 5,
        justifyContent: "right",
        backgroundColor: color,
      }}
    >
      <Grid size={4}>
        <Typography
          sx={{
            width: "100%",
            fontSize: "18px",
            display: "flex",
            fontWeight: 600,
            paddingLeft: 2,
            justifyContent: "left",
            textAlign: "left",
            color: "#5e5e5eff",
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
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      backgroundColor: "#ffffffff",
                      borderRadius: "8px",
                      fontSize: "15px",
                      height: "42px",
                    },
                  },
                }}
                sx={{
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
      {children && (
        <Grid
          size={12}
          sx={{
            width: "100%",
            borderRadius: 4,
          }}
        >
          {children}
        </Grid>
      )}
    </Grid>
  );
};

export default AtomCard;