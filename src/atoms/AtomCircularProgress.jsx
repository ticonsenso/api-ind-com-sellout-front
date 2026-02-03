import { LinearProgress, Box, Typography, keyframes } from "@mui/material";
import Grid from "@mui/material/Grid";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const AtomCircularProgress = () => {
  return (
    <Grid container alignItems="center" justifyContent="center"
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        mt: 2,
        backgroundColor: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 20px 60px -15px rgba(0, 50, 100, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        borderRadius: 4,
      }}
    >
      <Grid size={12} sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        borderRadius: 4,
        width: "100%",
        maxWidth: "400px",
      }}
      >
        <Typography
          variant="body2"
          sx={{
            marginBottom: 2,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontSize: "0.85rem",
            textAlign: "center",
            color: "rgba(0, 114, 206, 1)",
          }}
        >
          Estamos trabajando...
        </Typography>
      </Grid>

      <Grid size={12}>
        <Box sx={{ width: "100%" }}>
          <LinearProgress
            sx={{
              height: 15,
              borderRadius: 5,
              backgroundColor: "rgba(0, 114, 206, 0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                background: "linear-gradient(90deg, #0072CE 0%, #00c6ff 50%, #0072CE 100%)",
                backgroundSize: "200% 100%",
                animation: `${shimmer} 2s infinite linear`,
              },
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default AtomCircularProgress;