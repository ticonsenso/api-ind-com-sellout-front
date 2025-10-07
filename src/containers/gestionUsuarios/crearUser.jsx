import { Box, Typography, Checkbox } from "@mui/material";
import AtomTextFielInputForm from "../../atoms/AtomTextField";
import Grid from "@mui/material/Grid";

const CreateUser = ({ userObject, onChange, errors, editUser }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        mt: 2,
      }}
    >
      <Grid container spacing={2} sx={{ width: "80%" }}>
        <Grid size={6}>
          <AtomTextFielInputForm
            id="dni"
            required={true}
            headerTitle="Identificación"
            value={userObject.dni}
            disabled={editUser}
            onChange={(e) => onChange(e.target.id, e.target.value)}
            error={errors.dni}
          />
        </Grid>
        <Grid size={6}>
          <AtomTextFielInputForm
            id="name"
            required={true}
            headerTitle="Nombres"
            value={userObject.name}
            disabled={editUser}
            onChange={(e) => onChange(e.target.id, e.target.value)}
            error={errors.name}
          />
        </Grid>
        <Grid size={6}>
          <AtomTextFielInputForm
            id="email"
            required={true}
            headerTitle="Correo electrónico"
            value={userObject.email}
            disabled={editUser}
            onChange={(e) => onChange(e.target.id, e.target.value)}
            error={errors.email}
          />
        </Grid>
        <Grid size={6}>
          <AtomTextFielInputForm
            id="phone"
            required={true}
            headerTitle="Teléfono"
            value={userObject.phone}
            disabled={editUser}
            onChange={(e) => onChange(e.target.id, e.target.value)}
            error={errors.phone}
          />
        </Grid>
        <Grid
          size={6}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          <Typography
            sx={{
              color: "#727176",
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            Estado
          </Typography>
          <Checkbox
            id="status"
            label="Estado"
            checked={userObject.status}
            onChange={(e) => onChange(e.target.id, e.target.checked)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateUser;
