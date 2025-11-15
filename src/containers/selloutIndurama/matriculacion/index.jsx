import ConfiguracionMatriculacion from "./configuracion";
import ListaLogsMatriculacion from "./listaLogs";
import TabGestionGeneral from "../../../atoms/AtomContentTab";
import AtomContainerGeneral from "../../../atoms/AtomContainerGeneral";
import Matriculacion from "./lista";
import { Box } from "@mui/material";
import AtomDatePicker from "../../../atoms/AtomDatePicker";
import { useSelector, useDispatch } from "react-redux";
import { setCalculateDate } from "../../../redux/configSelloutSlice";
import { usePermission } from "../../../context/PermisosComtext";
import { formatDate } from "../../constantes";

const TabGestionMatriculacion = () => {
  const dispatch = useDispatch();
  const hasPermission = usePermission();
  const namePermission = hasPermission("CONFIGURACION CIERRE SELLOUT");
  const calculateDate = useSelector(
    (state) => state?.configSellout?.calculateDate || formatDate(new Date())
  );
  const currentTab = useSelector(state => state.navigator?.currentTab || 0);

  const tabs = [
    ...(namePermission
      ? [
        {
          label: "Configuración de cierre",
          component: <ConfiguracionMatriculacion key="configuracion" />,
        },
      ]
      : []),
    {
      label: "Clientes a cargar",
      component: (
        <>
          <Box
            sx={{
              position: "fixed",
              top: 80,
              right: 115,
              zIndex: 1000,
            }}
          >
            <AtomDatePicker
              id="calculateDate"
              required={true}
              mode="month"
              label="Fecha de búsqueda"
              color="#ffffff"
              height="43px"
              value={calculateDate}
              onChange={(e) => {
                dispatch(setCalculateDate(e));
              }}
            />
          </Box>
          <Matriculacion calculateDate={calculateDate} key="matriculacion" />
        </>
      ),
    },
    {
      label: "Clientes cargados",
      component: (
        <>
          <Box
            sx={{
              position: "fixed",
              top: 80,
              right: 70,
              zIndex: 1000,
            }}
          >
            <AtomDatePicker
              id="calculateDate"
              required={true}
              mode="month"
              label="Fecha de búsqueda"
              color="#ffffff"
              height="43px"
              value={calculateDate}
              onChange={(e) => {
                dispatch(setCalculateDate(e));
              }}
            />
          </Box>
          <ListaLogsMatriculacion calculateDate={calculateDate} key="lista" />
        </>
      ),
    },
  ];

  return (
    <AtomContainerGeneral
      children={
        <>

          <TabGestionGeneral tabs={tabs} num={currentTab} />
        </>
      }
    />
  );
};

export default TabGestionMatriculacion;
