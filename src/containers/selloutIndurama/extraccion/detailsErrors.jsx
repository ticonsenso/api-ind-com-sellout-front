import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Grid,
} from "@mui/material";

const DetallesErrores = ({ errores }) => {
    return (
        <Accordion
            sx={{
                "&:before": {
                    display: "none",
                },
            }}
            elevation={0}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon color="error" />}
                aria-controls="panel-content"
                id="panel-header"
                sx={{
                    backgroundColor: "#ffe6e6",
                    flexDirection: "row-reverse",
                    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded":
                    {
                        transform: "rotate(180deg)",
                    },
                    "& .MuiAccordionSummary-content": {
                        justifyContent: "center",
                    },
                }}
            >
                <Typography
                    color="error"
                    sx={{ fontWeight: "bold", fontSize: "15px" }}
                >
                    Errores encontrados (
                    {errores.reduce(
                        (sum, err) => sum + Object.keys(err).length,
                        0
                    )}
                    )
                </Typography>
            </AccordionSummary>

            <AccordionDetails
                sx={{
                    border: "1px solid #ff4d4d",
                }}
            >
                <Box
                    sx={{
                        maxHeight: 300,
                        overflowY: "auto",
                        px: 2,
                        pb: 2,
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                    }}
                >
                    <ul
                        style={{
                            paddingLeft: "20px",
                            margin: 0,
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                        }}
                    >
                        {errores.map((filaError, rowIndex) =>
                            Object.entries(filaError).map(
                                ([columna, mensaje], idx) => (
                                    <Grid
                                        item
                                        size={6}
                                        key={`${rowIndex}-${idx}`}
                                    >
                                        <li
                                            key={`${rowIndex}-${idx}`}
                                            style={{
                                                color: "#d32f2f",
                                                fontSize: "13px",
                                            }}
                                        >
                                            Fila {rowIndex + 1}, Columna "{columna}
                                            ": {mensaje}
                                        </li>
                                    </Grid>
                                )
                            )
                        )}
                    </ul>
                </Box>
            </AccordionDetails>
        </Accordion>

    );
};
export default DetallesErrores;