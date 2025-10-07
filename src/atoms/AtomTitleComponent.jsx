import { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { handleMenu } from "../redux/navigatorSlice.js";
import { menuSelloutPage } from "../containers/dashboard/data.js";
const AtomTitleComponent = ({
  title,
  nameButton,
  onClick,
  menuSellout,
  nameInfo,
}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "left",
        justifyContent: "space-between",
        textAlign: "left",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          justifyContent: "left",
          textAlign: "left",
          pt: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "20px",
            color: "textSecondary.main",
            fontWeight: 600,
            textAlign: "left",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontSize: "14px",
            color: "primary.main",
            fontWeight: 400,
            textAlign: "left",
            mb: 2.5,
          }}
        >
          {" "}
          {nameInfo || ""}
          {menuSellout && (
            <Box>
              <Tooltip title="Menu Sellout">
                <IconButton onClick={handleClick}>
                  <NavigateNextIcon color="primary" sx={{ fontSize: "17px" }} />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {menuSelloutPage?.map((title, index) => (
                  <MenuItem
                    sx={{
                      fontSize: "14px",
                      margin: "3px",
                      borderRadius: "5px",
                      border: "none",
                      color: "text.secondary",
                      textAlign: "left",
                    }}
                    key={index}
                    onClick={() => {
                      dispatch(handleMenu(title));
                      handleClose();
                    }}
                  >
                    {index + 1}: {title.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Typography>
      </Box>
      {nameButton && (
        <Button
          variant="contained"
          onClick={onClick}
          sx={{
            marginBottom: "20px",
            minWidth: "150px",
            fontWeight: 300,
            height: "40px",
            fontSize: "13px",
            backgroundColor: "primary.main",
            textTransform: "none",
            color: "#FFFFFF",
            "&:hover": {
              color: "#FFFFFF",
            },
          }}
        >
          {nameButton}
        </Button>
      )}
    </Box>
  );
};

export default AtomTitleComponent;