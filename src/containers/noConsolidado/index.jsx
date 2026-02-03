
import TabGestionGeneral from "../../atoms/AtomContentTab";
import ProductosNoHomologados from "./productos";
import AlmacenesNoHomologados from "./almacenes";

const NoConsolidado = () => {

    const tabs = [
        {
            label: "ALMACENES",
            component: (
                <>
                    <AlmacenesNoHomologados key="lista" />
                </>
            ),
        },
        {
            label: "PRODUCTOS",
            component: (
                <>
                    <ProductosNoHomologados key="matriculacion" />
                </>
            ),
        },

    ];

    return (
        <TabGestionGeneral tabs={tabs} />
    );
};

export default NoConsolidado;
