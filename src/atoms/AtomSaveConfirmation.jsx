import React from "react";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import CustomLinearProgress from "./CustomLinearProgress";
import AtomAlert from "./AtomAlert";

const styles = {
  container: {
    p: 2,
    borderRadius: 2,
    backgroundColor: "#f9f9f9",
  },
  table: {
    borderRadius: 3,
    mt: 1,
  },
  tableCell: {
    backgroundColor: "#eaeaea",
    borderBottom: "1px solid #ffffff",
    minWidth: "20%",
  },
  typography: {
    fontWeight: 500,
    fontSize: "13px",
    color: "#6f6f6f",
    textTransform: "uppercase",
  },
  tableCellDetail: {
    borderBottom: "1px solid #eee",
    fontSize: "13px",
    fontWeight: 400,
    color: "#333",
    wordBreak: "break-word",
  },
  title: {
    fontWeight: 500,
    fontSize: "12px",
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
    backgroundColor: "details.main",
    borderRadius: 2,
    p: 1,
    minWidth: "20%",
  },
};

const AtomSaveConfirmationDetailDialog = ({
  loading = false,
  mensajeExtraccion = "",
  data = [],
  detallesData = [],
  totalUnitsSoldDistributor = 0,
  NOMBRES_CAMPOS = [],
  CAMPOS_DETALLE = [],
  totales = {},
}) => {
  return (
    <Box sx={{ height: "100%" }}>
      {loading ? (
        <CustomLinearProgress />
      ) : (
        <Grid
          container
          spacing={1}
          justifyContent="center"
          sx={{
            backgroundColor: "white",
            width: "100%",
            borderRadius: 2,
            height: "100%",
          }}
        >
          {/* Mensaje superior */}
          <Grid size={12}>
            <AtomAlert text={mensajeExtraccion} severity="info" />
          </Grid>

          {data.length > 0 && (
            <>
              {/* Primer Registro */}
              <Grid size={6}>
                <Box sx={styles.container}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
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
                              {data[0]?.[key] ?? "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>

              {/* Último Registro */}
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
                              {data[data.length - 1]?.[key] ?? "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>

              {/* Tabla dinámica de detalles */}
              {detallesData.length > 0 && CAMPOS_DETALLE.length > 0 && (
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
                            {CAMPOS_DETALLE.map(({ label, key }) => (
                              <TableCell key={key} sx={styles.tableCell}>
                                <Typography sx={styles.typography}>
                                  {label}
                                </Typography>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {detallesData.map((detalle, index) => (
                            <TableRow key={`detalle-${index}`}>
                              {CAMPOS_DETALLE.map(({ key }) => (
                                <TableCell
                                  key={key}
                                  sx={styles.tableCellDetail}
                                >
                                  {detalle[key] ?? "N/A"}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
              )}

              {totales && (
                <Grid size={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    {totales.textTotalFilas && (
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        sx={styles.title}
                      >
                        {totales?.textTotalFilas || ""}:{" "}
                        <strong>{data.length}</strong>
                      </Typography>
                    )}
                    {totales.textTotalUnidadesVendidas && (
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        sx={styles.title}
                      >
                        {totales?.textTotalUnidadesVendidas || ""}:{" "}
                        <strong>{totalUnitsSoldDistributor}</strong>
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default AtomSaveConfirmationDetailDialog;