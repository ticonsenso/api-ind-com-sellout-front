import React, { useState } from "react";
import { Box, Tab, Tabs, styled, alpha } from "@mui/material";

const TabsContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 95,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1000,
  padding: "6px",
  background: "rgba(255, 255, 255, 0.75)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)", // For Safari
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  borderRadius: "100px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  display: "flex",
  alignItems: "center",
  width: "max-content",
  maxWidth: "calc(100% - 48px)",
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
    transform: "translateX(-50%) translateY(-2px)",
    background: "rgba(255, 255, 255, 0.85)",
  },
  [theme.breakpoints.down("sm")]: {
    top: 85,
    borderRadius: "24px",
    maxWidth: "92%",
    padding: "4px",
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  borderRadius: "100px",
  fontSize: "0.875rem",
  fontWeight: 500,
  minHeight: "40px",
  padding: "0 24px",
  margin: "0 2px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  color: "#475569", // Slate-600 for better elegance
  position: "relative",
  letterSpacing: "0.01em",
  "&.Mui-selected": {
    color: "#fff !important",
    background: "#0072CE", // Solid primary
    boxShadow: "0 4px 14px rgba(0, 114, 206, 0.35)",
    fontWeight: 600,
  },
  "&:hover:not(.Mui-selected)": {
    color: "#0072CE",
    background: "rgba(0, 114, 206, 0.06)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "0 16px",
    fontSize: "0.8125rem",
    minHeight: "36px",
  }
}));

const TabGestionGeneral = ({ tabs, num = 0 }) => {
  const [activeTab, setActiveTab] = useState(num);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <TabsContainer>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          TabIndicatorProps={{
            style: { display: "none" }
          }}
          sx={{
            minHeight: "40px",
            "& .MuiTabs-flexContainer": {
              justifyContent: { xs: "flex-start", md: "center" },
              gap: "4px"
            },
            "& .MuiTabs-scroller": {
              display: "flex",
              alignItems: "center",
            },
             "& .MuiTabs-scrollButtons": {
                color: "#94a3b8", // Subtler arrow colors
                width: 32,
                transition: "color 0.2s",
                "&:hover": { color: "#0072CE" },
                "&.Mui-disabled": {
                    opacity: 0.15
                }
             },
             [({ theme }) => theme.breakpoints.down("sm")]: {
                minHeight: "36px",
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
      </TabsContainer>

      <Box sx={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        paddingTop: { xs: '145px', sm: '155px' },
        px: { xs: 2, sm: 4 }, // Added side padding for more breathing room
        maxWidth: "1600px", // Limit width for very large monitors
        margin: "0 auto",
        width: "100%",
      }}>
        {tabs[activeTab]?.component}
      </Box>
    </>
  );
};

export default TabGestionGeneral;