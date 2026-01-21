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
      }}
    >
      {encabezado && (
        <Grid>
          {encabezado}
        </Grid>
      )}

      <Grid>
        <Box
          sx={{
            backgroundColor: color,
            padding: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AtomContainerGeneral;