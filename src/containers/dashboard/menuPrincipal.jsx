import React, { useEffect, useState } from "react";
import { Box, Collapse, Typography, styled, alpha } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { handleMenu } from "../../redux/navigatorSlice.js";
import { useNavigate } from "react-router-dom";
import InicioIcon from "../../assets/inicio.svg";
import Logo from "../../assets/logoComplete.svg";
import { actionLogoutReducer } from "../../redux/authSlice.js";
import { ArrowForwardIos as ArrowForwardIosIcon } from "@mui/icons-material";
import * as Icons from "@mui/icons-material";

const iconMapping = {
  InicioIcon,
};

const GlassDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    background: "linear-gradient(180deg, #073861ff 0%, #005a9c 100%)", // Brand Primary Blue
    backdropFilter: "blur(20px)",
    color: "#ffffff",
    width: "280px",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "10px 0 30px rgba(0, 0, 0, 0.2)",
    overflowX: "hidden",
    "::-webkit-scrollbar": {
      width: "6px",
    },
    "::-webkit-scrollbar-thumb": {
      background: "rgba(255, 255, 255, 0.2)",
      borderRadius: "3px",
    },
  },
}));

const LogoArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "10%",
    width: "80%",
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.92), transparent)",
  }
}));

const LogoVisual = styled("div")(({ theme }) => ({
  position: "relative",
  width: "180px",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "transform 0.5s ease",
  "&:hover": {
    transform: "scale(1.05)",
    "& .glow": {
      transform: "translate(-50%, -50%) scale(1.2)",
    },
    "& img": {
      filter: "drop-shadow(0 0 12px rgba(255,255,255,0.6))",
    }
  },
}));

const LogoGlow = styled("div")({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  transition: "all 0.5s ease",
  className: "glow",
  pointerEvents: "none",
});

const LogoImg = styled("img")({
  width: "100%",
  height: "auto",
  maxHeight: "60px",
  position: "relative",
});

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  margin: "4px 12px",
  borderRadius: "12px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  borderLeft: active ? `4px solid #F39400` : "4px solid transparent", // Orange accent
  background: active
    ? "linear-gradient(90deg, rgba(0, 114, 206, 0.2) 0%, rgba(0, 114, 206, 0.05) 100%)" // Blue tint
    : "transparent",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.08)",
    transform: "translateX(4px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    "& .MuiListItemIcon-root": {
      color: "#F39400",
      transform: "scale(1.1)",
    },
  },
  "& .MuiTypography-root": {
    fontWeight: active ? 600 : 400,
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.9rem",
    color: active ? "#ffffff" : "#a8b2d1",
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ active }) => ({
  minWidth: "40px",
  color: active ? "#F39400" : "#8892b0",
  transition: "all 0.3s ease",
}));

const MenuIndex = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.navigator.state);
  const initialStateMenu = useSelector(
    (state) => state.navigator.initialStateMenu
  );
  const selectedItem = useSelector((state) => state.navigator.selectMenu);
  const userPermissions = useSelector((state) => state.auth.auth.permisos);
  const token = useSelector((state) => state.auth.auth.token);
  const [expandedMenus, setExpandedMenus] = useState({});
  const cerrarSesionAutomatico = localStorage.getItem('logout');

  const toggleSubMenu = (name) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const filterMenuByPermissions = (menuItems) => {
    return menuItems
      .map((item) => {
        const hasPermission = userPermissions?.some(
          (perm) => perm.name === item.name_server
        );

        let filteredSubMenu = item.subMenu
          ? filterMenuByPermissions(item.subMenu)
          : [];

        if (hasPermission || filteredSubMenu.length > 0) {
          return {
            ...item,
            subMenu: filteredSubMenu,
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  const filteredMenu = filterMenuByPermissions(initialStateMenu) || [];

  const handleLogout = () => {
    const logoutUrl =
      import.meta.env.VITE_API_URL + `api/auth/saml/logout?token=${token}`;

    const logoutWindow = window.open("", "_blank", "width=300,height=300");

    if (!logoutWindow) {
      window.location.href = logoutUrl;
      dispatch(actionLogoutReducer());
      navigate("/");
      localStorage.clear();
      return;
    }

    logoutWindow.document.write("<h1>Cerrando sesión...</h1>");
    logoutWindow.document.write(
      "<p>Por favor espere, estamos procesando su solicitud.</p>"
    );

    setTimeout(() => {
      logoutWindow.location.href = logoutUrl;
      setTimeout(() => {
        logoutWindow.close();
        dispatch(actionLogoutReducer());
        navigate("/");
        localStorage.clear();
      }, 1000);
    }, 500);
  };

  useEffect(() => {
    if (cerrarSesionAutomatico) {
      handleLogout();
    }
  }, [cerrarSesionAutomatico]);

  const renderMenuItems = (items, level = 0) =>
    items?.map((item) => {
      const hasSubMenu = item.subMenu?.length > 0;
      const isExpanded = expandedMenus[item.name] || false;
      const isActive = selectedItem?.name === item.name;

      return (
        <React.Fragment key={item.id || item.name}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <StyledListItemButton
              active={isActive ? 1 : 0}
              sx={{ pl: level * 3 + 2 }} // Indentation for submenus
              onClick={() => {
                if (hasSubMenu) {
                  toggleSubMenu(item.name);
                  if (item.id) {
                    dispatch(handleMenu({ ...item, thirdMenu: true }));
                  }
                } else {
                  dispatch(handleMenu({ ...item, thirdMenu: true }));
                  if (item.url) navigate(item.url);
                }
              }}
            >
              <StyledListItemIcon active={isActive ? 1 : 0}>
                {item.icon?.startsWith("mui:") &&
                  Icons[item.icon.replace("mui:", "")] ? (
                  React.createElement(Icons[item.icon.replace("mui:", "")])
                ) : item.icon?.startsWith("svg:") &&
                  iconMapping[item.icon.replace("svg:", "")] ? (
                  <img
                    src={iconMapping[item.icon.replace("svg:", "")]}
                    alt={item.name}
                    width={22}
                    height={22}
                    style={{ filter: isActive ? "none" : "grayscale(100%) opacity(0.7)" }}
                  />
                ) : null}
              </StyledListItemIcon>

              <ListItemText primary={item.name} />

              {hasSubMenu && (
                <ArrowForwardIosIcon
                  sx={{
                    fontSize: "12px",
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                    color: isActive ? "#F39400" : "#8892b0",
                  }}
                />
              )}
            </StyledListItemButton>
          </ListItem>

          {hasSubMenu && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ background: "rgba(0,0,0,0.2)" }}>
                {renderMenuItems(item.subMenu, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });

  const list = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <LogoArea>
        <LogoVisual>
          <LogoGlow className="glow" />
          <LogoImg src={Logo} alt="Indurama" />
        </LogoVisual>
      </LogoArea>

      <List sx={{ flexGrow: 1, px: 1 }}>
        {renderMenuItems(filteredMenu)}
      </List>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 2 }} />
        <StyledListItemButton onClick={handleLogout}>
          <StyledListItemIcon>
            <LogoutIcon />
          </StyledListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </StyledListItemButton>
      </Box>
    </Box>
  );

  return (
    <GlassDrawer
      anchor={"left"}
      open={state}
      onClose={() => dispatch(handleMenu())}
    >
      {list()}
    </GlassDrawer>
  );
};

export default MenuIndex;