import React, { useState } from "react";
import { Box, Tab, Tabs, styled, alpha, useTheme } from "@mui/material";

const TabsContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: "34px",
  right: "40px",
  zIndex: 1000,
  display: "flex",
  justifyContent: "flex-end",
  pointerEvents: "none",
}));

const TabsWrapper = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.01)",
  backdropFilter: "blur(12px)",
  padding: "4px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
  width: "fit-content",
  pointerEvents: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontSize: "0.85rem",
  borderRadius: "10px",
  minWidth: "140px",
  minHeight: "38px",
  margin: "0 2px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  color: "#64748B",
  backgroundColor: "transparent",
  border: "1px solid transparent",
  zIndex: 1,
  "&.Mui-selected": {
    color: "#fff",
    backgroundColor: theme.palette.primary.main,
    boxShadow: "0 4px 12px " + alpha(theme.palette.primary.main, 0.3),
  },
  "&:hover:not(.Mui-selected)": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    color: theme.palette.primary.main,
  }
}));

const TabGestionGeneral = ({ tabs, num = 0 }) => {
  const [activeTab, setActiveTab] = useState(num);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TabsContainer>
        <TabsWrapper>
          <Tabs
            value={activeTab}
            onChange={handleChange}
            TabIndicatorProps={{
              style: { display: "none" }
            }}
            sx={{
              minHeight: "38px",
              "& .MuiTabs-flexContainer": {
                gap: "4px"
              }
            }}
          >
            {tabs.map(({ label }, index) => (
              <StyledTab
                key={label}
                label={label}
                disableRipple
              />
            ))}
          </Tabs>
        </TabsWrapper>
      </TabsContainer>

      <Box sx={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        mt: 1,
        animation: 'fadeIn 0.5s ease-out',
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      }}>
        {tabs[activeTab]?.component}
      </Box>
    </Box>
  );
};

export default TabGestionGeneral;