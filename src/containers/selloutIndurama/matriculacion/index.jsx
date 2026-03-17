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

const TabGestionMatriculacion = () => {
  const dispatch = useDispatch();
  const hasPermission = usePermission();
  const namePermission = hasPermission("CONFIGURACION CIERRE SELLOUT");
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
    <Box
      sx={{
        position: "fixed",
        width: "auto",
        display: "flex",
        alignItems: "center",
        gap: 2,
        top: 80,
        right: 100,
        zIndex: 1000,
      }}
    >

      {matriculacionCerrada !== "abierto" && (
        <Box
          sx={{
            position: "fixed",
            width: "auto",
            display: "flex",
            alignItems: "center",
            gap: 2,
            top: 130,
            right: 30,
            zIndex: 1000,
          }}
        >
          <Chip
            label="Mes cerrado"
            color="error"
            sx={{ fontWeight: "500", height: "30px", fontSize: "0.85rem", top: 50, position: "relative", right: 0 }}
          />
        </Box>
      )}
      <Box sx={{ width: "200px" }}>
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
    </Box>
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
