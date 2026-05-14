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
import { useDispatch, useSelector } from "react-redux";
import { handleMenu } from "../redux/navigatorSlice.js";
import { menuSelloutPage } from "../containers/dashboard/data.js";
import { useNavigate } from "react-router-dom";

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
  marginTop: "2px",
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
  const initialStateMenu = useSelector((state) => state.navigator.initialStateMenu);
  const [anchorEl, setAnchorEl] = useState(null);

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
            {nameInfo || ""}
            {menuSellout && (
              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Explorar menú">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{
                      ml: 0.5,
                      color: "#0072CE",
                      "&:hover": { backgroundColor: alpha("#0072CE", 0.05) }
                    }}
                  >
                    <NavigateNextIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      sx: {
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        border: "1px solid rgba(0,0,0,0.05)",
                        mt: 1
                      }
                    }
                  }}
                >
                  {menuSelloutPage?.map((item, index) => (
                    <MenuItem
                      sx={{
                        fontSize: "0.85rem",
                        px: 2,
                        py: 1,
                        fontWeight: 500,
                        color: "#475569",
                        "&:hover": { color: "#0072CE", backgroundColor: alpha("#0072CE", 0.03) }
                      }}
                      key={index}
                      onClick={() => {
                        dispatch(handleMenu(item));
                        handleClose();
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
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