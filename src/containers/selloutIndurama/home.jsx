import { useEffect } from "react";
import { Box, Typography, styled, Container, Grid, alpha, Tooltip } from "@mui/material";
import {
  FreeCancellation as FreeCancellationIcon,
  TableView as TableViewIcon,
  FormatListBulleted as FormatListBulletedIcon,
  EventRepeat as EventRepeatIcon,
  GridOff as GridOffIcon,
  Search as SearchIcon,
  ViewSidebar as ViewSidebarIcon,
  Settings as SettingsIcon,
  AutoStories as AutoStoriesIcon,
  Ballot as BallotIcon,
  Checklist as ChecklistIcon,
  ReportProblem as ReportProblemIcon,
  CheckCircle as CheckCircleIcon,
  Public as PublicIcon,
  AppsOutage as AppsOutageIcon,
  Storage as StorageIcon,
  ArrowRightAlt as ArrowRightAltIcon,
  SettingsSuggest as SettingsSuggestIcon,
  CloudSync as CloudSyncIcon,
  FactCheck as FactCheckIcon,
  EditNote as EditNoteIcon,
} from "@mui/icons-material";

import { useDispatch } from "react-redux";
import { handleMenu } from "../../redux/navigatorSlice";
import { usePermission } from "../../context/PermisosComtext";
import { setCalculateDate } from "../../redux/configSelloutSlice";
import { getPreviousMonthStart } from "../constantes";
import bannerImg from "../../assets/banner1.svg";
import { PERMISSIONS } from "../../constants/permissions";

const Canvas = styled(Box)(() => ({
  padding: "20px 0 80px 0",
  background: "#f8fafc",
  position: "relative",
  overflowX: "hidden",
  height: "100vh",
  "&::before": {
    content: '""',
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: `
      radial-gradient(circle at 10% 10%, ${alpha("#3b82f6", 0.05)} 0%, transparent 100%),
      radial-gradient(circle at 90% 10%, ${alpha("#ec4899", 0.05)} 0%, transparent 100%),
      radial-gradient(circle at 50% 90%, ${alpha("#10b981", 0.05)} 0%, transparent 100%)
    `,
    zIndex: 0,
  }
}));

const BannerWrapper = styled(Box)(() => ({
  height: "clamp(150px, 18vh, 350px)",
  borderRadius: "clamp(6px, 1vw, 16px)",
  overflow: "hidden",
  position: "relative",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center center",
    transition: "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  "&:hover img": {
    transform: "scale(1.02)",
  }
}));
const PhaseBlock = styled(Box)(() => ({
  position: "relative",
  background: "rgba(255, 255, 255, 0.75)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: "24px",
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  boxShadow: `0 8px 32px 0 rgba(15, 23, 42, 0.03), inset 0 0 0 1px rgba(255, 255, 255, 0.5)`,
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: `0 16px 48px 0 rgba(15, 23, 42, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.6)`,
    background: "rgba(255, 255, 255, 0.85)",
  }
}));

const Watermark = styled(Typography)(({ color }) => ({
  position: "absolute",
  right: "-2vw",
  bottom: "-2vh",
  fontSize: "clamp(120px, 20vw, 400px)",
  fontWeight: 900,
  color: alpha(color, 0.08),
  lineHeight: 0.7,
  pointerEvents: "none",
  fontFamily: "'Outfit', sans-serif",
  zIndex: 2,
  userSelect: "none",
  transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
  filter: "blur(0px)"
}));

const StepSvgIcon = ({ type }) => {
  const iconProps = {
    fontSize: "medium",
    sx: { color: "currentColor", fontSize: 28 },
  };

  const icons = {
    calendar: <FreeCancellationIcon {...iconProps} />,
    spreadsheet: <TableViewIcon {...iconProps} />,
    search: <EventRepeatIcon  {...iconProps} />,
    funnel: <GridOffIcon   {...iconProps} />,
    cog: <SettingsSuggestIcon  {...iconProps} />,
    book: <AutoStoriesIcon {...iconProps} />,
    users: <EditNoteIcon  {...iconProps} />,
    alert: <AppsOutageIcon {...iconProps} />,
    globe: <CloudSyncIcon  {...iconProps} />,
    database: <FactCheckIcon  {...iconProps} />,
  };

  return icons[type] || icons.list;
};

