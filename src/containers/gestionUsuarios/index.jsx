import React from "react";
import TabUsers from "./listaUsuarios";
import TabRoles from "./TabRoles";
import TabPermisos from "./TabPermisos";
import TabGestionGeneral from "../../atoms/AtomContentTab";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";

const TabGestionUsers = () => {
  const tabs = [
    { label: "Usuarios", component: <TabUsers key="users" /> },
    { label: "Roles", component: <TabRoles key="roles" /> },
    { label: "Permisos", component: <TabPermisos key="permisos" /> },
  ];

  return <AtomContainerGeneral children={<TabGestionGeneral tabs={tabs} />} />;
};

export default TabGestionUsers;
