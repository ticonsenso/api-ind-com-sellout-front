import React, { useEffect, useState } from "react";
import { Box, Collapse, Typography, styled, alpha, Avatar } from "@mui/material";
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
    background: "#ffffffff",
    color: "#475569",
    width: "320px",
    borderRight: "1px solid rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
}));

const LogoArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0),
  display: "flex",
  justifyContent: "center",
  background: "#47556980",
}));

const UserArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(2),
  background: "#FFFFFF",
  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
}));

const UserInfo = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

const UserName = styled(Typography)({
  fontSize: "0.8rem",
  fontWeight: 700,
  color: "#0072CE",
  textTransform: "uppercase",
});

const UserRole = styled(Typography)({
  fontSize: "0.7rem",
  fontWeight: 400,
  color: "#7c7c7cff",
});

const isChildSelected = (item, selectedId) => {
  if (!item || selectedId === undefined || selectedId === null) return false;
  if (String(item.id) === String(selectedId)) return true;
  if (item.subMenu) {
    return item.subMenu.some(sub => isChildSelected(sub, selectedId));
  }
  return false;
};

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})(({ theme, isSelected }) => ({
  margin: "4px 16px",
  borderRadius: "12px",
  padding: "10px 16px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  background: isSelected ? alpha("#F39400", 0.12) : "transparent",
  position: "relative",
  "&::before": isSelected ? {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: "5px",
    height: "28px",
    backgroundColor: "#F39400",
    borderRadius: "0 4px 4px 0",
    boxShadow: "0 0 12px rgba(243, 148, 0, 0.6)",
    zIndex: 10
  } : {},
  "&:hover": {
    background: isSelected ? alpha("#F39400", 0.15) : "rgba(0, 114, 206, 0.04)",
    transform: "translateX(4px)",
  },
  "& .MuiTypography-root": {
    fontWeight: isSelected ? 800 : 500,
    fontSize: "0.88rem",
    color: isSelected ? "#F39400" : "#475569",
  },
}));

const StyledListItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})(({ isSelected }) => ({
  minWidth: "38px",
  color: isSelected ? "#F39400" : "#0072CE",
  transition: "all 0.3s ease",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const MenuIndex = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.navigator.state);
  const person = useSelector((state) => state.auth.auth.person || {});
  const rolSelected = useSelector((state) => state.auth.auth.rolSelected || {});
  const initialStateMenu = useSelector((state) => state.navigator.initialStateMenu);
  const selectedItem = useSelector((state) => state.navigator.selectMenu);
  const userPermissions = useSelector((state) => state.auth.auth.permisos);
  const token = useSelector((state) => state.auth.auth.token);
  const [expandedMenus, setExpandedMenus] = useState({});
  const cerrarSesionAutomatico = localStorage.getItem('logout');

  const toggleSubMenu = (name) => {
    setOpenStates((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Reusing state for submenus
  const [openStates, setOpenStates] = useState({});
  const toggleSubmenu = (id) => {
    setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filterMenuByPermissions = (menuItems) => {
    return menuItems
      .map((item) => {
        const hasPermission = userPermissions?.some((perm) => perm.name === item.name_server);
        let filteredSubMenu = item.subMenu ? filterMenuByPermissions(item.subMenu) : [];
        if (hasPermission || filteredSubMenu.length > 0) {
          return { ...item, subMenu: filteredSubMenu };
        }
        return null;
      })
      .filter(Boolean);
  };

  const filteredMenu = filterMenuByPermissions(initialStateMenu) || [];

  const handleLogout = () => {
    const logoutUrl = import.meta.env.VITE_API_URL + `api/auth/saml/logout?token=${token}`;
    const logoutWindow = window.open("", "_blank", "width=300,height=300");
    if (!logoutWindow) {
      window.location.href = logoutUrl;
      dispatch(actionLogoutReducer());
      navigate("/");
      localStorage.clear();
      return;
    }
    logoutWindow.document.write("<h1>Cerrando sesión...</h1>");
    logoutWindow.document.write("<p>Por favor espere, estamos procesando su solicitud.</p>");
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
    if (cerrarSesionAutomatico) handleLogout();
  }, [cerrarSesionAutomatico]);

  const renderIcon = (iconName, itemName, isActive) => {
    const color = isActive ? "#F39400" : "#0072CE";
    const filter = isActive
      ? "invert(58%) sepia(93%) saturate(1541%) hue-rotate(1deg) brightness(102%) contrast(105%)"
      : "invert(28%) sepia(95%) saturate(1966%) hue-rotate(193deg) brightness(91%) contrast(101%)";

    if (iconName?.startsWith("mui:") && Icons[iconName.replace("mui:", "")]) {
      return React.createElement(Icons[iconName.replace("mui:", "")], { sx: { color, fontSize: 22 } });
    } else if (iconName?.startsWith("svg:") && iconMapping[iconName.replace("svg:", "")]) {
      return (
        <img
          src={iconMapping[iconName.replace("svg:", "")]}
          alt={itemName}
          width={22}
          height={22}
          style={{ filter }}
        />
      );
    }
    return <Icons.Circle sx={{ color, fontSize: 12 }} />;
  };

  const renderMenuItems = (items, level = 0) =>
    items?.map((item) => {
      const hasSubMenu = item.subMenu?.length > 0;
      const isOpen = openStates[item.id || item.name] || false;
      const isActive = isChildSelected(item, selectedItem?.id);

      return (
        <React.Fragment key={item.id || item.name}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <StyledListItemButton
              isSelected={isActive}
              sx={{ pl: level * 3 + 2 }}
              onClick={() => {
                if (hasSubMenu) {
                  toggleSubmenu(item.id || item.name);
                  dispatch(handleMenu({ ...item, thirdMenu: true }));
                } else {
                  dispatch(handleMenu({ ...item, thirdMenu: true }));
                  if (item.url) navigate(item.url);
                }
              }}
            >
              <StyledListItemIcon isSelected={isActive}>
                {renderIcon(item.icon, item.name, isActive)}
              </StyledListItemIcon>
              <ListItemText primary={item.name} />
              {hasSubMenu && (
                <ArrowForwardIosIcon
                  sx={{
                    fontSize: "10px",
                    transform: isOpen ? "rotate(90deg)" : "none",
                    transition: "0.3s",
                    color: isActive ? "#F39400" : "#94A3B8"
                  }}
                />
              )}
            </StyledListItemButton>
          </ListItem>
          {hasSubMenu && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
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
        <img src={Logo} alt="Indurama" style={{ width: '120px' }} />
      </LogoArea>

      <UserArea>
        <Avatar
          src={person.image}
          alt={person.name}
          sx={{
            width: 44,
            height: 44,
            backgroundColor: "#47556980",
            fontSize: "1.1rem"
          }}
        >
          {person.name ? person.name.charAt(0).toUpperCase() : "U"}
        </Avatar>
        <UserInfo>
          <UserName>{person.name}</UserName>
          <UserRole>{rolSelected.name}</UserRole>
        </UserInfo>
      </UserArea>

      <Box sx={{
        flexGrow: 1,
        overflowY: "auto",
        px: 1,
        "::-webkit-scrollbar": { width: "5px" },
        "::-webkit-scrollbar-thumb": { background: "rgba(0,0,0,0.05)", borderRadius: "10px" }
      }}>
        <List sx={{ pt: 0 }}>
          {renderMenuItems(filteredMenu)}
        </List>
      </Box>

      <Box sx={{ p: 2, mt: 'auto', borderTop: "1px solid rgba(0,0,0,0.05)", background: "#FFFFFF" }}>
        <StyledListItemButton
          onClick={handleLogout}
          sx={{
            margin: 0,
            background: "rgba(239, 68, 68, 0.05)",
            borderRadius: "12px",
            "&:hover": {
              background: "rgba(239, 68, 68, 0.1)",
              transform: "translateX(5px)"
            }
          }}
        >
          <StyledListItemIcon sx={{ minWidth: "40px" }}>
            <LogoutIcon sx={{ color: "#EF4444" }} />
          </StyledListItemIcon>
          <ListItemText
            primary="Cerrar sesión"
            primaryTypographyProps={{ sx: { fontWeight: 700, color: "#EF4444", fontSize: "0.9rem" } }}
          />
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