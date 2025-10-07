import { Checkbox, Typography, Box } from "@mui/material";

const AtomCheckBox = (props) => {
  const { label, required, id, checked, onChange } = props;

  return (
    <>
      <Typography
        variant="body1"
        sx={{
          color: "#727176",
          fontWeight: 400,
          fontSize: "14px",
          mb: "-22px",
        }}
      >
        {label}
        {required ? <span style={{ color: "#fb5f3f" }}> *</span> : ""}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          justifyContent: "center",
          padding: "5px",
          mt: "22px",
        }}
      >
        <Typography
          sx={{
            color: "#727176",
            fontWeight: 400,
            fontSize: "14px",
          }}
        >
          {checked ? "Activo" : "Inactivo"}
        </Typography>
        <Checkbox id={id} checked={checked} onChange={onChange} />
      </Box>
    </>
  );
};

export default AtomCheckBox;