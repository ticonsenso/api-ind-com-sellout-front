import { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  styled,
  alpha,
  useTheme,
} from "@mui/material";
import {
  NavigateNext as NavigateNextIcon,
  HomeRounded as HomeIcon
} from "@mui/icons-material";
import * as Icons from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { handleMenu } from "../redux/navigatorSlice.js";
import { menuSelloutPage } from "../containers/dashboard/data.js";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../context/PermisosComtext";

const HeaderWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(1),
}));

const TitleSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2.5),
}));

const HomeButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  color: "#0072CE",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
  border: "1px solid rgba(0, 0, 0, 0.06)",
  width: "42px",
  height: "42px",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: "#FFFFFF",
    color: "#F39400",
    transform: "translateY(-3px)",
    boxShadow: "0 8px 24px rgba(0, 114, 206, 0.12)",
    borderColor: alpha("#F39400", 0.3),
  },
}));

const VerticalDivider = styled(Box)(({ theme }) => ({
  width: "4px",
  height: "48px",
  backgroundColor: "#F39400",
  borderRadius: "10px",
  opacity: 0.9,
  boxShadow: "0 2px 6px rgba(243, 148, 0, 0.2)",
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: "1.6rem",
  color: "#585858ff",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
}));

const InfoText = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
  color: "#64748B",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  marginTop: "6px",
}));

const InteractiveTrigger = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: 500,
  padding: "4px 12px",
  borderRadius: "20px",
  border: `1px solid ${active ? "rgba(0, 114, 206, 0.25)" : "rgba(0, 114, 206, 0.08)"}`,
  backgroundColor: active ? "rgba(0, 114, 206, 0.08)" : "rgba(0, 114, 206, 0.03)",
  color: active ? "#0072CE" : "#095bceff",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: "rgba(0, 114, 206, 0.08)",
    color: "#0072CE",
    borderColor: "rgba(0, 114, 206, 0.25)",
    transform: "translateY(-1px)",
    boxShadow: "0 2px 6px rgba(0, 114, 206, 0.05)",
  },
  "& .MUI-chevron": {
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: active ? "rotate(180deg)" : "none",
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: "160px",
  height: "44px",
  borderRadius: "12px",
  textTransform: "none",
  fontWeight: 700,
  fontSize: "0.9rem",
  backgroundColor: "#0072CE",
  boxShadow: "0 6px 20px rgba(0, 114, 206, 0.15)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#005bb5",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0, 114, 206, 0.25)",
  },
}));

