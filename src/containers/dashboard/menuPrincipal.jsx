import React, { useEffect, useState } from "react";
import { Box, IconButton, Collapse } from "@mui/material";
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
import UsuariosIcon from "../../assets/usuarios.svg";
import Logo from "../../assets/logoComplete.svg";
import { setToken, actionLogoutReducer } from "../../redux/authSlice.js";
import { ArrowForwardIos as ArrowForwardIosIcon } from "@mui/icons-material";
import * as Icons from "@mui/icons-material";


const iconMapping = {
  InicioIcon,

};
import {
  obtenerOptionsEmpresas,
  setIdEmpresaSeleccionada,
} from "../../redux/empresasSlice";

const MenuIndex = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userEmpresa =
    useSelector((state) => state.auth.auth.userEmpresa) || false;
  const optionsEmpresas =
    useSelector((state) => state.empresa?.optionsEmpresas) || [];
  const empresaSeleccionada =
    useSelector((state) => state.empresa?.empresaSeleccionada) || {};
  const idEmpresaUser =
    useSelector((state) => state.auth.auth.idEmpresaSeleccionada) || null;

  useEffect(() => {
    if (optionsEmpresas.length === 0) {
      dispatch(obtenerOptionsEmpresas());
    }
  }, [optionsEmpresas]);

  const state = useSelector((state) => state.navigator.state);
  const initialStateMenu = useSelector(
    (state) => state.navigator.initialStateMenu
  );
  const selectedItem = useSelector((state) => state.navigator.selectMenu);
  const findParentMenu = (menuItems, selectedName) => {
    for (let parent of menuItems) {
      if (
        parent.subMenu &&
        parent.subMenu.some((sub) => sub.name === selectedName)
      ) {
        return parent;
      }
    }
    return null;
  };
  const userPermissions = useSelector((state) => state.auth.auth.permisos);
  const token = useSelector((state) => state.auth.auth.token);
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubMenu = (name) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  useEffect(() => {
    if (idEmpresaUser && optionsEmpresas.length > 0) {
      dispatch(setIdEmpresaSeleccionada(idEmpresaUser));
    }
  }, [idEmpresaUser, optionsEmpresas]);

  const filterMenuByPermissions = (menuItems) => {
    return menuItems
      .map((item) => {
        const hasPermission = userPermissions?.some(
          (perm) => perm.name === item.name_server
        );

        let filteredSubMenu = item.subMenu
          ? filterMenuByPermissions(item.subMenu)
          : [];

        if (userEmpresa) {
          const isIndurama = empresaSeleccionada?.label === "INDURAMA";
          const isMarcimex = empresaSeleccionada?.label === "MARCIMEX";

          if (item.name === "Indurama") {
            if (isMarcimex) return null;
            if (isIndurama) {
              filteredSubMenu =
                item.subMenu?.filter(
                  (sub) =>
                    sub.name === "Consolidado" &&
                    userPermissions?.some(
                      (perm) => perm.name === sub.name_server
                    )
                ) || [];
              return filteredSubMenu.length > 0
                ? { ...item, subMenu: filteredSubMenu }
                : null;
            }
          }

          if (item.name === "Marcimex") {
            if (isIndurama) return null;
            if (isMarcimex) {
              filteredSubMenu =
                item.subMenu?.filter((sub) =>
                  userPermissions?.some((perm) => perm.name === sub.name_server)
                ) || [];
              return filteredSubMenu.length > 0
                ? { ...item, subMenu: filteredSubMenu }
                : null;
            }
          }

          if (hasPermission || filteredSubMenu.length > 0) {
            return {
              ...item,
              subMenu: filteredSubMenu,
            };
          }

          return null;
        } else {
          if (hasPermission || filteredSubMenu.length > 0) {
            return {
              ...item,
              subMenu: filteredSubMenu,
            };
          }
          return null;
        }
      })
      .filter(Boolean);
  };

  const filteredMenu = filterMenuByPermissions(initialStateMenu) || [];

  const styles = {
    content: {
      backgroundColor: " #4c4c4c ",
      color: "white",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    listItem: {
      "&:hover": {
        backgroundColor: " #4c4c4c ",
      },
    },
    listIcon: {
      color: "white",
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      width: "30px",
      height: "30px",
    },
  };

  const handleLogout = () => {
    const logoutUrl =
      import.meta.env.VITE_API_URL + `api/auth/saml/logout?token=${token}`;

    const logoutWindow = window.open("", "_blank", "width=300,height=300");

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
      }, 1000);
    }, 500);
  };

  const renderMenuItems = (items, level = 0) =>
    items?.map((item) => {
      const hasSubMenu = item.subMenu?.length > 0;
      const isExpanded = expandedMenus[item.name] || false;

      return (
        <React.Fragment key={item.id || item.name}>
          <ListItem
            disablePadding
            sx={{
              pl: level * 2,
              color: "white",
            }}
          >
            <ListItemButton
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
              sx={{
                backgroundColor:
                  selectedItem?.name === item.name ? "#333" : "transparent",
                color: "white",
                "&:hover": {
                  backgroundColor:
                    selectedItem?.name === item.name ? "#333" : "gray",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#F39400" }}>
                {item.icon?.startsWith("mui:") &&
                Icons[item.icon.replace("mui:", "")] ? (
                  React.createElement(Icons[item.icon.replace("mui:", "")])
                ) : item.icon?.startsWith("svg:") &&
                  iconMapping[item.icon.replace("svg:", "")] ? (
                  <img
                    src={iconMapping[item.icon.replace("svg:", "")]}
                    alt={item.name}
                    width={24}
                    height={24}
                  />
                ) : null}
              </ListItemIcon>

              <ListItemText primary={item.name} />
              {hasSubMenu && (
                <ArrowForwardIosIcon
                  sx={{
                    fontSize: "15px",
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                    color: "white",
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>

          {hasSubMenu && (
            <Collapse
              sx={{ backgroundColor: " #4c4c4c " }}
              in={isExpanded}
              timeout="auto"
              unmountOnExit
            >
              <List
                component="div"
                disablePadding
                sx={{ backgroundColor: " #4c4c4c " }}
              >
                {renderMenuItems(item.subMenu, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });

  const list = () => (
    <Box sx={styles.content}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: "200px",
            height: "auto",
          }}
        />
      </Box>

      <List sx={{ flexGrow: 1, backgroundColor: " #4c4c4c " }}>
        {renderMenuItems(filteredMenu)}
      </List>

      <Divider sx={{ backgroundColor: " #4c4c4c " }} />

      <List sx={{ backgroundColor: " #4c4c4c " }}>
        <ListItem disablePadding sx={styles.listItem}>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={styles.listIcon}>
              <LogoutIcon sx={{ color: "#F39400" }} />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer anchor={"left"} open={state} onClose={() => dispatch(handleMenu())}>
      {list()}
    </Drawer>
  );
};

export default MenuIndex;
