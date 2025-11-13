import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";

const AtomContainerGeneral = ({
  children,
  color = "#f5f5f5",
  encabezado }) => {
  return (
    <Grid
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}
    >
      {encabezado}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          overflow: "auto",
          backgroundColor: color,
        }}
      >
        {children}
      </Box>
    </Grid>
  );
};

export default AtomContainerGeneral;