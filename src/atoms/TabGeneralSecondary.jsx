import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";

const TabGeneralSecondary = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Box
        sx={{
          width: "100wh",
          display: "flex",
          // mt: 8,
          flexDirection: "column",
          justifyContent: "center",
          // top: 60,
          position: "sticky",
          borderRadius: "10px",
          mb: 1,
          // zIndex: 1,
          height: "auto",
          backgroundColor: "white",
        }}
      >
        <Tabs
          value={activeTab}
          color="secondary.main"
          onChange={(_, newValue) => setActiveTab(newValue)}
          centered
          textColor="white"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#5D6FFF",
            },
          }}
        >
          {tabs.map(({ label }, index) => (
            <Tab
              key={label}
              label={label}
              sx={{
                display: "flex",
                flex: 1,
                flexDirection: "row",
                textTransform: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 400,
                color: activeTab === index ? "#5D6FFF" : "#A4A7CE",
                "&:hover": {
                  scale: 1.05,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {tabs[activeTab]?.component}
    </>
  );
};

export default TabGeneralSecondary;