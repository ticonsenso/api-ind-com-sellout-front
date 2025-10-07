import React from "react";
import AlmacenSic from "./almacen";
import ProductsSic from "./products";
import TabGestionGeneral from "../../../atoms/AtomContentTab";
import AtomContainerGeneral from "../../../atoms/AtomContainerGeneral";

const TabGestionSic = () => {
  const tabs = [
    { label: "Almacenes", component: <AlmacenSic key="almacenes" /> },
    { label: "Productos", component: <ProductsSic key="productos" /> },
  ];

  return <AtomContainerGeneral children={<TabGestionGeneral tabs={tabs} />} />;
};

export default TabGestionSic;
