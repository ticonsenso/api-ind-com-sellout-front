import React from "react";
import { Box, IconButton, Tooltip, useTheme, Menu, MenuItem, ListItemIcon, ListItemText, Typography, Fade, alpha } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useDispatch, useSelector } from "react-redux";
import { handleMenu } from "../../redux/navigatorSlice.js";
import MenuIcon from "@mui/icons-material/Menu";
import { usePermission } from "../../context/PermisosComtext";
import * as Icons from "@mui/icons-material";
import styles from "./styles";

// Import SVGs
import InicioIcon from "../../assets/inicio.svg";
import PoliticasIcon from "../../assets/politicas.svg";
import UsuariosIcon from "../../assets/usuarios.svg";
// Fallbacks or others if they exist
import LogoutIcon from "@mui/icons-material/Logout";
import { actionLogoutReducer } from "../../redux/authSlice.js";
import { useNavigate } from "react-router-dom";

const iconMapping = {
  InicioIcon,
  PoliticasIcon,
  UsuariosIcon,
  // Mapping missing ones to null or MUI icons in renderIcon
};

const isChildSelected = (item, selectedId) => {
  if (!item || selectedId === undefined || selectedId === null) return false;
  if (String(item.id) === String(selectedId)) return true;
  if (item.subMenu) {
    return item.subMenu.some(sub => isChildSelected(sub, selectedId));
  }
  return false;
};

const StyledMenu = ({ anchorEl, open, onClose, items, renderIcon, onItemClick, theme, activeItem, onBack, selectedItem, namePermission }) => {
  const isNested = activeItem?.isNested;

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      TransitionComponent={Fade}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          sx: {
            ml: 1.5,
            minWidth: 240,
            borderRadius: "16px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
            border: "1px solid rgba(0,0,0,0.06)",
            padding: "8px",
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 18,
              left: -6,
              width: 12,
              height: 12,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderLeft: "1px solid rgba(0,0,0,0.06)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            },
          }
        }
      }}
    >
      {activeItem && (
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.04)', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          {isNested && (
            <IconButton
              size="small"
              onClick={onBack}
              sx={{ ml: -1, color: "rgba(0,0,0,0.4)" }}
            >
              <Icons.ArrowBackIosNew sx={{ fontSize: 14 }} />
            </IconButton>
          )}
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {activeItem.name}
          </Typography>
        </Box>
      )}
      {items?.map((subItem) => {
        const isSubItemActive = isChildSelected(subItem, selectedItem?.id);
        const hasPermission = subItem.name_server ? namePermission(subItem.name_server) : true;
        
        if (!hasPermission) return null;

        return (
          <MenuItem
            key={subItem.name}
            onClick={() => onItemClick(subItem)}
            sx={{
              borderRadius: "10px",
              mb: 0.5,
              py: 1.2,
              px: 1.5,
              backgroundColor: isSubItemActive ? "rgba(0, 0, 0, 0.04)" : "transparent",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: isSubItemActive ? "rgba(0, 0, 0, 0.06)" : "rgba(0, 0, 0, 0.03)",
                "& .MUI-icon": {
                  color: theme.palette.details.main,
                  transform: "scale(1.1)",
                },
                "& .MUI-chevron": {
                  transform: "translateX(3px)",
                  color: theme.palette.details.main,
                }
              }
            }}
          >
            <ListItemIcon
              className="MUI-icon"
              sx={{
                minWidth: 38,
                color: isSubItemActive ? theme.palette.details.main : "rgba(0,0,0,0.4)",
                transition: "all 0.2s"
              }}
            >
              {renderIcon(subItem.icon, subItem.name, isSubItemActive, true)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: isSubItemActive ? 600 : 500,
                    color: isSubItemActive ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.75)"
                  }}
                >
                  {subItem.name}
                </Typography>
              }
            />
            {subItem.subMenu && subItem.subMenu.length > 0 && (
              <ChevronRightIcon className="MUI-chevron" sx={{ fontSize: 18, color: "rgba(0,0,0,0.2)", transition: "all 0.2s" }} />
            )}
          </MenuItem>
        );
      })}
    </Menu>
  );
};

