import React, { useState } from "react";
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
      label: "Matriculación por mes",
      component: (
        <>
          <Box
            sx={{
              position: "fixed",
              top: 80,
              right: 80,
              zIndex: 1000,
            }}
          >
            <AtomDatePicker
              id="calculateDate"
              required={true}
              mode="month"
              label="Fecha de búsqueda"
              color="#ffffff"
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
      label: "Detalles de matriculación",
      component: (
        <>
          <Box
            sx={{
              position: "fixed",
              top: 80,
              right: 80,
              zIndex: 1000,
            }}
          >
            <AtomDatePicker
              id="calculateDate"
              required={true}
              mode="month"
              label="Fecha de búsqueda"
              color="#ffffff"
              value={calculateDate}
              onChange={(e) => {
                dispatch(setCalculateDate(e));
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
          <TabGestionGeneral tabs={tabs} />
        </>
      }
    />
  );
};

export default TabGestionMatriculacion;
