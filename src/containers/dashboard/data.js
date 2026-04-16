import { PERMISSIONS } from "../../constants/permissions";

export const menuSelloutPage = [
  {
    id: 2,
    name: "Configuración de plantillas",
    icon: "mui:AddToQueue",
    visible: true,
    name_server: PERMISSIONS.MENU.CONFIG_PLANTILLAS,
    menuSellout: true,
    nameInfo: "Configuración de cierre",
  },
  {
    id: 5,
    name: "Carga de plantillas",
    icon: "mui:MenuBook",
    visible: true,
    name_server: PERMISSIONS.MENU.CARGA_PLANTILLAS,
    menuSellout: true,
    nameInfo: "Carga de archivos excel",
  },
  {
    id: 6,
    name: "Base consolidada",
    icon: "mui:DataSaverOnOutlined",
    visible: true,
    name_server: PERMISSIONS.MENU.BASE_CONSOLIDADA,
    menuSellout: true,
    nameInfo: "Validación de datos",
  },
  {
    id: 4,
    name: "SIC",
    icon: "mui:GridView",
    visible: true,
    name_server: PERMISSIONS.MENU.SIC,
    menuSellout: true,
    nameInfo: "Almacenes - Productos SIC",
  },
];

const initialStateMenu = [
  {
    id: 0,
    name: "Sellout Mercado",
    icon: "mui:Timeline",
    nameInfo: "Procesos",
    name_server: PERMISSIONS.MENU.HOME_SELLOUT,
    visible: true,
  },

  {
    id: 1,
    name: "Gestión de usuarios",
    icon: "mui:ManageAccountsOutlined",
    nameInfo: "Usuarios",
    name_server: PERMISSIONS.MENU.USER_MANAGEMENT,
    visible: true,
  },

  {
    id: 2,
    name: "Configuración de plantillas",
    icon: "mui:AddToQueue",
    visible: true,
    name_server: PERMISSIONS.MENU.CONFIG_PLANTILLAS,
    menuSellout: true,
    nameInfo: "Configuración de cierre",
  },
  {
    id: 5,
    name: "Carga de plantillas",
    icon: "mui:MenuBook",
    visible: true,
    name_server: PERMISSIONS.MENU.CARGA_PLANTILLAS,
    menuSellout: true,
    nameInfo: "Carga de archivos excel",
  },
  {
    id: 3,
    name: "Maestros",
    icon: "mui:DataSaverOnOutlined",
    visible: true,
    name_server: PERMISSIONS.MENU.MAESTROS,
    menuSellout: true,
    nameInfo: "Almacenes - Productos",
  },


  {
    id: 6,
    name: "Base Consolidada",
    icon: "mui:FilePresentOutlined",
    visible: true,
    name_server: PERMISSIONS.MENU.BASE_CONSOLIDADA,
    menuSellout: true,
    nameInfo: "Lista de datos",
  },
  {
    id: 9,
    name: "Base no Homologada",
    icon: "mui:DatasetLinked",
    visible: true,
    name_server: PERMISSIONS.MENU.BASE_NO_HOMOLOGADA,
    menuSellout: false,
    nameInfo: "No Homologados",
  },
  {
    id: 10,
    name: "Listas No Homologados",
    icon: "mui:Ballot",
    visible: true,
    name_server: PERMISSIONS.MENU.LISTAS_NO_HOMOLOGADOS,
    menuSellout: false,
    nameInfo: "Listas No Homologados",
  },
  {
    id: 4,
    name: "SIC",
    icon: "mui:GridView",
    visible: true,
    name_server: PERMISSIONS.MENU.SIC,
    menuSellout: true,
    nameInfo: "Almacenes - Productos SIC",
  },
  {
    id: 11,
    name: "Actualización DIM",
    icon: "mui:Sync",
    visible: true,
    name_server: PERMISSIONS.MENU.ACTUALIZACION_DIM,
    menuSellout: false,
    nameInfo: "Procesos de sincronización",
  },
];

export default initialStateMenu;
