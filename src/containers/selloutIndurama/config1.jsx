
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { Box } from "@mui/material";
import ExtraccionDatos from "./extraccion/extraccion";
import TabGestionGeneral from "../../atoms/AtomContentTab";
import ConfiguracionExtraccion from "./extraccion/configExtraccion";
import ListaCategorias from "./diccionario/lista";
import { useSelector } from "react-redux";
import { usePermission } from "../../context/PermisosComtext";
import { PERMISSIONS } from "../../constants/permissions";

const Config1 = () => {
  const hasPermission = usePermission();
  const currentTab = useSelector(state => state.navigator?.currentTab || 0);

  const tabs = [
    {
      label: "Extracción de datos",
      component: <ExtraccionDatos key="lista" />,
    },
    ...(hasPermission(PERMISSIONS.EXTRACCION.CONFIG_EXTRACCION) ? [{
      label: "Configuración de extracción",
      component: <ConfiguracionExtraccion key="configuracion" />,
    }] : []),
    ...(hasPermission(PERMISSIONS.EXTRACCION.DICCIONARIO) ? [{
      label: "Diccionario",
      component: <ListaCategorias key="diccionario" />,
    }] : []),
  ];

  return (
    <AtomContainerGeneral
      children={
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <TabGestionGeneral tabs={tabs} num={currentTab} />
        </Box>
      }
    />
  );
};

export default Config1;
