
import TabGestionGeneral from "../../atoms/AtomContentTab";
import AlmacenesNoVisita from "./almacenesNoVisita";
import ProductosOtros from "./productosOtros";

const NoVisita = () => {

    const tabs = [
        {
            label: "ALMACENES NO VISITA",
            component: (
                <>
                    <AlmacenesNoVisita key="almacenesNoVisita" />
                </>
            ),
        },
        {
            label: "PRODUCTOS OTROS",
            component: (
                <>
                    <ProductosOtros key="productosOtros" />
                </>
            ),
        },

    ];

    return (

        <TabGestionGeneral tabs={tabs} />
    );
};

export default NoVisita;
