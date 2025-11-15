import TabGestionUsers from "../gestionUsuarios/index.jsx";
import Config1 from "../selloutIndurama/config1.jsx";
import PlantillaStandar from "../selloutIndurama/plantillaStandar.jsx";
import TabGestionSic from "../selloutIndurama/sic/index.jsx";
import TabGestionMaestros from "../selloutIndurama/maestros/index.jsx";
import SelloutIndurama from "../selloutIndurama/home.jsx";
import DatosPresupuestoSellout from "../selloutIndurama/datosPresupuestoSellout.jsx";
import ValoresSellout from "../selloutIndurama/valoresSellout.jsx";
import TabGestionMatriculacion from "../selloutIndurama/matriculacion/index.jsx";
import NoConsolidado from "../noConsolidado/index.jsx";

const componentMap = {
  //0: <HomePrincipal />,
  0: <SelloutIndurama />,
  1: <TabGestionUsers />,
  2: <TabGestionMatriculacion />,
  3: <TabGestionMaestros />,
  4: <TabGestionSic />,
  5: <Config1 />,
  6: <PlantillaStandar />,
  7: <DatosPresupuestoSellout />,
  8: <ValoresSellout />,
  9: <NoConsolidado />
};

export default componentMap;
