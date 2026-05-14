import { useEffect } from "react";
import { Box, Typography, styled, Container, Grid, alpha } from "@mui/material";
import {
  Public as PublicIcon,
  EmojiObjects as EmojiObjectsIcon,
  Settings as SettingsIcon,
  MenuBook as MenuBookIcon,
  Search as SearchIcon,
  AddToQueue as AddToQueueIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { handleMenu } from "../../redux/navigatorSlice";
import { usePermission } from "../../context/PermisosComtext";
import { setCalculateDate } from "../../redux/configSelloutSlice";
import { getPreviousMonthStart } from "../constantes";
import bannerImg from "../../assets/banner.svg";

const Canvas = styled(Box)(({ theme }) => ({
  padding: "40px 0 100px 0",
  background: "#f8fafc",
  position: "relative",
  overflowX: "hidden",
  "&::before": {
    content: '""',
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: `
      radial-gradient(circle at 10% 10%, ${alpha("#3b82f6", 0.05)} 0%, transparent 50%),
      radial-gradient(circle at 90% 10%, ${alpha("#ec4899", 0.05)} 0%, transparent 50%),
      radial-gradient(circle at 50% 90%, ${alpha("#10b981", 0.05)} 0%, transparent 50%)
    `,
    zIndex: 0,
  },
  animation: "fadeInCanvas 0.8s ease-out",
  "@keyframes fadeInCanvas": {
    from: { opacity: 0 },
    to: { opacity: 1 }
  }
}));

const BannerWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "220px",
  borderRadius: "40px",
  overflow: "hidden",
  position: "relative",
  background: "#fff",
  marginBottom: "48px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
  border: "1px solid rgba(255,255,255,0.8)",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  "&:hover img": {
    transform: "scale(1.05)",
  },
  animation: "slideDown 1s cubic-bezier(0.4, 0, 0.2, 1)",
  "@keyframes slideDown": {
    from: { transform: "translateY(-30px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 }
  }
}));

const PhaseBlock = styled(Box)(({ shadowcolor, delay }) => ({
  position: "relative",
  padding: "35px 25px",
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(30px) saturate(160%)",
  borderRadius: "36px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
  boxShadow: `
    0 10px 30px rgba(0,0,0,0.02),
    0 30px 60px ${alpha(shadowcolor, 0.05)},
    inset 0 0 0 1px rgba(255,255,255,0.4)
  `,
  animation: "slideUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
  animationDelay: delay || "0s",
  opacity: 0,
  "@keyframes slideUp": {
    from: { transform: "translateY(50px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 }
  },
  "&:hover": {
    transform: "translateY(-12px) scale(1.01)",
    background: "rgba(255, 255, 255, 0.9)",
    boxShadow: `
      0 20px 40px rgba(0,0,0,0.04),
      0 50px 100px ${alpha(shadowcolor, 0.12)},
      inset 0 0 0 1px rgba(255,255,255,0.8)
    `,
    "& .watermark": {
      transform: "scale(1.15) rotate(-5deg)",
      opacity: 0.08,
      filter: "blur(2px)"
    }
  }
}));

const Watermark = styled(Typography)(({ color }) => ({
  position: "absolute",
  right: "-20px",
  bottom: "-20px",
  fontSize: "220px",
  fontWeight: 900,
  color: alpha(color, 0.06),
  lineHeight: 0.7,
  pointerEvents: "none",
  fontFamily: "'Outfit', sans-serif",
  zIndex: 0,
  userSelect: "none",
  transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
  filter: "blur(0px)"
}));

const PhaseBadge = styled(Box)(({ gradient, shadowcolor }) => ({
  background: gradient,
  color: "#fff",
  padding: "8px 20px",
  borderRadius: "14px",
  fontWeight: "800",
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  fontSize: "0.7rem",
  display: "inline-flex",
  alignItems: "center",
  marginBottom: "16px",
  boxShadow: `0 12px 25px ${alpha(shadowcolor, 0.3)}`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%", left: "-50%", width: "200%", height: "200%",
    background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
    transform: "rotate(45deg)",
    animation: "shine 3s infinite",
  },
  "@keyframes shine": {
    "0%": { left: "-100%" },
    "100%": { left: "100%" }
  }
}));

