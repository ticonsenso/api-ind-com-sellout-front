
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { Box } from "@mui/material";
import ExtraccionDatos from "./extraccion/extraccion";
import TabGestionGeneral from "../../atoms/AtomContentTab";
import ConfiguracionExtraccion from "./extraccion/configExtraccion";
import ListaCategorias from "./diccionario/lista";
import { useSelector, } from "react-redux";

const Config1 = () => {

  const currentTab = useSelector(state => state.navigator?.currentTab || 0);


  const tabs = [
    {
      label: "Extracción de datos",
      component: <ExtraccionDatos key="lista" />,
    },
    {
      label: "Configuración de extracción",
      component: <ConfiguracionExtraccion key="configuracion" />,
    },
    {
      label: "Diccionario",
      component: <ListaCategorias key="configuracion" />,
    },
  ];

  return (
    <AtomContainerGeneral
      children={
        <Box>
          <TabGestionGeneral tabs={tabs} num={currentTab} />
        </Box>
      }
    />
  );
};

export default Config1;
