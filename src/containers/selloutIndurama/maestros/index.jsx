import React from "react";
import Almacen from "./almacen";
import MaestrosProducts from "./maestrosProducts";
import TabGestionGeneral from "../../../atoms/AtomContentTab";
import AtomContainerGeneral from "../../../atoms/AtomContainerGeneral";

const TabGestionMaestros = () => {
  const tabs = [
    { label: "Almacenes", component: <Almacen key="almacenes" /> },
    { label: "Productos", component: <MaestrosProducts key="productos" /> },
  ];

  return <AtomContainerGeneral children={<TabGestionGeneral tabs={tabs} />} />;
};

export default TabGestionMaestros;
