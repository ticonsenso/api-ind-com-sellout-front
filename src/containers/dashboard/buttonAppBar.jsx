import React from "react";
import AppBar from "@mui/material/AppBar";
import {
  Box,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { handleMenu } from "../../redux/navigatorSlice.js";
import { useDispatch, useSelector } from "react-redux";

const ButtonAppBar = () => {
  const person = useSelector((state) => state.auth.auth.person || {});
  const rolSelected = useSelector((state) => state.auth.auth.rolSelected || {});
  const dispatch = useDispatch();

  const theme = useTheme();

  return (
    <Box>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#F5F6F7", boxShadow: 3 }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => dispatch(handleMenu())}
          >
            <MenuIcon sx={{ color: "#6b6b6b" }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: theme.palette.primary.main }}
          ></Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              size="large"
              color="primary"
              sx={{
                flexGrow: 1,
                pr: 2,
                backgroundColor: "transparent",
              }}
            ></IconButton>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 2, mt: 2, mb: 2 }}
            />
            <IconButton sx={{ p: 0 }}>
              <Avatar
                src={person.image}
                alt={person.name}
                sx={{ backgroundColor: "#cccccc" }}
              >
                {!person.image && person.name
                  ? person.name.charAt(0).toUpperCase()
                  : "J"}
              </Avatar>
            </IconButton>
            <Typography
              sx={{
                color: "#6b6b6b",
                fontSize: 12,
                fontWeight: 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                textTransform: "uppercase",
              }}
            >
              {person.name}
              <span style={{ fontSize: 12, fontWeight: 400 }}>
                {rolSelected.name}
              </span>
            </Typography>
            {/* <IconButton sx={{ p: 0 }}>
              <KeyboardArrowDownIcon />
            </IconButton> */}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default ButtonAppBar;
