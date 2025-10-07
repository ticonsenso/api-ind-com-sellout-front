import React from "react";
import {
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatDate } from "../containers/constantes";

const AtomExtractionInfo = ({ data }) => {
  const styles = {
    title: {
      fontWeight: 600,
      color: "primary.main",
    },
  };

  return (
    <Box sx={styles.box}>
      <Typography sx={styles.title}>Extracción de datos</Typography>
      <Typography variant="body1">
        Fecha de extracción: {formatDate(data?.extractionDate || "")}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Registros</Typography>
      <Typography variant="body1">
        Cantidad de registros: {data?.recordCount || ""}
      </Typography>
      <Typography variant="body1">
        ¿Procesado?: {data?.isProcessed ? "Sí" : "No"}
      </Typography>
      <Typography variant="body1">
        Duración del procesamiento: {data?.processingDetails?.duration || ""}{" "}
        milisegundos
      </Typography>
      <Typography color="red">
        Errores: {data?.processingDetails?.error || 0}
      </Typography>
      <Divider sx={{ my: 2 }} />
      {data?.processingDetails?.smsErrors?.length > 0 && (
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
            {data.processingDetails.smsErrors.map((error, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                • {error}
              </Typography>
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default AtomExtractionInfo;