const VerticalTimeline = styled(Box)({
  position: "relative",
  marginTop: "20px",
  zIndex: 2,
});

const VerticalStep = styled(Box)(({ stepcolor }) => ({
  position: "relative",
  padding: "16px 16px 16px 75px",
  marginBottom: "12px",
  borderRadius: "24px",
  cursor: "pointer",
  transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
  background: "transparent",
  border: "1px solid transparent",
  "& .step-icon-wrapper": {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "50px",
    height: "50px",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: `0 8px 20px ${alpha(stepcolor, 0.1)}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: stepcolor,
    transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
    "& svg": {
      fontSize: "26px",
      transition: "transform 0.5s ease",
    }
  },
  "&:hover": {
    background: "rgba(255, 255, 255, 0.8)",
    borderColor: alpha(stepcolor, 0.15),
    boxShadow: `0 12px 28px ${alpha(stepcolor, 0.08)}`,
    transform: "translateX(8px)",
    "& .step-icon-wrapper": {
      background: stepcolor,
      color: "#fff",
      boxShadow: `0 12px 25px ${alpha(stepcolor, 0.3)}`,
      transform: "translateY(-50%) scale(1.1) rotate(5deg)",
      "& svg": { transform: "scale(1.1)" }
    },
    "& .step-title": { color: stepcolor }
  }
}));

const HorizontalTimeline = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "30px",
  marginTop: "40px",
  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  }
}));

const HorizontalStep = styled(Box)(({ stepcolor }) => ({
  position: "relative",
  padding: "24px",
  borderRadius: "32px",
  background: alpha(stepcolor, 0.03),
  border: "1px solid transparent",
  cursor: "pointer",
  transition: "all 0.4s ease",
  "& .step-icon-wrapper": {
    width: "56px",
    height: "56px",
    borderRadius: "18px",
    background: alpha(stepcolor, 0.08),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: stepcolor,
    marginBottom: "16px",
    transition: "all 0.4s ease",
    "& svg": { fontSize: "28px" }
  },
  "&:hover": {
    background: "#ffffff",
    borderColor: alpha(stepcolor, 0.1),
    boxShadow: `0 10px 25px ${alpha(stepcolor, 0.05)}`,
    transform: "translateY(-5px)",
    "& .step-icon-wrapper": {
      background: stepcolor,
      color: "#fff",
      transform: "scale(1.1)",
    },
    "& .step-title": { color: stepcolor }
  }
}));

const SelloutIndurama = () => {
  const dispatch = useDispatch();
  const namePermission = usePermission();

  useEffect(() => {
    const calculateDate = getPreviousMonthStart();
    dispatch(setCalculateDate(calculateDate));
  }, [dispatch]);

  const palette = {
    blue: { main: "#3b82f6", grad: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)" },
    purple: { main: "#8b5cf6", grad: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" },
    pink: { main: "#ec4899", grad: "linear-gradient(135deg, #f472b6 0%, #db2777 100%)" },
    green: { main: "#10b981", grad: "linear-gradient(135deg, #34d399 0%, #059669 100%)" },
    orange: { main: "#f59e0b", grad: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)" },
    cyan: { main: "#06b6d4", grad: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)" },
  };

  const phases = [
    {
      id: "p1",
      name: "Configuración",
      badge: "Infraestructura",
      color: palette.blue.main,
      gradient: palette.blue.grad,
      steps: [
        { num: "1", id: 2, tab: 0, permiso: "MATRICULACION SELLOUT", title: "Configuración de Mes", desc: "Define el mes activo y fechas de cierre.", Icon: SettingsIcon, color: palette.cyan.main },
        { num: "2", id: 2, tab: 1, permiso: "MATRICULACION SELLOUT", title: "Matriculación de plantillas", desc: "Vincula formatos Excel a cada cliente.", Icon: AddToQueueIcon, color: palette.blue.main },
        { num: "3", id: 2, tab: 2, permiso: "MATRICULACION SELLOUT", title: "Resumen de Carga", desc: "Monitorea el avance y las recepciones.", Icon: SearchIcon, color: palette.purple.main },
      ]
    },
    {
      id: "p2",
      name: "Carga de plantillas",
      badge: "Procesamiento",
      color: palette.purple.main,
      gradient: palette.purple.grad,
      steps: [
        { num: "4", id: 5, tab: 0, permiso: "EXTRACCION SELLOUT", title: "Extracción de Datos", desc: "Procesamiento masivo de archivos Excel.", Icon: EmojiObjectsIcon, color: palette.orange.main },
        { num: "5", id: 5, tab: 1, permiso: "EXTRACCION SELLOUT", title: "Configuración Plantilla", desc: "Aplica reglas de negocio por cliente.", Icon: SettingsIcon, color: palette.purple.main },
        { num: "6", id: 5, tab: 2, permiso: "EXTRACCION SELLOUT", title: "Diccionario", desc: "Homologación automática de términos.", Icon: MenuBookIcon, color: palette.pink.main },
      ]
    }
  ];

  const phase3 = {
    name: "Validación",
    badge: "Consolidación",
    color: palette.green.main,
    gradient: palette.green.grad,
    steps: [
      { num: "7", id: 3, tab: 0, permiso: "MAESTROS SELLOUT", title: "Maestros", desc: "Gestión oficial de Almacenes y Productos.", Icon: MenuBookIcon, color: palette.blue.main },
      { num: "8", id: 4, tab: 0, permiso: "SIC SELLOUT", title: "SIC", desc: "Valida con sistema central.", Icon: PublicIcon, color: palette.green.main },
      { num: "9", id: 6, tab: 0, permiso: "PLANTILLA CONSOLIDADO SELLOUT", title: "Base Consolidada", desc: "Borrador unificado listo.", Icon: AddToQueueIcon, color: palette.pink.main },
      { num: "10", id: 9, tab: 0, permiso: "MAESTROS SELLOUT", title: "No Homologados", desc: "Módulo para excepciones.", Icon: EmojiObjectsIcon, color: palette.orange.main },
      { num: "11", id: 3, tab: 0, permiso: "MAESTROS SELLOUT", title: "Maestros", desc: "Revisión final catálogos.", Icon: MenuBookIcon, color: palette.cyan.main },
      { num: "12", id: 6, tab: 0, permiso: "PLANTILLA CONSOLIDADO SELLOUT", title: "Base Consolidada Validada", desc: "Datos finales limpios.", Icon: SearchIcon, color: palette.green.main },
    ]
  };

  return (
    <Canvas>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4, lg: 6 }, zIndex: 1, position: "relative" }}>

        <BannerWrapper>
          <img src={bannerImg} alt="Sellout Banner" />
        </BannerWrapper>

        <Grid container spacing={2} display={"flex"} justifyContent={"center"}>
          {/* Phase 1: Configuración2Operativa */}
          <Grid item xs={12} md={4}>
            <PhaseBlock shadowcolor={phases[0].color} delay="0s">
              <Watermark color={phases[0].color}>{1}</Watermark>
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <PhaseBadge gradient={phases[0].gradient} shadowcolor={phases[0].color}>{phases[0].badge}</PhaseBadge>
                <Typography variant="h4" fontWeight={900} sx={{ fontFamily: "'Outfit', sans-serif", color: "#1e293b", letterSpacing: "-0.02em", mb: 3 }}>
                  {phases[0].name}
                </Typography>
              </Box>

              <VerticalTimeline>
                {phases[0].steps.filter(s => namePermission(s.permiso) || true).map((step) => (
                  <VerticalStep key={step.num} stepcolor={step.color} onClick={() => dispatch(handleMenu({ id: step.id, tab: step.tab }))}>
                    <Box className="step-icon-wrapper">
                      <step.Icon />
                    </Box>
                    <Box className="step-content">
                      <Typography variant="caption" fontWeight={800} sx={{ color: step.color, textTransform: "uppercase", letterSpacing: "1.2px", display: "block", mb: 0.3 }}>Paso {step.num}</Typography>
                      <Typography variant="h6" className="step-title" fontWeight={800} sx={{ color: "#1e293b", fontFamily: "'Outfit', sans-serif", mb: 0.3, lineHeight: 1.3 }}>{step.title}</Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500, lineHeight: 1.4 }}>{step.desc}</Typography>
                    </Box>
                  </VerticalStep>
                ))}
              </VerticalTimeline>
            </PhaseBlock>
          </Grid>

          {/* Phase 2: Motor de Carga */}
          <Grid item xs={12} md={4}>
            <PhaseBlock shadowcolor={phases[1].color} delay="0.2s">
              <Watermark color={phases[1].color}>{2}</Watermark>
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <PhaseBadge gradient={phases[1].gradient} shadowcolor={phases[1].color}>{phases[1].badge}</PhaseBadge>
                <Typography variant="h4" fontWeight={900} sx={{ fontFamily: "'Outfit', sans-serif", color: "#1e293b", letterSpacing: "-0.02em", mb: 3 }}>
                  {phases[1].name}
                </Typography>
              </Box>

              <VerticalTimeline>
                {phases[1].steps.filter(s => namePermission(s.permiso) || true).map((step) => (
                  <VerticalStep key={step.num} stepcolor={step.color} onClick={() => dispatch(handleMenu({ id: step.id, tab: step.tab }))}>
                    <Box className="step-icon-wrapper">
                      <step.Icon />
                    </Box>
                    <Box className="step-content">
                      <Typography variant="caption" fontWeight={800} sx={{ color: step.color, textTransform: "uppercase", letterSpacing: "1.2px", display: "block", mb: 0.3 }}>Paso {step.num}</Typography>
                      <Typography variant="h6" className="step-title" fontWeight={800} sx={{ color: "#1e293b", fontFamily: "'Outfit', sans-serif", mb: 0.3, lineHeight: 1.3 }}>{step.title}</Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500, lineHeight: 1.4 }}>{step.desc}</Typography>
                    </Box>
                  </VerticalStep>
                ))}
              </VerticalTimeline>
            </PhaseBlock>
          </Grid>

          {/* Phase 3: Validación Final */}
          <Grid item xs={12} md={4}>
            <PhaseBlock shadowcolor={phase3.color} delay="0.4s">
              <Watermark color={phase3.color}>{3}</Watermark>
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <PhaseBadge gradient={phase3.gradient} shadowcolor={phase3.color}>{phase3.badge}</PhaseBadge>
                <Typography variant="h4" fontWeight={900} sx={{ fontFamily: "'Outfit', sans-serif", color: "#1e293b", letterSpacing: "-0.02em", mb: 3 }}>
                  {phase3.name}
                </Typography>
              </Box>

              <VerticalTimeline>
                {phase3.steps.filter(s => namePermission(s.permiso) || true).map((step) => (
                  <VerticalStep key={step.num} stepcolor={step.color} onClick={() => dispatch(handleMenu({ id: step.id, tab: step.tab }))}>
                    <Box className="step-icon-wrapper">
                      <step.Icon />
                    </Box>
                    <Box className="step-content">
                      <Typography variant="caption" fontWeight={800} sx={{ color: step.color, textTransform: "uppercase", letterSpacing: "1.2px", display: "block", mb: 0.3 }}>Paso {step.num}</Typography>
                      <Typography variant="h6" className="step-title" fontWeight={800} sx={{ color: "#1e293b", fontFamily: "'Outfit', sans-serif", mb: 0.3, lineHeight: 1.3 }}>{step.title}</Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500, lineHeight: 1.4 }}>{step.desc}</Typography>
                    </Box>
                  </VerticalStep>
                ))}
              </VerticalTimeline>
            </PhaseBlock>
          </Grid>
        </Grid>
      </Container>
    </Canvas>
  );
};

export default SelloutIndurama;
