
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
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
        <AtomContainerGeneral
            children={
                <TabGestionGeneral tabs={tabs} />
            }
        />
    );
};

export default NoConsolidado;
