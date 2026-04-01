import React, { useState } from "react";
import { Box, Tab, Tabs, styled, alpha } from "@mui/material";

const TabsContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 100,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 9,
  padding: "4px",
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(50px)",
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0,0,0,0.05)",
  borderRadius: "50px",
  marginBottom: 1,
  display: "flex",
  width: "max-content",
  maxWidth: "calc(100% - 32px)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  transition: "all 0.3s ease",
  overflow: "hidden",
  "&:hover": {
    boxShadow: "0 5px 5px rgba(0, 114, 206, 0.15)",
    transform: "translateX(-50%) translateY(-2px)",
    border: "1px solid rgba(0, 114, 206, 0.3)",
  },
  [theme.breakpoints.down("sm")]: {
    top: 85,
    borderRadius: "25px",
    maxWidth: "95%",
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
  whiteSpace: "nowrap",
  "&.Mui-selected": {
    color: "#fff",
    background: "linear-gradient(135deg, #0072CE 0%, #00c6ff 100%)",
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
  },
  [theme.breakpoints.down("sm")]: {
    padding: "0 12px",
    fontSize: "0.85rem",
    minHeight: "38px",
    margin: "0 2px",
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
            minHeight: "44px",
            "& .MuiTabs-flexContainer": {
              justifyContent: "center",
              gap: "4px"
            },
            "& .MuiTabs-scroller": {
              display: "flex",
              alignItems: "center",
            },
            "& .MuiTabs-scrollButtons": {
              color: "#0072CE",
              width: 30, // Thinner buttons
              "&.Mui-disabled": {
                opacity: 0.3
              }
            },
            [({ theme }) => theme.breakpoints.down("sm")]: {
              minHeight: "38px",
              "& .MuiTabs-flexContainer": {
                justifyContent: "flex-start", // Prefer flex-start when on mobile to allow scroll
              },
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
        },
        paddingTop: { xs: '150px', sm: '160px' } // Add padding top to account for the fixed tabs container
      }}>
        {tabs[activeTab]?.component}
      </Box>
    </>
  );
};

export default TabGestionGeneral;