const SideBarIcons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const namePermission = usePermission();
  const menuItems = useSelector((state) => state.navigator.initialStateMenu);
  const token = useSelector((state) => state.auth.auth.token);

  const selectedItem = useSelector((state) => state.navigator.selectMenu);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeItem, setActiveItem] = React.useState(null);
  const [menuHistory, setMenuHistory] = React.useState([]);
  const menuOpen = Boolean(anchorEl);

  const handleOpenSubMenu = (event, item) => {
    setAnchorEl(event.currentTarget);
    setActiveItem(item);
    setMenuHistory([]);
  };

  const handleCloseSubMenu = () => {
    setAnchorEl(null);
    setActiveItem(null);
    setMenuHistory([]);
  };

  const handleBack = () => {
    if (menuHistory.length > 0) {
      const prevItem = menuHistory[menuHistory.length - 1];
      setActiveItem(prevItem);
      setMenuHistory(menuHistory.slice(0, -1));
    }
  };

  const handleItemClick = (item) => {
    if (item.subMenu && item.subMenu.length > 0) {
      setMenuHistory([...menuHistory, activeItem]);
      setActiveItem({ ...item, isNested: true });
    } else {
      dispatch(handleMenu(item));
      if (item.url) navigate(item.url);
      if (item.redirect && item.redirect !== "/") navigate(item.redirect);
      handleCloseSubMenu();
    }
  };

  const handleLogout = () => {
    const logoutUrl = import.meta.env.VITE_API_URL + `api/auth/saml/logout?token=${token}`;
    const logoutWindow = window.open("", "_blank", "width=300,height=300");
    logoutWindow.document.write("<h1>Cerrando sesión...</h1>");

    setTimeout(() => {
      logoutWindow.location.href = logoutUrl;
      setTimeout(() => {
        logoutWindow.close();
        dispatch(actionLogoutReducer());
        navigate("/");
      }, 1000);
    }, 500);
  };

  const renderIcon = (iconName, itemName, isActive, isMenuIcon = false) => {
    const defaultColor = isMenuIcon ? "rgba(0,0,0,0.6)" : "#0072CE"; // Changed to Corporate Blue
    const color = isActive ? "#F39400" : defaultColor;

    // Updated filters for Blue (#0072CE) and Orange (#F39400)
    let filter = isActive
      ? "invert(58%) sepia(93%) saturate(1541%) hue-rotate(1deg) brightness(102%) contrast(105%)" // Orange
      : "invert(28%) sepia(95%) saturate(1966%) hue-rotate(193deg) brightness(91%) contrast(101%)"; // Corporate Blue

    if (isMenuIcon && !isActive) {
      filter = "none";
    }

    if (iconName?.startsWith("mui:") && Icons[iconName.replace("mui:", "")]) {
      return React.createElement(Icons[iconName.replace("mui:", "")], { sx: { color, fontSize: isMenuIcon ? 20 : 22 } });
    } else if (iconName?.startsWith("svg:") && iconMapping[iconName.replace("svg:", "")]) {
      return (
        <img
          src={iconMapping[iconName.replace("svg:", "")]}
          alt={itemName}
          width={isMenuIcon ? 20 : 22}
          height={isMenuIcon ? 20 : 22}
          style={{ filter }}
        />
      );
    }
    return <Icons.Circle sx={{ color, fontSize: isMenuIcon ? 10 : 12 }} />;
  };

  const isDrawerOpen = useSelector((state) => state.navigator.state);

  return (
    <Box sx={{
      ...styles.sidebarIcons,
      width: isDrawerOpen ? 0 : "70px",
      overflow: "hidden",
      padding: isDrawerOpen ? 0 : "24px 0",
      backgroundColor: "#E2E8F0",
      boxShadow: isDrawerOpen ? "none" : "4px 0 15px rgba(0,0,0,0.05)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: isDrawerOpen ? 0 : 1,
      pointerEvents: isDrawerOpen ? "none" : "auto",
    }}>
      <Tooltip title="Menú" placement="right">
        <IconButton
          onClick={() => dispatch(handleMenu())}
          sx={{
            color: "#0072CE", // Corporate Blue
            mb: 1,
            backgroundColor: "#ffffffff",
            boxShadow: "0 2px 8px rgba(0,114,206,0.2)",
            "&:hover": {
              backgroundColor: "#F1F5F9",
              transform: "rotate(90deg)",
              color: "#F39400"
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          <MenuIcon />
        </IconButton>
      </Tooltip>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        alignItems: 'center',
        width: '100%',
        overflowY: 'auto',
        py: 1,
        // Hide scrollbar
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}>
        {menuItems?.map((item) => {
          const isActive = isChildSelected(item, selectedItem?.id);
          const hasPermission = item.name_server ? namePermission(item.name_server) : true;

          if (!hasPermission) return null;

          return (
            <Tooltip key={item.name} title={item.name} placement="right">
              <IconButton
                onClick={(e) => {
                  if (item.subMenu && item.subMenu.length > 0) {
                    handleOpenSubMenu(e, item);
                  } else {
                    dispatch(handleMenu(item));
                    if (item.url) navigate(item.url);
                    if (item.redirect && item.redirect !== "/") navigate(item.redirect);
                  }
                }}
                sx={{
                  color: isActive ? "#F39400" : "#0072CE",
                  backgroundColor: "#FFFFFF",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: "14px",
                  width: "46px",
                  height: "46px",
                  position: "relative",
                  boxShadow: isActive
                    ? "0 4px 12px rgba(243, 148, 0, 0.25)"
                    : "0 2px 6px rgba(0,0,0,0.05)",
                  "&::after": isActive ? {
                    content: '""',
                    position: "absolute",
                    left: -14,
                    width: "6px",
                    height: "32px",
                    backgroundColor: "#F39400",
                    borderRadius: "0 6px 6px 0",
                    boxShadow: "0 0 14px rgba(243, 148, 0, 0.6)",
                    zIndex: 10
                  } : {},
                  "&:hover": {
                    backgroundColor: "#F8FAFC",
                    transform: isActive ? "scale(1)" : "scale(1.1) translateY(-2px)",
                    boxShadow: "0 6px 15px rgba(0,114,206,0.15)"
                  }
                }}
              >
                {renderIcon(item.icon, item.name, isActive)}
              </IconButton>
            </Tooltip>
          );
        })}
      </Box>

      <StyledMenu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseSubMenu}
        items={activeItem?.subMenu}
        renderIcon={renderIcon}
        onItemClick={handleItemClick}
        onBack={handleBack}
        activeItem={activeItem}
        selectedItem={selectedItem}
        theme={theme}
        namePermission={namePermission}
      />

      <Tooltip title="Cerrar sesión" placement="right">
        <IconButton
          onClick={handleLogout}
          sx={{
            color: "#EF4444", // Red for Logout
            mb: 4,
            mt: 0,
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            "&:hover": {
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#DC2626",
              transform: "scale(1.1)"
            },
            transition: "all 0.3s"
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default SideBarIcons;
