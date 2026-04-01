
import TabGestionGeneral from "../../atoms/AtomContentTab";
import ProductosNoHomologados from "./productos";
import AlmacenesNoHomologados from "./almacenes";
import { usePermission } from "../../context/PermisosComtext";
import { PERMISSIONS } from "../../constants/permissions";
import NoAccessContent from "../../atoms/NoAccessContent";

const NoConsolidado = () => {
    const hasPermission = usePermission();

    const tabs = [
        ...(hasPermission(PERMISSIONS.BASE_NO_HOMOLOGADA.ALMACENES) ? [{
            label: "ALMACENES",
            component: (
                <>
                    <AlmacenesNoHomologados key="lista" />
                </>
            ),
        }] : []),
        ...(hasPermission(PERMISSIONS.BASE_NO_HOMOLOGADA.PRODUCTOS) ? [{
            label: "PRODUCTOS",
            component: (
                <>
                    <ProductosNoHomologados key="matriculacion" />
                </>
            ),
        }] : []),
    ];

    // Fallback if no internal permissions are assigned but they can see the module
    if (tabs.length === 0) {
        return <NoAccessContent 
            title="Sin acceso" 
            message="No tiene permisos asignados para ver Almacenes o Productos No Homologados." 
        />;
    }

    return (
        <TabGestionGeneral tabs={tabs} />
    );
};

export default NoConsolidado;
