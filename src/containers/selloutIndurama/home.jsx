import { Box, Typography, styled, Avatar, Paper } from "@mui/material";

import {
  Public as PublicIcon,
  EmojiObjects as EmojiObjectsIcon,
  Settings as SettingsIcon,
  MenuBook as MenuBookIcon,
  Search as SearchIcon,
  AddToQueue as AddToQueueIcon,
} from "@mui/icons-material";

import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import { handleMenu } from "../../redux/navigatorSlice";
import { usePermission } from "../../context/PermisosComtext";

import { setCalculateDate } from "../../redux/configSelloutSlice";
import { getPreviousMonthStart } from "../constantes";

const SelloutIndurama = () => {
  const dispatch = useDispatch();
  const namePermission = usePermission();

  const calculateDate = getPreviousMonthStart();
  dispatch(setCalculateDate(calculateDate));

  const pasos = [
    {
      id: 2,
      menuSellout: true,
      name: "Configuración de plantillas",
      numero: "01",
      titulo: "CONFIGURACIÓN DE PLANTILLAS",
      descripcion: "Activación de configuración de cierre y clientes a cargar.",
      nameInfo: "Configuración de mes de cierre",
      color: "#d50040ff",
      Icon: AddToQueueIcon,
      permiso: "MATRICULACION SELLOUT",
      subpasos: [
        // {
        //   id: 2,
        //   titulo: "Configuración de Cierre",
        //   permiso: "EXTRACCION SELLOUT",
        //   menuSellout: true,
        //   name: "Mes de cierre",
        //   nameInfo: "Lista",
        // },
        {
          id: 2,
          titulo: "Lista de Clientes ",
          permiso: "EXTRACCION SELLOUT",
          menuSellout: true,
          name: "Configuración de plantillas",
          tab: 1,
          nameInfo: 'Clientes a cargar',
        },
      ],
    },

    {
      id: 5,
      numero: "02",
      titulo: "CARGA DE PLANTILLAS",
      descripcion: "Procesamiento de los archivo excel.",
      color: "#0669abff",
      Icon: MenuBookIcon,
      permiso: "EXTRACCION SELLOUT",
      menuSellout: true,
      name: "Carga de plantillas",
      nameInfo: "Carga de archivos excel",
      subpasos: [
        {
          id: 5,
          name: "Configuración de Extracción",
          permiso: "EXTRACCION SELLOUT",
          menuSellout: true,
          titulo: "Configuraciones de extracción",
          nameInfo: "Crear configuraciones",
          tab: 1,
        },
      ],
    },
    {
      id: 6,
      menuSellout: true,
      numero: "03",
      name: "Base Consolidada",
      titulo: "VALIDACIÓN DE PLANTILLAS",
      descripcion:
        "Representación de datos obtenidos en Base Consolidada.",
      color: "#ef6c00",
      Icon: SearchIcon,
      nameInfo: "Lista de datos",
      permiso: "PLANTILLA CONSOLIDADO SELLOUT",
      subpasos: [
        {
          id: 9,
          numero: "3.1",
          titulo: "Base no Homologada",
          name: "Base no Homologada",
          descripcion: "Lista de productos y almacenes que no necesitan homologación.",
          color: "#6a1b9a",
          Icon: PublicIcon,
          permiso: "MAESTROS SELLOUT",
          menuSellout: true,
          nameInfo: "Almacenes-Productos no homologados",
        },
        {
          id: 4,
          numero: "3.2",
          titulo: "Maestros",
          name: "Maestros",
          descripcion: "Carga y gestión de productos y almacenes maestros.",
          color: "#6a1b9a",
          Icon: PublicIcon,
          permiso: "MAESTROS SELLOUT",
          menuSellout: true,
          nameInfo: "Lista de almacenes y productos",

        },
      ]
    },
    {
      id: 4,
      numero: "04",
      titulo: "SIC",
      descripcion: "Carga y gestión de productos y almacenes SIC.",
      color: "rgba(31, 151, 12, 1)",
      Icon: EmojiObjectsIcon,
      permiso: "SIC SELLOUT",
      name: "SIC",
      nameInfo: "Almacenes - Productos SIC",
      menuSellout: true,
    },
  ].filter((paso) => namePermission(paso.permiso));

  const PasoContainer = styled(Box)({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  });

  const NumeroCirculo = styled(Avatar)(({ bgcolor }) => ({
    backgroundColor: bgcolor,
    width: 70,
    height: 70,
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 7,
  }));

  const PasoCard = styled(Paper)(({ bgcolor }) => ({
    backgroundColor: bgcolor,
    color: "white",
    padding: 10,
    textAlign: "center",
    width: 200,
    minHeight: 200,
    borderRadius: 15,
    position: "relative",
    zIndex: 1,
  }));

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      {pasos.length > 0 ? (
        <Grid container spacing={0} justifyContent="center" mt={5} mb={5}>
          {pasos.map((paso, index) => (
            <Grid
              key={index}
              item
              sx={{
                borderBottom:
                  index % 2 === 0 ? `20px solid ${paso.color}` : "none",
                borderTop:
                  index % 2 !== 0 ? `20px solid ${paso.color}` : "none",
                pt: 2,
                pl: 8,
                pr: 8,
                pb: 7,
                mt: 1,
                borderRadius: 50,
                backgroundColor: "#ffffffff",
              }}
            >
              <PasoContainer>
                <NumeroCirculo bgcolor={paso.color}>
                  {paso.numero}
                </NumeroCirculo>

                <PasoCard
                  elevation={3}
                  bgcolor={paso.color}
                  onClick={() => dispatch(handleMenu(paso))}
                >
                  <Box sx={{ mb: 1 }}>
                    <paso.Icon sx={{ fontSize: 52, color: "white" }} />
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {paso.titulo}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {paso.descripcion}
                  </Typography>

                  {/* SUBPASOS COMO LISTA LIMPIA */}
                  {paso.subpasos && (
                    <Box sx={{ mt: 2, textAlign: "left", pl: 1 }}>
                      {paso.subpasos.map((sub) => (
                        <Typography
                          key={sub.id}
                          variant="body2"
                          sx={{
                            cursor: "pointer",
                            mb: 0.3,
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(handleMenu(sub));
                          }}
                        >
                          • {sub.titulo}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </PasoCard>
              </PasoContainer>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            mt: 5,
            backgroundColor: "#ffeeee",
            color: "#810303ff",
            fontWeight: 400,
            fontSize: "13px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid red",
          }}
        >
          No tienes permisos para acceder a los componentes de Sellout.
        </Typography>
      )}
    </Box>
  );
};

export default SelloutIndurama;
