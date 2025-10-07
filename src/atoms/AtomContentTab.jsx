import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";

const TabGestionGeneral = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          flexDirection: "column",
          position: "sticky",
          zIndex: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          centered
          indicatorColor="#5850EC"
          textColor="white"
          sx={{
            marginLeft: 2,
            mt: 0,
            mb: 1,
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
                marginRight: 2,
                border: activeTab === index ? "none" : "1px solid #A4A7CE",
                backgroundColor: activeTab === index ? "primary.main" : "white",
                color: activeTab === index ? "white" : "#A4A7CE",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor:
                    activeTab === index ? "primary.main" : "#f5f5f5",
                  color: activeTab === index ? "white" : "primary.main",
                },
              }}
            />
          ))}
        </Tabs>
        {tabs[activeTab]?.component}
      </Box>
    </>
  );
};

export default TabGestionGeneral;