import Typography from "@mui/material/Typography";

const FooterGeneral = () => {
  return (
    <Typography
      sx={{
        pr: 3,
        display: "flex",
        justifyContent: "right",
        alignItems: "center",
        height: "45px",
        fontSize: "12px",
        overflow: "hidden",
        color: "#64748B",
      }}
    >
      © {new Date().getFullYear()} Sellout. Todos los derechos reservados
    </Typography>
  );
};

export default FooterGeneral;
