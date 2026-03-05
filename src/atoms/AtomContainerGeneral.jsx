import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";

const AtomContainerGeneral = ({
  children,
  color = "transparent",
  encabezado
}) => {
  return (
    <Grid
      container
      sx={{
        height: "100%",
        justifyContent: "center",
        flex: 1,
        minHeight: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {encabezado && (
        <Grid sx={{ flexShrink: 0 }}>
          {encabezado}
        </Grid>
      )}

      <Grid sx={{ flex: 1, minHeight: 0, width: "100%", mb: 1.5 }}>
        <Box
          sx={{
            mt: -1.2,
            backgroundColor: color,
            padding: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {children}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AtomContainerGeneral;