const PhaseBadge = styled(Box)(({ gradient, shadowcolor }) => ({
  background: gradient || "#333",
  color: "#fff",
  padding: "clamp(4px, 0.8vh, 12px) clamp(10px, 1.5vw, 24px)",
  borderRadius: "30px",
  fontWeight: "700",
  letterSpacing: "1px",
  textTransform: "uppercase",
  fontSize: "clamp(0.65rem, 0.9vw, 1.3rem)",
  display: "inline-flex",
  alignItems: "center",
  boxShadow: `0 6px 15px ${alpha(shadowcolor || "#000", 0.22)}`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%", left: "-50%", width: "200%", height: "200%",
    background: "linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
    transform: "rotate(45deg)",
  }
}));

const VerticalTimeline = styled(Box)(({ timelinecolor }) => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  padding: "clamp(12px, 2vh, 32px) clamp(5px, 1vw, 20px) clamp(12px, 2vh, 32px) 2vw",
  boxSizing: "border-box",
  justifyContent: "flex-start",
  gap: "clamp(14px, 2.2vh, 35px)",
  "&::before": {
    content: '""',
    position: "absolute",
    left: "calc(2vw + clamp(36px, 4vw, 80px) / 2)",
    top: "5%",
    bottom: "5%",
    width: "2px",
    background: alpha(timelinecolor || "#ccc", 0.18),
    zIndex: 1,
  }
}));

