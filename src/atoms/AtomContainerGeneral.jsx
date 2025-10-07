import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";

const AtomContainerGeneral = ({ children, encabezado }) => {
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
          backgroundColor: "#f5f5f5",
        }}
      >
        {children}
      </Box>
    </Grid>
  );
};

export default AtomContainerGeneral;