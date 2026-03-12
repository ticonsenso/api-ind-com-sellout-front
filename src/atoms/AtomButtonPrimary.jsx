import { Button, CircularProgress } from "@mui/material";

function AtomButtonPrimary({
  label, onClick, mt, icon, nameIcon, disabled,
  height = "48px",
  loading = false,
}) {
  return (
    <Button
      fullWidth
      disabled={disabled || loading}
      sx={{
        height: height,
        mt: mt,
        width: "100%",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0072CE 0%, #00509e 100%)",
        color: "white",
        textTransform: "none",
        fontWeight: 400,
        fontSize: "0.95rem",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        borderRadius: "30px",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 4px 14px 0 rgba(0, 114, 206, 0.25)",
        "&:hover": {
          background: "linear-gradient(135deg, #00509e 0%, #003c7a 100%)",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px 0 rgba(0, 114, 206, 0.25)",
        },
        "&.Mui-disabled": {
          background: "rgba(0, 0, 0, 0.12)",
          color: "rgba(0, 0, 0, 0.26)",
          boxShadow: "none",
        },
      }}
      onClick={onClick}
      startIcon={!loading && icon}
      endIcon={!loading && nameIcon}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : label}
    </Button>
  );
}

export default AtomButtonPrimary;