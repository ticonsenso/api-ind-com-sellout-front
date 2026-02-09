import React, { useState } from "react";
import { Box, Tab, Tabs, styled, alpha } from "@mui/material";

const TabsContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 100,
  left: 0,
  right: 0,
  textAlign: "center",
  zIndex: 10,
  padding: "3px",
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(50px)",
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0,0,0,0.05)",
  borderRadius: "50px",
  marginBottom: 1,
  display: "flex",
  justifyContent: "center",
  width: "fit-content",
  margin: "0 auto 0px auto",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 5px 5px rgba(0, 114, 206, 0.15)",
    transform: "translateY(-2px)",
    border: "1px solid rgba(0, 114, 206, 0.3)",
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  borderRadius: "40px",
  fontSize: "0.95rem",
  fontWeight: 600,
  minHeight: "44px",
  padding: "0 20px",
  margin: "0 4px",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  color: "#64748B",
  position: "relative",
  overflow: "hidden",
  zIndex: 1,
  "&.Mui-selected": {
    color: "#fff",
    background: "linear-gradient(135deg, #0072CE 0%, #00c6ff 100%)", // Vibrant Gradient
    boxShadow: "0 3px 3px rgba(0, 114, 206, 0.4)",
    "&::after": {
      opacity: 1,
    }
  },
  "&:hover:not(.Mui-selected)": {
    color: "#0072CE",
    background: "rgba(0, 114, 206, 0.05)",
    transform: "translateY(-1px)",

  },
  "&::after": {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(rgba(255,255,255,0.2), transparent)',
    opacity: 0,
    transition: 'opacity 0.3s',
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