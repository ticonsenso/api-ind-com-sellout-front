import { Box, Typography, styled, Avatar, Paper } from "@mui/material";

import {
  Public as PublicIcon,
  EmojiObjects as EmojiObjectsIcon,
  Settings as SettingsIcon,
  MenuBook as MenuBookIcon,
  Search as SearchIcon,
  AddToQueue as AddToQueueIcon,
} from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import { handleMenu } from "../../redux/navigatorSlice";
import { usePermission } from "../../context/PermisosComtext";

const SelloutIndurama = () => {
  const dispatch = useDispatch();
  const namePermission = usePermission();

  const pasos = [
    {
      id: 2,
      menuSellout: true,
      name: "Matriculación",
      numero: "01",
      titulo: "Matriculación",
      descripcion: "Carga y gestión de archivos a subir.",
      nameInfo: "Lista",
      color: "#e8bb00",
      Icon: AddToQueueIcon,
      permiso: "MATRICULACION SELLOUT",
    },
    {
      id: 3,
      menuSellout: true,
      name: "MAESTROS",
      numero: "02",
      titulo: "MAESTROS",
      nameInfo: "Lista",
      descripcion: "Carga y gestión de productos y almacenes maestros.",
      color: "#6a1b9a",
      Icon: PublicIcon,
      permiso: "MAESTROS SELLOUT",
    },

    {
      id: 5,
      menuSellout: true,
      name: "Configuración de Extracción",
      numero: "04",
      titulo: "CONFIGURACIÓN DE EXTRACCIÓN",
      descripcion:
        "Definición de configuraciones y columnas del archivo de extracción.",
      color: "#0288d1",
      Icon: SettingsIcon,
      nameInfo: "Lista",
      permiso: "EXTRACCION SELLOUT",
    },
    {
      id: 4,
      menuSellout: true,
      name: "SIC",
      numero: "03",
      titulo: "SIC",
      nameInfo: "Lista",
      descripcion: "Carga y gestión de productos y almacenes SIC.",
      color: "#ef6c00",
      Icon: EmojiObjectsIcon,
      permiso: "SIC SELLOUT",
    },
    {
      id: 5,
      menuSellout: true,
      name: "Extracción Sellout",
      numero: "05",
      titulo: "EXTRACCIÓN DE DATOS",
      descripcion:
        "Procesamiento del archivo de extracción para obtener registros.",
      color: "#7cb342",
      Icon: MenuBookIcon,
      permiso: "EXTRACCION SELLOUT",
    },
    {
      id: 6,
      menuSellout: true,
      name: "Plantilla Consolidado",
      numero: "06",
      titulo: "PLANTILLA CONSOLIDADO",
      descripcion:
        "Representación de datos obtenidos en Plantilla Consolidado.",
      nameInfo: "Lista",
      Icon: SearchIcon,
      color: "#f51783",
      permiso: "PLANTILLA CONSOLIDADO SELLOUT",
    },
  ].filter((paso) => namePermission(paso.permiso));

  const PasoContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "auto",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  }));

  const NumeroCirculo = styled(Avatar)(({ bgcolor }) => ({
    backgroundColor: bgcolor,
    width: 70,
    height: 70,
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 7,
  }));

  const PasoCard = styled(Paper)(({ bgcolor }) => ({
    backgroundColor: bgcolor,
    color: "white",
    padding: 10,
    textAlign: "center",
    width: 200,
    height: 200,
    borderRadius: 15,
    position: "relative",
    zIndex: 1,
  }));

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
    >
      {pasos?.length > 0 ? (
        <Grid container spacing={0} justifyContent="center" mt={5} mb={5}>
          {pasos?.map((paso, index) => (
            <Grid
              sx={{
                borderBottom:
                  index % 2 === 0 ? `20px solid ${paso.color}` : "none",
                borderTop:
                  index % 2 !== 0 ? `20px solid ${paso.color}` : "none",
                pt: 2,
                pl: 8,
                pr: 8,
                pb: 7,
                mt: 1,
                borderRadius: 50,
                backgroundColor: "#ffffffff",
              }}
              item
              key={index}
            >
              <PasoContainer>
                <NumeroCirculo bgcolor={paso.color}>
                  {paso.numero}
                </NumeroCirculo>
                <PasoCard
                  elevation={3}
                  bgcolor={paso.color}
                  onClick={() => {
                    dispatch(handleMenu(paso));
                  }}
                >
                  <Box sx={{ mb: 1 }}>
                    <paso.Icon sx={{ fontSize: 52, color: "white" }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "600" }}>
                    {paso.titulo}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {paso.descripcion}
                  </Typography>
                </PasoCard>
              </PasoContainer>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            mt: 5,
            backgroundColor: "#ffeeee",
            color: "#810303ff",
            fontWeight: "400",
            fontSize: "13px",
            margin: "2",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid red",
          }}
        >
          No tienes permisos para acceder a los componentes de Sellout.
        </Typography>
      )}
    </Box>
  );
};

export default SelloutIndurama;
