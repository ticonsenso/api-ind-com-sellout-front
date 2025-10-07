import React from "react";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { Box } from "@mui/material";
import ExtraccionDatos from "./extraccion/extraccion";
import TabGestionGeneral from "../../atoms/AtomContentTab";
import ConfiguracionExtraccion from "./extraccion/configExtraccion";

const Config1 = () => {
  const tabs = [
    {
      label: "Extracción de datos",
      component: <ExtraccionDatos key="lista" />,
    },
    {
      label: "Configuración de extracción",
      component: <ConfiguracionExtraccion key="configuracion" />,
    },
  ];

  return (
    <AtomContainerGeneral
      children={
        <Box>
          <TabGestionGeneral tabs={tabs} />
        </Box>
      }
    />
  );
};

export default Config1;
