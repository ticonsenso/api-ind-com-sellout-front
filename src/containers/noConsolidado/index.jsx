
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { Box } from "@mui/material";
import TabGestionGeneral from "../../atoms/AtomContentTab";
import { setCalculateDate } from "../../redux/configSelloutSlice";
import { useSelector, useDispatch } from "react-redux";
import { formatDate } from "../constantes";
import ProductosNoHomologados from "./productos";
import AlmacenesNoHomologados from "./almacenes";
import AtomDatePicker from "../../atoms/AtomDatePicker";

const NoConsolidado = () => {
    const dispatch = useDispatch();
    const calculateDate = useSelector(
        (state) => state?.configSellout?.calculateDate || formatDate(new Date())
    );

    const tabs = [
        {
            label: "ALMACENES",
            component: (
                <>
                    <Box
                        sx={{
                            position: "fixed",
                            top: 80,
                            right: 20,
                            zIndex: 1000,
                        }}
                    >
                        <AtomDatePicker
                            id="calculateDate"
                            required={true}
                            mode="month"
                            label="Fecha de búsqueda"
                            color="#ffffff"
                            height="40px"
                            value={calculateDate}
                            onChange={(e) => {
                                dispatch(setCalculateDate(e));
                            }}
                        />
                    </Box>
                    <AlmacenesNoHomologados calculateDate={calculateDate} key="lista" />
                </>
            ),
        },
        {
            label: "PRODUCTOS",
            component: (
                <>
                    <Box
                        sx={{
                            position: "fixed",
                            top: 80,
                            right: 20,
                            zIndex: 1000,
                        }}
                    >
                        <AtomDatePicker
                            id="calculateDate"
                            required={true}
                            mode="month"
                            label="Fecha de búsqueda"
                            color="#ffffff"
                            height="40px"
                            value={calculateDate}
                            onChange={(e) => {
                                dispatch(setCalculateDate(e));
                            }}
                        />
                    </Box>
                    <ProductosNoHomologados calculateDate={calculateDate} key="matriculacion" />
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
