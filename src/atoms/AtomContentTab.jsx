import React, { useState } from "react";
import { Box, Tab, Tabs, styled, alpha } from "@mui/material";

const TabsContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 98,
  left: 0,
  right: 0,
  textAlign: "center",
  zIndex: 1000,
  padding: "4px",
  backgroundColor: "#ffffffcc",
  backdropFilter: "blur(12px)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  borderRadius: "32px",
  width: "fit-content",
  margin: "0 auto",
  border: "1px solid rgba(0, 114, 206, 0.12)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 6px 16px rgba(0, 114, 206, 0.1)",
    backgroundColor: "#ffffffff",
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  borderRadius: "28px",
  fontSize: "0.875rem",
  fontWeight: 600,
  minHeight: "38px",
  padding: "0 20px",
  margin: "0 2px",
  transition: "all 0.2s ease-in-out",
  color: "#64748b",
  "&.Mui-selected": {
    color: "#fff",
    backgroundColor: "#0072CE", // Simple solid corporate blue
    boxShadow: "0 2px 8px rgba(0, 114, 206, 0.25)",
  },
  "&:hover:not(.Mui-selected)": {
    color: "#0072CE",
    backgroundColor: "rgba(0, 114, 206, 0.05)",
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
          centered
          TabIndicatorProps={{
            style: { display: "none" }
          }}
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: "center",
              gap: "8px"
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
        animation: 'fadeIn 0.5s ease-out',
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      }}>
        {tabs[activeTab]?.component}
      </Box>
    </>
  );
};

export default TabGestionGeneral;