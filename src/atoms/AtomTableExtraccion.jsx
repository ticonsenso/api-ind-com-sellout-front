import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  CircularProgress,
  IconButton,
  Box,
  TableFooter,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AtomTableExtraccion = ({
  loading = false,
  data = [],
  celdas = [],
  errors = {},
  showIndex = true,
  setData = () => { },
  setErrores = () => { },
}) => {
  const [filasSeleccionadas, setFilasSeleccionadas] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleEliminarSeleccionadas = () => {
    const nuevasData = data.filter(
      (_, index) => !filasSeleccionadas.includes(index)
    );

    const nuevosErrores = errors.filter(
      (_, index) => !filasSeleccionadas.includes(index)
    );

    setData(nuevasData);
    setErrores(nuevosErrores);
    setFilasSeleccionadas([]);
  };

  const handleSeleccionarFila = (rowIndex) => {
    setFilasSeleccionadas((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((i) => i !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const handleSeleccionarTodas = () => {
    if (filasSeleccionadas.length === data.length) {
      setFilasSeleccionadas([]);
    } else {
      setFilasSeleccionadas(data.map((_, index) => index));
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (data.length === 0) return null;

  const formatValueByType = (value, type) => {
    if (value === null || value === undefined || value === "") return "N/A";

    const number = parseFloat(value || 0);

    if (type === "number" || type === "numero") {
      return number.toLocaleString("es-EC", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    if (type === "dinero") {
      return number.toLocaleString("es-EC", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    if (type === "porcentaje") {
      return (
        number.toLocaleString("es-EC", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + "%"
      );
    }

    return value;
  };

  const styles = {
    headerCell: {
      fontWeight: 500,
      fontSize: 14,
      color: "#7f7f7fff",
      height: "40px",
      backgroundColor: "#ffffffff",
      position: "sticky",
      top: 0,
      minWidth: "5px",
      zIndex: 1,
    },
    textCell: {
      backgroundColor: "#fafafaff",
      fontWeight: 500,
      textAlign: "left",
      fontSize: "12px",
      width: "10px",
      color: "text.secondary",
    },
    textFinal: {
      fontWeight: "700",
      pt: 2,
      pb: 2,
      textAlign: "right",
      color: "#1976d2",
      fontSize: "14px",
    },
    indexCell: {
      backgroundColor: "#ffffffff",
      fontWeight: 500,
      textAlign: "center",
      fontSize: "12px",
      color: "#3a82dfff",
    },

  };

  return (
    <TableContainer
      sx={{
        borderRadius: "15px",
        boxShadow: 1,
        border: "1px solid #e0e0e0",
        overflow: "auto",
        maxHeight: `${rowsPerPage * 42 + 80}px`,
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              sx={styles.headerCell}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 0,
                  margin: 0,
                  width: "30px",
                  justifyContent: "center",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    filasSeleccionadas.length === data.length && data.length > 0
                  }
                  indeterminate={
                    filasSeleccionadas.length > 0 &&
                    filasSeleccionadas.length < data.length
                  }
                  onChange={handleSeleccionarTodas}
                />
                {filasSeleccionadas.length > 0 && (
                  <IconButton onClick={handleEliminarSeleccionadas}>
                    <DeleteIcon
                      color="error"
                      sx={{
                        fontSize: "16px",
                      }} />
                  </IconButton>
                )}
              </Box>
            </TableCell>

            {showIndex && (
              <TableCell
                sx={styles.headerCell}
              ></TableCell>
            )}

            {celdas.map((col, index) => (
              <TableCell
                key={index}
                sx={styles.headerCell}
              >
                {col.label || col.field || "N/A"}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, rowIndex) => {
              const globalIndex = page * rowsPerPage + rowIndex;

              return (
                <TableRow key={globalIndex}>
                  <TableCell sx={styles.indexCell}>
                    <input
                      type="checkbox"
                      checked={filasSeleccionadas.includes(globalIndex)}
                      onChange={() => handleSeleccionarFila(globalIndex)}
                    />
                  </TableCell>

                  {showIndex && (
                    <TableCell
                      sx={styles.indexCell}
                    >
                      {globalIndex + 1}
                    </TableCell>
                  )}

                  {celdas.map((col, index) => {
                    const campo = col.field;
                    const hasError = errors[globalIndex]?.[campo];
                    const value = formatValueByType(row[campo], col.type);

                    const maxWidth = col.maxWidth || "190px";
                    const minWidth = col.minWidth || "5px";

                    return (
                      <TableCell
                        key={index}
                        style={{
                          color: hasError ? "red" : "#414141ff",
                          backgroundColor: hasError ? "#ffe6e6" : "#fafafaff",
                          fontSize: "12px",
                          fontWeight: "400",
                          maxWidth: maxWidth,
                          minWidth: minWidth,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textAlign: col.type !== "TEXT" ? "right" : "left",
                        }}
                      >
                        {value || "N/A"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          {celdas.map((col) => {
            if (col.field === "unitsSoldDistributor") {
              const totalUnits = data.reduce((acc, row) => {
                const val = parseFloat(row[col.field]) || 0;
                return acc + val;
              }, 0);
              return (
                <TableRow
                  sx={{
                    backgroundColor: "#ffffffff",
                    fontWeight: "bold",
                  }}
                >
                  <TableCell
                    colSpan={celdas.length + 1}
                    sx={styles.textFinal}
                  >
                    TOTAL UNIDADES VENDIDAS:
                  </TableCell>
                  <TableCell sx={styles.textFinal}>
                    {formatValueByType(totalUnits, "number")}
                  </TableCell>
                </TableRow>
              );
            }
            return null;
          })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              sx={{
                color: "#757575",
                backgroundColor: "#f9f9f9",
                position: "sticky",
                bottom: -1,
                zIndex: 1,
              }}
              count={data.length}
              page={page}
              rowsPerPageOptions={[25, 50, 100]}
              rowsPerPage={rowsPerPage}
              onPageChange={(event, newPage) =>
                handleChangePage(event, newPage)
              }
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default AtomTableExtraccion;