const VerticalStep = styled(Box)(({ stepcolor, disabled, secondary, indent }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  paddingLeft: secondary ? "calc(clamp(24px, 2.8vw, 60px) + 1.5vw)" : "calc(clamp(36px, 4vw, 80px) + 1.5vw)",
  marginLeft: indent ? "clamp(20px, 3vw, 60px)" : 0,
  boxSizing: "border-box",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.65 : 1,
  "&:hover": {
    "& .step-card": {
      transform: disabled ? "none" : (secondary ? "translateX(2px)" : "translateX(4px)"),
      boxShadow: disabled
        ? "0 2px 4px rgba(0,0,0,0.02)"
        : `0 8px 25px ${alpha(stepcolor, 0.08)}, 0 4px 10px rgba(0,0,0,0.03)`,
      borderColor: disabled ? "rgba(0, 0, 0, 0.08)" : alpha(stepcolor, 0.4),
    },
    "& .step-icon-box": {
      transform: disabled ? "translateY(-50%)" : "translateY(-50%) scale(1.1)",
      boxShadow: disabled ? "none" : `0 0 20px ${alpha(stepcolor, 0.55)}`,
      background: disabled
        ? alpha(stepcolor, 0.1)
        : `linear-gradient(135deg, ${stepcolor} 0%, ${alpha(stepcolor, 0.9)} 100%)`,
    }
  },
  "& .step-icon-box": {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: secondary ? "clamp(24px, 2.8vw, 60px)" : "clamp(36px, 4vw, 80px)",
    height: secondary ? "clamp(24px, 2.8vw, 60px)" : "clamp(36px, 4vw, 80px)",
    borderRadius: "50%",
    background: disabled
      ? alpha(stepcolor, 0.1)
      : `linear-gradient(135deg, ${stepcolor} 0%, ${alpha(stepcolor, 0.85)} 100%)`,
    color: disabled ? stepcolor : "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    zIndex: 2,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "none",
    boxShadow: disabled ? "none" : `0 0 14px ${alpha(stepcolor, 0.3)}`,
    "& svg": {
      width: secondary ? "clamp(14px, 1.6vw, 36px)" : "clamp(20px, 2.4vw, 48px)",
      height: secondary ? "clamp(14px, 1.6vw, 36px)" : "clamp(20px, 2.4vw, 48px)",
    }
  },
  "& .step-card": {
    flexGrow: 1,
    background: disabled
      ? "#f8fafc"
      : secondary
        ? "rgba(248, 250, 252, 0.95)"
        : "rgba(255, 255, 255, 0.65)",
    border: secondary
      ? "none"
      : "1px solid rgba(255, 255, 255, 0.5)",
    borderRadius: secondary ? "clamp(8px, 1vw, 20px)" : "clamp(12px, 1.5vw, 26px)",
    padding: secondary ? "clamp(4px, 0.8vh, 16px) clamp(8px, 1vw, 24px)" : "clamp(8px, 1.5vh, 24px) clamp(12px, 1.5vw, 32px)",
    display: "flex",
    flexDirection: "column",
    gap: secondary ? "clamp(1px, 0.3vh, 4px)" : "clamp(2px, 0.8vh, 10px)",
    boxShadow: secondary
      ? "none"
      : "0 4px 20px rgba(15, 23, 42, 0.015)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    minWidth: 0,
  },
  "& .step-title": {
    fontSize: secondary ? "clamp(0.7rem, 1vw, 1.5rem)" : "clamp(0.85rem, 1.2vw, 2rem)",
    fontWeight: secondary ? 500 : 700,
    color: secondary ? "#475569" : "#2d447c",
    lineHeight: 1.3,
    whiteSpace: "normal",
    overflow: "visible",
    textOverflow: "unset",
  },
  "& .step-desc": {
    fontSize: secondary ? "clamp(0.6rem, 0.8vw, 1.3rem)" : "clamp(0.7rem, 0.95vw, 1.6rem)",
    color: secondary ? "#64748b" : "#475569",
    lineHeight: 1.35,
    whiteSpace: "normal",
    overflow: "visible",
    textOverflow: "unset",
  }
}));
const SelloutIndurama = () => {
  const dispatch = useDispatch();
  const namePermission = usePermission();

  useEffect(() => {
    const calculateDate = getPreviousMonthStart();
    dispatch(setCalculateDate(calculateDate));
  }, [dispatch]);

  const stepColors = {
    c1: "#3b82f6",
    c2: "#8b5cf6",
    c3: "#ec4899",
    c4: "#10b981",
    c5: "#f59e0b",
    c6: "#06b6d4",
    c7: "#f97316",
    c8: "#14b8a6",
    c9: "#0ea5e9",
    c10: "#f43f5e",
  };

  const phases = [
    {
      id: "p1",
      name: "Configuración",
      badge: "Fase 1",
      color: stepColors.c1,
      gradient: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
      steps: [
        { num: "1", id: 2, tab: 0, permiso: PERMISSIONS.MENU.CONFIG_PLANTILLAS, title: "Configuración mes", desc: "Activa periodos de carga.", icon: "calendar", color: stepColors.c1 },
        { num: "2", id: 2, tab: 1, permiso: PERMISSIONS.MENU.CONFIG_PLANTILLAS, title: "Matriculación Plantillas", desc: "Listado de clientes a cargar.", icon: "spreadsheet", color: stepColors.c2 },
        { num: "3", id: 2, tab: 2, permiso: PERMISSIONS.MENU.CONFIG_PLANTILLAS, title: "Seguimiento Carga", desc: "Monitorea avance de registros.", icon: "search", color: stepColors.c3 },
      ]
    },
    {
      id: "p2",
      name: "Procesamiento",
      badge: "Fase 2",
      color: stepColors.c2,
      gradient: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
      steps: [
        { num: "4", id: 5, tab: 0, permiso: PERMISSIONS.MENU.CARGA_PLANTILLAS, title: "Extracción de datos", desc: "Carga de plantillas de clientes.", icon: "funnel", color: stepColors.c4 },
        { num: "4.1", id: 5, tab: 1, permiso: PERMISSIONS.EXTRACCION.CONFIG_EXTRACCION, title: "Configuración Plantilla Específica", desc: "Campos específicos por cliente.", icon: "cog", color: stepColors.c5, secondary: true, indent: true },
        { num: "4.2", id: 5, tab: 2, permiso: PERMISSIONS.EXTRACCION.DICCIONARIO, title: "Diccionario", desc: "Homologa términos.", icon: "book", color: stepColors.c6, secondary: true, indent: true },
      ]
    }
  ];

  const phase3 = {
    name: "Validación",
    badge: "Fase 3",
    color: stepColors.c4,
    gradient: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
    steps: [
      { num: "5", id: 9, tab: 0, permiso: PERMISSIONS.MENU.LISTAS_NO_HOMOLOGADOS, title: "No homologados", desc: "Almacenes y productos no homologados.", icon: "alert", color: stepColors.c7 },
      { num: "6", id: 3, tab: 0, permiso: PERMISSIONS.MENU.MAESTROS, title: "Gestionar Maestros", desc: "Almacenes y productos para homologar.", icon: "users", color: stepColors.c8 },
      { num: "6.1", id: 11, tab: 0, permiso: PERMISSIONS.MENU.SIC, title: "Sincronización DIM", desc: "Datos sistema comercial.", icon: "globe", color: stepColors.c9, secondary: true, indent: true },
      { num: "7", id: 6, tab: 0, permiso: PERMISSIONS.MENU.BASE_CONSOLIDADA, title: "Base Consolidada", desc: "Información sell out homologada.", icon: "database", color: stepColors.c10 },
    ]
  };

  const styles = {
    phaseTitle: {
      fontWeight: 900,
      fontSize: "clamp(1.1rem, 1.5vw, 2.5rem)",
      color: "#005aa3ff",
    },
    phaseHeader: {
      position: "relative",
      zIndex: 2,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "clamp(8px, 1.5vh, 24px) clamp(10px, 1.5vw, 30px)",
    }
  };

  return (
    <Canvas sx={{ padding: "1.5vh 1vw", height: "100vh", display: "flex", flexDirection: "column", boxSizing: "border-box", overflow: "hidden" }}>
      <Container maxWidth={false} disableGutters sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative", zIndex: 1 }}>

        <BannerWrapper sx={{ mb: "1.5vh", flexShrink: 0 }}>
          <img src={bannerImg} alt="Sellout Banner" />
        </BannerWrapper>

        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: "1.5vw",
          width: "100%",
          flexGrow: 1,
          minHeight: 0
        }}>
          {/* Columna Phase 1: Configuración */}
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
            <PhaseBlock shadowcolor={phases[0].color} delay="0s" sx={{ height: "100%", flexGrow: 1 }}>
              <Watermark color={phases[0].color}>{1}</Watermark>
              <Box sx={styles.phaseHeader}>
                <PhaseBadge gradient={phases[0].gradient} shadowcolor={phases[0].color}>
                  {phases[0].badge}
                </PhaseBadge>
                <Typography fontWeight={700} sx={styles.phaseTitle}>
                  {phases[0].name}
                </Typography>
              </Box>

              <VerticalTimeline timelinecolor={phases[0].color}>
                {phases[0].steps.map((step) => {
                  const hasPermission = namePermission(step.permiso);
                  const stepContent = (
                    <VerticalStep
                      key={step.num}
                      stepcolor={step.color}
                      secondary={step.secondary}
                      indent={step.indent}
                      disabled={!hasPermission}
                      onClick={() => {
                        if (hasPermission) {
                          dispatch(handleMenu({ id: step.id, tab: step.tab }));
                        }
                      }}
                    >
                      <Box className="step-icon-box">
                        <StepSvgIcon type={step.icon} color={step.color} />
                      </Box>
                      <Box className="step-card">
                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {step.indent && <ArrowRightAltIcon sx={{ fontSize: "1rem", color: "#94a3b8" }} />}
                          <Typography className="step-title" title={step.title}>{step.title}</Typography>
                        </Box>
                        <Typography className="step-desc" title={step.desc}>{step.desc}</Typography>
                      </Box>
                    </VerticalStep>
                  );
                  return hasPermission ? stepContent : (
                    <Tooltip title="No tiene permiso para acceder" arrow key={step.num}>
                      <Box sx={{ width: "100%" }}>{stepContent}</Box>
                    </Tooltip>
                  );
                })}
              </VerticalTimeline>
            </PhaseBlock>
          </Box>

          {/* Columna Phase 2: Carga de plantillas */}
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
            <PhaseBlock shadowcolor={phases[1].color} delay="0.2s" sx={{ height: "100%", flexGrow: 1 }}>
              <Watermark color={phases[1].color}>{2}</Watermark>
              <Box sx={styles.phaseHeader}>
                <PhaseBadge gradient={phases[1].gradient} shadowcolor={phases[1].color}>
                  {phases[1].badge}
                </PhaseBadge>
                <Typography fontWeight={700} sx={styles.phaseTitle}>
                  {phases[1].name}
                </Typography>
              </Box>

              <VerticalTimeline timelinecolor={phases[1].color}>
                {phases[1].steps.map((step) => {
                  const hasPermission = namePermission(step.permiso);
                  const stepContent = (
                    <VerticalStep
                      key={step.num}
                      stepcolor={step.color}
                      secondary={step.secondary}
                      indent={step.indent}
                      disabled={!hasPermission}
                      onClick={() => {
                        if (hasPermission) {
                          dispatch(handleMenu({ id: step.id, tab: step.tab }));
                        }
                      }}
                    >
                      <Box className="step-icon-box">
                        <StepSvgIcon type={step.icon} color={step.color} />
                      </Box>
                      <Box className="step-card">
                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {step.indent && <ArrowRightAltIcon sx={{ fontSize: "1rem", color: "#94a3b8" }} />}
                          <Typography className="step-title" title={step.title}>{step.title}</Typography>
                        </Box>
                        <Typography className="step-desc" title={step.desc}>{step.desc}</Typography>
                      </Box>
                    </VerticalStep>
                  );
                  return hasPermission ? stepContent : (
                    <Tooltip title="No tiene acceso o permiso" arrow key={step.num}>
                      <Box sx={{ width: "100%" }}>{stepContent}</Box>
                    </Tooltip>
                  );
                })}
              </VerticalTimeline>
            </PhaseBlock>
          </Box>

          {/* Columna Phase 3: Validación */}
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
            <PhaseBlock shadowcolor={phase3.color} delay="0.4s" sx={{ height: "100%", flexGrow: 1 }}>
              <Watermark color={phase3.color}>{3}</Watermark>
              <Box sx={styles.phaseHeader}>
                <PhaseBadge gradient={phase3.gradient} shadowcolor={phase3.color}>
                  {phase3.badge}
                </PhaseBadge>
                <Typography fontWeight={700} sx={styles.phaseTitle}>
                  {phase3.name}
                </Typography>
              </Box>

              <VerticalTimeline timelinecolor={phase3.color}>
                {phase3.steps.map((step) => {
                  const hasPermission = namePermission(step.permiso);
                  const stepContent = (
                    <VerticalStep
                      key={step.num}
                      stepcolor={step.color}
                      secondary={step.secondary}
                      indent={step.indent}
                      disabled={!hasPermission}
                      onClick={() => {
                        if (hasPermission) {
                          dispatch(handleMenu({ id: step.id, tab: step.tab }));
                        }
                      }}
                    >
                      <Box className="step-icon-box">
                        <StepSvgIcon type={step.icon} color={step.color} />
                      </Box>
                      <Box className="step-card">
                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {step.indent && <ArrowRightAltIcon sx={{ fontSize: "1rem", color: "#94a3b8" }} />}
                          <Typography className="step-title" title={step.title}>{step.title}</Typography>
                        </Box>
                        <Typography className="step-desc" title={step.desc}>{step.desc}</Typography>
                      </Box>
                    </VerticalStep>
                  );
                  return hasPermission ? stepContent : (
                    <Tooltip title="No tiene acceso o permiso" arrow key={step.num}>
                      <Box sx={{ width: "100%" }}>{stepContent}</Box>
                    </Tooltip>
                  );
                })}
              </VerticalTimeline>
            </PhaseBlock>
          </Box>
        </Box>
      </Container >
    </Canvas >
  );
};

export default SelloutIndurama;
