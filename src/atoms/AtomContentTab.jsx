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
          indicatorColor="#F39400"
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
                border: activeTab === index ? "none" : "1px solid #f07761ff",
                backgroundColor: activeTab === index ? "details.main" : "white",
                color: activeTab === index ? "white" : "#e68b61ff",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor:
                    activeTab === index ? "details.main" : "#fff2f2ff",
                  color: activeTab === index ? "white" : "details.main",
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