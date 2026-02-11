import React, { useRef, useEffect } from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
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
    color = "#F2F4F8",
    fullScreen = false,
    handleFullScreen,
    extra
  } = props;

  const elementRef = useRef(null);

  const handleToggleFullscreen = () => {
    if (elementRef.current) {
      if (!document.fullscreenElement) {
        elementRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    }
    if (handleFullScreen) handleFullScreen();
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      const isApiFullscreen = !!document.fullscreenElement;
      if (!isApiFullscreen && fullScreen && handleFullScreen) {
        handleFullScreen();
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [fullScreen, handleFullScreen]);

  const cardContent = (
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
      {!fullScreen && (
        <>
          <Grid size={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, paddingLeft: 2 }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 600,
                  textAlign: "left",
                  color: "#5e5e5eff",
                }}
              >
                {title}
              </Typography>
              {handleFullScreen && (
                <Tooltip title="Pantalla completa">
                  <IconButton onClick={handleToggleFullscreen} size="small">
                    <FullscreenIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
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
        </>
      )}
      {extra && (
        <Grid
          size={12}
          sx={{
            width: "100%",

          }}
        >
          {extra}
        </Grid>
      )}
      {children && (
        <Grid
          ref={elementRef}
          size={12}
          sx={{
            width: "100%",
            borderRadius: 4,
            ...(fullScreen && {
              height: "100vh",
              width: "100vw",
              overflow: "auto",
              padding: 2,
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
            }),
          }}
        >
          {fullScreen && (
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <Tooltip title="Salir de pantalla completa">
                <IconButton onClick={handleToggleFullscreen} color="primary">
                  <FullscreenExitIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          {children}
        </Grid>
      )}
    </Grid>
  );

  return cardContent;
};

export default AtomCard;