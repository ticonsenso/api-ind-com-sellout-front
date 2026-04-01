import TabGestionGeneral from "../../atoms/AtomContentTab";
import AlmacenesNoVisita from "./almacenesNoVisita";
import ProductosOtros from "./productosOtros";
import { usePermission } from "../../context/PermisosComtext";
import { PERMISSIONS } from "../../constants/permissions";
import NoAccessContent from "../../atoms/NoAccessContent";

const NoVisita = () => {
    const hasPermission = usePermission();

    const tabs = [
        ...(hasPermission(PERMISSIONS.LISTAS_NO_HOMOLOGADOS.ALMACENES_NO_VISITA) ? [
            {
                label: "ALMACENES NO VISITA",
                component: (
                    <>
                        <AlmacenesNoVisita key="almacenesNoVisita" />
                    </>
                ),
            },
        ] : []),
        ...(hasPermission(PERMISSIONS.LISTAS_NO_HOMOLOGADOS.PRODUCTOS_OTROS) ? [
            {
                label: "PRODUCTOS OTROS",
                component: (
                    <>
                        <ProductosOtros key="productosOtros" />
                    </>
                ),
            },
        ] : []),
    ];

    if (tabs.length === 0) {
        return <NoAccessContent
            title="Sin permisos"
            message="No cuentas con acceso a Almacenes o Productos No Visita."
        />;
    }

    return (

        <TabGestionGeneral tabs={tabs} />
    );
};

export default NoVisita;