const AtomTitleComponent = ({
  title,
  nameButton,
  onClick,
  menuSellout,
  nameInfo,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const hasPermission = usePermission();
  const initialStateMenu = useSelector((state) => state.navigator.initialStateMenu);
  const selectMenu = useSelector((state) => state.navigator.selectMenu);
  const [anchorEl, setAnchorEl] = useState(null);

  // Colores por fase (desde home.jsx de SelloutIndurama)
  const phaseColors = {
    1: { name: "Configuración", color: "#3b82f6", gradient: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)" },
    2: { name: "Procesamiento", color: "#8b5cf6", gradient: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" },
    3: { name: "Validación", color: "#10b981", gradient: "linear-gradient(135deg, #34d399 0%, #059669 100%)" },
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGoHome = () => {
    // Find the "Sellout Mercado" item (ID 0)
    const homeItem = initialStateMenu?.find(item => item.id === 0);
    if (homeItem) {
      dispatch(handleMenu(homeItem));
      navigate("/dashboard");
    }
  };

  const renderMenuIcon = (iconName, phaseColor, isSelected, hasPermission) => {
    if (iconName?.startsWith("mui:") && Icons[iconName.replace("mui:", "")]) {
      const IconComponent = Icons[iconName.replace("mui:", "")];
      return (
        <IconComponent
          sx={{
            fontSize: 16,
            color: isSelected
              ? "#ffffff"
              : hasPermission
                ? phaseColor
                : "#94a3b8",
            transition: "all 0.2s ease",
          }}
        />
      );
    }
    return (
      <Icons.Circle
        sx={{
          fontSize: 6,
          color: isSelected
            ? "#ffffff"
            : hasPermission
              ? phaseColor
              : "#94a3b8",
        }}
      />
    );
  };

  // Group items from menuSelloutPage by Phase
  const phases = [
    { id: 1, name: "Configuración", color: "#3b82f6", gradient: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)" },
    { id: 2, name: "Procesamiento", color: "#8b5cf6", gradient: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)" },
    { id: 3, name: "Validación", color: "#10b981", gradient: "linear-gradient(135deg, #34d399 0%, #059669 100%)" },
  ];

  const groupedMenu = phases.map(phase => {
    const items = menuSelloutPage?.filter(item => item.phase === phase.id) || [];
    return { ...phase, items };
  });

  return (
    <HeaderWrapper>
      <TitleSection>
        <Tooltip title="Ir al inicio (Sellout Mercado)">
          <HomeButton onClick={handleGoHome}>
            <HomeIcon sx={{ fontSize: 24 }} />
          </HomeButton>
        </Tooltip>

        <VerticalDivider />

        <Box>
          <TitleText>{title}</TitleText>
          <InfoText component="div">
            {menuSellout ? (
              <InteractiveTrigger
                active={Boolean(anchorEl)}
                onClick={handleClick}
              >
                {nameInfo || "Ver Fases"}
                <Icons.KeyboardArrowDown className="MUI-chevron" sx={{ fontSize: "16px" }} />
              </InteractiveTrigger>
            ) : (
              nameInfo || ""
            )}

            {menuSellout && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    sx: {
                      borderRadius: "16px",
                      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
                      border: "1px solid rgba(0, 0, 0, 0.06)",
                      mt: 1.5,
                      width: "360px",
                      maxHeight: "500px",
                      overflowY: "auto",
                      padding: "4px 0",
                      "&::-webkit-scrollbar": {
                        width: "6px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(0,0,0,0.1)",
                        borderRadius: "4px",
                      },
                    }
                  }
                }}
              >
                {/* Menu Items Grouped by Phase */}
                {groupedMenu.map((phase, phaseIdx) => {
                  if (phase.items.length === 0) return null;

                  return (
                    <Box key={phase.id} sx={{ mb: phaseIdx < groupedMenu.length - 1 ? 1.5 : 0 }}>
                      {/* Phase Header Label */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          px: 2.5,
                          py: 1,
                          backgroundColor: alpha(phase.color, 0.03),
                          borderTop: phaseIdx > 0 ? "1px solid rgba(0, 0, 0, 0.03)" : "none",
                        }}
                      >
                        <Box
                          sx={{
                            background: phase.gradient,
                            color: "white",
                            borderRadius: "12px",
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            px: 1.2,
                            py: 0.3,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                          }}
                        >
                          Fase {phase.id}
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: phase.color,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                          }}
                        >
                          {phase.name}
                        </Typography>
                      </Box>

                      {/* Phase Items List */}
                      <Box sx={{ px: 1.5, mt: 0.5 }}>
                        {phase.items.map((item, itemIdx) => {
                          const itemHasPermission = hasPermission(item.name_server);
                          const isSelected = selectMenu && item.id === selectMenu.id && (item.tab ?? 0) === (selectMenu.tab ?? 0);

                          return (
                            <MenuItem
                              key={`${item.id}-${item.tab}-${itemIdx}`}
                              onClick={() => {
                                if (itemHasPermission) {
                                  dispatch(handleMenu(item));
                                  handleClose();
                                }
                              }}
                              sx={{
                                borderRadius: "10px",
                                mb: 0.5,
                                py: 1,
                                px: 1.5,
                                ml: item.secondary ? 3 : 0,
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                border: isSelected
                                  ? `2px solid ${phase.color}`
                                  : "2px solid transparent",
                                backgroundColor: isSelected
                                  ? alpha(phase.color, 0.04)
                                  : "transparent",
                                transition: "all 0.2s ease-in-out",
                                opacity: itemHasPermission ? 1 : 0.2,
                                filter: itemHasPermission ? "none" : "grayscale(90%)",
                                cursor: itemHasPermission ? "pointer" : "not-allowed",
                                "&:hover": itemHasPermission ? {
                                  backgroundColor: isSelected ? alpha(phase.color, 0.07) : "rgba(0, 0, 0, 0.02)",
                                  "& .icon-container": {
                                    transform: "scale(1.05)",
                                    boxShadow: `0 4px 10px ${alpha(phase.color, 0.12)}`,
                                  }
                                } : {
                                  backgroundColor: "transparent",
                                },
                              }}
                            >
                              {/* Item Icon container */}
                              <Box
                                className="icon-container"
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: isSelected
                                    ? phase.gradient
                                    : itemHasPermission
                                      ? alpha(phase.color, 0.08)
                                      : "#f1f5f9",
                                  border: isSelected
                                    ? "none"
                                    : `1px solid ${itemHasPermission ? alpha(phase.color, 0.15) : "#e2e8f0"}`,
                                  transition: "all 0.2s ease",
                                }}
                              >
                                {renderMenuIcon(item.icon, phase.color, isSelected, itemHasPermission)}
                              </Box>

                              {/* Item Info */}
                              <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0 }}>
                                <Tooltip title={itemHasPermission ? "" : "Sin acceso"}>
                                  <Typography
                                    sx={{
                                      fontSize: "0.82rem",
                                      fontWeight: isSelected ? 700 : 500,
                                      color: itemHasPermission ? "#334155" : "#000000ff",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis"
                                    }}
                                  >
                                    {item.name}
                                  </Typography>
                                </Tooltip>
                                {item.nameInfo && (
                                  <Typography
                                    sx={{
                                      fontSize: "0.7rem",
                                      color: isSelected ? "#475569" : (itemHasPermission ? "#64748B" : "#cbd5e1"),
                                      mt: 0.2,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis"
                                    }}
                                  >
                                    {item.nameInfo}
                                  </Typography>
                                )}
                              </Box>

                              {/* Status / Permission Indicators */}
                              {!itemHasPermission ? (
                                <Tooltip title="No tiene permisos para acceder a esta opción" arrow>
                                  <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                                    <Icons.LockOutlined sx={{ fontSize: 16, color: "#94a3b8" }} />
                                  </Box>
                                </Tooltip>
                              ) : isSelected ? (
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    backgroundColor: phase.color,
                                    ml: "auto",
                                    animation: "pulse 2s infinite",
                                    "@keyframes pulse": {
                                      "0%": {
                                        transform: "scale(0.8)",
                                        boxShadow: `0 0 0 0 ${alpha(phase.color, 0.4)}`,
                                      },
                                      "70%": {
                                        transform: "scale(1.2)",
                                        boxShadow: `0 0 0 6px ${alpha(phase.color, 0)}`,
                                      },
                                      "100%": {
                                        transform: "scale(0.8)",
                                        boxShadow: `0 0 0 0 ${alpha(phase.color, 0)}`,
                                      },
                                    }
                                  }}
                                />
                              ) : null}
                            </MenuItem>
                          );
                        })}
                      </Box>
                    </Box>
                  );
                })}
              </Menu>
            )}
          </InfoText>
        </Box>
      </TitleSection>

      {nameButton && (
        <ActionButton variant="contained" onClick={onClick} disableElevation>
          {nameButton}
        </ActionButton>
      )}
    </HeaderWrapper>
  );
};

export default AtomTitleComponent;