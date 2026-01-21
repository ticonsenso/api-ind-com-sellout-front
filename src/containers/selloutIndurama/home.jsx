import { Box, Typography, styled, Container, Grid, Paper, alpha } from "@mui/material";
import {
  Public as PublicIcon,
  EmojiObjects as EmojiObjectsIcon,
  Settings as SettingsIcon,
  MenuBook as MenuBookIcon,
  Search as SearchIcon,
  AddToQueue as AddToQueueIcon,
  ArrowForwardIos as ArrowIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { handleMenu } from "../../redux/navigatorSlice";
import { usePermission } from "../../context/PermisosComtext";
import { setCalculateDate } from "../../redux/configSelloutSlice";
import { getPreviousMonthStart } from "../constantes";

const SelloutIndurama = () => {
  const dispatch = useDispatch();
  const namePermission = usePermission();

  const calculateDate = getPreviousMonthStart();
  dispatch(setCalculateDate(calculateDate));

  const MainContainer = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "100vh",
    overflow: "auto",
    margin: 20,
    backgroundImage: `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`, // Subtle neat background
    padding: 20,
    borderRadius: "24px",
  }));

  const GlassCard = styled(Paper)(({ theme, bgcolor }) => ({
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    padding: theme.spacing(3),
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: `0 12px 40px 0 ${alpha(bgcolor || "#000", 0.3)}`,
      border: `1px solid ${alpha(bgcolor || "#000", 0.5)}`,
      "& .icon-glow": {
        transform: "scale(1.1) rotate(5deg)",
        opacity: 1,
      },
    },
  }));

  const NumberWatermark = styled(Typography)(({ color }) => ({
    position: "absolute",
    top: "-10px",
    right: "10px",
    fontSize: "6rem",
    fontWeight: 900,
    color: color,
    opacity: 0.1,
    lineHeight: 1,
    fontFamily: "'Outfit', sans-serif",
    pointerEvents: "none",
  }));

  const IconWrapper = styled(Box)(({ bgcolor }) => ({
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    background: `linear-gradient(135deg, ${bgcolor} 0%, ${alpha(bgcolor, 0.7)} 100%)`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "16px",
    boxShadow: `0 8px 16px ${alpha(bgcolor, 0.4)}`,
    position: "relative",
    zIndex: 2,
  }));

  const SubStepItem = styled(Box)(({ hovercolor }) => ({
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: "12px",
    transition: "background 0.2s ease",
    marginTop: "4px",
    "&:hover": {
      background: alpha(hovercolor, 0.1),
      "& .arrow-icon": {
        transform: "translateX(4px)",
        color: hovercolor,
      },
      "& .sub-text": {
        color: hovercolor,
        fontWeight: 600,
      },
    },
  }));

  const pasos = [
    {
      id: 2,
      menuSellout: true,
      name: "Configuración de plantillas",
      numero: "01",
      titulo: "Configuración",
      descripcion: "Activación de cierre y gestión de clientes.",
      color: "#d50040",
      Icon: AddToQueueIcon,
      nameInfo: "Configuración de cierre",
      permiso: "MATRICULACION SELLOUT",
      subpasos: [
        {
          id: 2,
          titulo: "Lista de Clientes",
          permiso: "EXTRACCION SELLOUT",
          menuSellout: true,
          name: "Configuración de plantillas",
          tab: 1,
          nameInfo: 'Clientes a cargar',
        },
        {
          id: 2,
          titulo: "Clientes Cargados",
          permiso: "EXTRACCION SELLOUT",
          menuSellout: true,
          name: "Configuración de plantillas",
          tab: 2,
          nameInfo: 'Clientes cargados',
        },
      ],
    },
    {
      id: 5,
      numero: "02",
      titulo: "Carga de Plantillas",
      descripcion: "Procesamiento y carga de archivos Excel.",
      color: "#0669ab",
      Icon: MenuBookIcon,
      permiso: "EXTRACCION SELLOUT",
      menuSellout: true,
      name: "Carga de plantillas",
      nameInfo: "Carga de archivos excel",
      subpasos: [
        {
          id: 5,
          name: "Configuración de Extracción",
          permiso: "EXTRACCION SELLOUT",
          menuSellout: true,
          titulo: "Configuraciones",
          nameInfo: "Crear configuraciones",
          tab: 1,
        },
      ],
    },
    {
      id: 6,
      menuSellout: true,
      numero: "03",
      name: "Base Consolidada",
      titulo: "Validación",
      descripcion: "Análisis y validación de datos consolidados.",
      color: "#ef6c00",
      Icon: SearchIcon,
      nameInfo: "Lista de datos",
      permiso: "PLANTILLA CONSOLIDADO SELLOUT",
      subpasos: [
        {
          id: 9,
          numero: "3.1",
          titulo: "Base no Homologada",
          name: "Base no Homologada",
          descripcion: "Lista de productos y almacenes que no necesitan homologación.",
          color: "#6a1b9a",
          Icon: PublicIcon,
          permiso: "MAESTROS SELLOUT",
          menuSellout: true,
          nameInfo: "Almacenes-Productos no homologados",
        },
        {
          id: 4,
          numero: "3.2",
          titulo: "Maestros",
          name: "Maestros",
          descripcion: "Carga y gestión de productos y almacenes maestros.",
          color: "#6a1b9a",
          Icon: PublicIcon,
          permiso: "MAESTROS SELLOUT",
          menuSellout: true,
          nameInfo: "Lista de almacenes y productos",
        },
      ]
    },
    {
      id: 4,
      numero: "04",
      titulo: "SIC",
      descripcion: "Gestión avanzada de productos y almacenes SIC.",
      color: "#2e7d32",
      Icon: EmojiObjectsIcon,
      permiso: "SIC SELLOUT",
      name: "SIC",
      nameInfo: "Almacenes - Productos SIC",
      menuSellout: true,
    },
  ].filter((paso) => namePermission(paso.permiso));

  return (
    <MainContainer>
      <Box sx={{ mb: 6, textAlign: 'center', pt: 2 }}>
        <Typography variant="h3" fontWeight="800" sx={{
          background: "linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1
        }}>
          Panel Sellout
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight="400">
          Gestión integral de procesos y configuraciones
        </Typography>
      </Box>

      {pasos.length > 0 ? (
        <Grid container spacing={5} >
          {pasos.map((paso, index) => (
            <Grid size={3} key={index} sx={{ display: 'flex' }}>
              <GlassCard
                bgcolor={paso.color}
                onClick={() => dispatch(handleMenu(paso))}
                elevation={0}
              >
                <NumberWatermark color={paso.color}>
                  {paso.numero}
                </NumberWatermark>

                <Box>
                  <IconWrapper bgcolor={paso.color}>
                    <paso.Icon sx={{ fontSize: 32, color: "white" }} />
                  </IconWrapper>

                  <Typography variant="h5" fontWeight="700" color="#333" gutterBottom>
                    {paso.titulo}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {paso.descripcion}
                  </Typography>
                </Box>

                {paso.subpasos && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                    {paso.subpasos.map((sub) => (
                      <SubStepItem
                        key={sub.id}
                        hovercolor={paso.color}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(handleMenu(sub));
                        }}
                      >
                        <ArrowIcon className="arrow-icon" sx={{ fontSize: 14, color: '#999', mr: 1, transition: 'all 0.2s' }} />
                        <Typography className="sub-text" variant="body2" color="text.secondary" sx={{ transition: 'color 0.2s' }}>
                          {sub.titulo}
                        </Typography>
                      </SubStepItem>
                    ))}
                  </Box>
                )}
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 8
        }}>
          <Paper sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: '#fff0f0',
            border: '1px solid #ffcdd2',
            borderRadius: 4
          }}>
            <Typography color="error" variant="h6">
              Acceso Restringido
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              No tienes permisos para ver estos módulos.
            </Typography>
          </Paper>
        </Box>
      )}
    </MainContainer>
  );
};

export default SelloutIndurama;
