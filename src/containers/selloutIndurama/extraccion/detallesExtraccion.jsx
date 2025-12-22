import {
    NOMBRES_CAMPOS,
    styles,
} from "./constantes";
import {
    Box,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

const DetallesExtraccion = ({ data, detallesData }) => {
    const lista = Array.isArray(data) ? data : [];
    const listaDetalles = Array.isArray(detallesData) ? detallesData : [];

    const totales = lista.reduce(
        (acc, row) => {
            const valor = Number(row.unitsSoldDistributor);

            if (Number.isNaN(valor) || valor === 0) {
                return acc;
            }

            if (valor > 0) {
                acc.totalPositivos += valor;
            } else {
                acc.totalDevoluciones += Math.abs(valor);
            }

            return acc;
        },
        {
            totalPositivos: 0,
            totalDevoluciones: 0,
        }
    );

    const totalUnitsSoldDistributor = totales.totalPositivos;
    const totalUnitsReturnedDistributor = totales.totalDevoluciones;


    return (
        <>
            <Grid item size={6}>
                <Box sx={styles.container}>
                    <Typography
                        variant="subtitle2"
                        color="primary"
                        gutterBottom
                    >
                        Primer Registro
                    </Typography>
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={styles.table}
                    >
                        <Table size="small">
                            <TableBody>
                                {Object.keys(NOMBRES_CAMPOS).map((key) => (
                                    <TableRow key={key}>
                                        <TableCell sx={styles.tableCell}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={styles.typography}
                                            >
                                                {NOMBRES_CAMPOS[key]}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={styles.tableCellDetail}>
                                            {data[0]?.[key] || "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Grid>

            <Grid size={6}>
                <Box sx={styles.container}>
                    <Typography variant="subtitle2" color="primary">
                        Último Registro
                    </Typography>

                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={styles.table}
                    >
                        <Table size="small">
                            <TableBody>
                                {Object.keys(NOMBRES_CAMPOS).map((key) => (
                                    <TableRow key={key}>
                                        <TableCell sx={styles.tableCell}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={styles.typography}
                                            >
                                                {NOMBRES_CAMPOS[key]}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={styles.tableCellDetail}>
                                            {data[data.length - 1]?.[key] || "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Grid>
            {listaDetalles.length > 0 && (
                <Grid size={12}>
                    <Box sx={styles.container}>
                        <Typography
                            variant="subtitle2"
                            color="primary"
                            gutterBottom
                        >
                            Detalles de la extracción
                        </Typography>

                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={styles.table}
                        >
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={styles.tableCell}>
                                            <Typography sx={styles.typography}>
                                                Distribuidor
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={styles.tableCell}>
                                            <Typography sx={styles.typography}>
                                                Almacén
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={styles.tableCell}>
                                            <Typography sx={styles.typography}>
                                                Filas / Registros
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={styles.tableCell}>
                                            <Typography sx={styles.typography}>
                                                Unidades Vendidas
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={styles.tableCell}>
                                            <Typography sx={styles.typography}>
                                                Unidades Devueltas
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listaDetalles.map((detalle, index) => (
                                        <TableRow
                                            key={`${detalle.distributor}-${detalle.codeStoreDistributor}-${index}`}
                                        >
                                            <TableCell sx={styles.tableCellDetail}>
                                                {detalle.distributor}
                                            </TableCell>
                                            <TableCell sx={styles.tableCellDetail}>
                                                {detalle.storeName}
                                            </TableCell>
                                            <TableCell sx={styles.tableCellDetail}>
                                                {detalle.rowsCount}
                                            </TableCell>
                                            <TableCell sx={styles.tableCellDetail}>
                                                {detalle.unitsSold}
                                            </TableCell>
                                            <TableCell sx={styles.tableCellDetail}>
                                                {detalle.unitsReturned}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
            )}

            <Grid size={12}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        gap: 1,
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        color="primary"
                        gutterBottom
                        sx={styles.title}
                    >
                        Total Filas/Registros:{" "}
                        <span style={{ fontWeight: "bold" }}>
                            {data.length}
                        </span>
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        color="primary"
                        gutterBottom
                        sx={styles.title}
                    >
                        Unidades Vendidas:{" "}
                        <span style={{ fontWeight: "bold" }}>
                            {totalUnitsSoldDistributor}
                        </span>
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        color="primary"
                        gutterBottom
                        sx={styles.title}
                    >
                        Unidades Devueltas:{" "}
                        <span style={{ fontWeight: "bold" }}>
                            {totalUnitsReturnedDistributor}
                        </span>
                    </Typography>
                </Box>
            </Grid>
        </>
    );
};
export default DetallesExtraccion;