import ConfiguracionMatriculacion from "./configuracion";
import ListaLogsMatriculacion from "./listaLogs";
import TabGestionGeneral from "../../../atoms/AtomContentTab";
import AtomContainerGeneral from "../../../atoms/AtomContainerGeneral";
import Matriculacion from "./lista";
import { Box, Chip } from "@mui/material";
import AtomDatePicker from "../../../atoms/AtomDatePicker";
import { useSelector, useDispatch } from "react-redux";
import { setCalculateDate } from "../../../redux/configSelloutSlice";
import { usePermission } from "../../../context/PermisosComtext";
import { formatDate, isMonthClosed } from "../../constantes";
import { useEffect } from "react";
import { obtenerMatriculacionConfig } from "../../../redux/selloutDatosSlic";
import { PERMISSIONS } from "../../../constants/permissions";

const TabGestionMatriculacion = () => {
  const dispatch = useDispatch();
  const hasPermission = usePermission();
  const namePermission = hasPermission(PERMISSIONS.MATRICULACION.CONFIG_CIERRE);
  const calculateDate = useSelector(
    (state) => state?.configSellout?.calculateDate || formatDate(new Date())
  );
  const currentTab = useSelector(state => state.navigator?.currentTab || 0);

  const dataMatriculacionConfig = useSelector(
    (state) => state.selloutDatos?.dataMatriculacionConfig
  );

  const matriculacionConfigrada = dataMatriculacionConfig?.find(
    (config) => config.month === calculateDate
  );
  const matriculacionCerrada = isMonthClosed(
    matriculacionConfigrada?.closingDate,
    matriculacionConfigrada?.startDate
  );

  useEffect(() => {
    dispatch(obtenerMatriculacionConfig({ search: "", page: 1, limit: 1000 }));
  }, [dispatch]);

  const DatePickerWithStatus = () => (
    <>
      <Chip
        label={matriculacionCerrada !== "abierto" ? "Mes cerrado" : "Mes activo"}
        color={matriculacionCerrada === "abierto" ? "success" : "error"}
        sx={{
          position: "absolute",
          width: "auto",
          display: "flex",
          alignItems: "center",
          top: 10,
          left: 15,
          zIndex: 1000,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "auto",
          display: "flex",
          alignItems: "center",
          top: 5,
          left: 125,
          maxWidth: "230px",
          zIndex: 1000,
        }}
      >
        <AtomDatePicker
          id="calculateDate"
          mode="month"
          label=""
          color="#ffffff"
          height="40px"
          value={calculateDate}
          onChange={(e) => {
            dispatch(setCalculateDate(e));
          }}
        />
      </Box>
    </>
  );

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
          <DatePickerWithStatus />
          <Matriculacion calculateDate={calculateDate} key="matriculacion" />
        </>
      ),
    },
    {
      label: "Clientes cargados",
      component: (
        <>
          <DatePickerWithStatus />
          <ListaLogsMatriculacion calculateDate={calculateDate} key="lista" />
        </>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <TabGestionGeneral tabs={tabs} num={currentTab} />
    </Box>
  );
};

export default TabGestionMatriculacion;
