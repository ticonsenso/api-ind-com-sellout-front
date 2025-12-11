import React from "react";
import { formatDate, } from "./constantes";
import {
    Box,
    Typography,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Informacion = ({ dataResponse }) => {
    return (
        <Box sx={{ width: "80%" }}>
            <Typography variant="h6">Extracción de datos</Typography>
            <Typography variant="body1">
                Fecha de extracción:{" "}
                {formatDate(dataResponse?.extractionDate || "")}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Detalles de Registros</Typography>
            <Typography variant="body1">
                Total de registros: {dataResponse?.recordCount || 0}
            </Typography>
            <Typography variant="body1">
                Unidades Vendidas: {dataResponse?.productCount || 0}
            </Typography>
            <Typography color="red">
                Errores: {dataResponse?.processingDetails?.error || 0}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {dataResponse?.processingDetails?.smsErrors?.length > 0 && (
                <Accordion sx={{ mt: 1 }}>
                    <AccordionSummary
                        sx={{ backgroundColor: "#ffd6d6" }}
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography sx={{ color: "red" }}>
                            Ver detalles de errores
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {dataResponse.processingDetails.smsErrors.map(
                            (error, index) => (
                                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                                    • {error}
                                </Typography>
                            )
                        )}
                    </AccordionDetails>
                </Accordion>
            )}
        </Box>
    );
};
export default Informacion;