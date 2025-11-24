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
      fontWeight: 600,
      fontSize: 14,
      color: "#5e5e5eff",
      height: "40px",
      backgroundColor: "#ffffff",
      position: "sticky",
      top: 0,
      minWidth: "5px",
      zIndex: 1,
    },
    textCell: {
      backgroundColor: "#f9f9f9",
      fontWeight: 400,
      textAlign: "left",
      fontSize: "12px",
      color: "text.secondary",
    },
    textFinal: {
      fontWeight: 600,
      pt: 2,
      pb: 2,
      textAlign: "right",
      color: "#1976d2",
      fontSize: "15px",
    },
    indexBadge: {
      display: "inline-block",
      padding: "2px 5px",
      borderRadius: "12px",
      backgroundColor: "#ffffffff",
      color: "#1976d2",
      fontSize: "11px",
      fontWeight: 600,
      minWidth: "28px",
      textAlign: "center",
      boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
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
            {showIndex && <TableCell sx={styles.headerCell}></TableCell>}

            {celdas.map((col, index) => (
              <TableCell key={index} sx={styles.headerCell}>
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
                  {showIndex && (
                    <TableCell sx={{ textAlign: "center", width: "25px", backgroundColor: "#eff7ffff" }}>
                      <span style={styles.indexBadge}>{globalIndex + 1}</span>
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
                          backgroundColor: hasError ? "#ffe6e6" : "#fafafa",
                          fontSize: "11.5px",
                          fontWeight: 400,
                          maxWidth: maxWidth,
                          minWidth: minWidth,
                          overflow: "hidden",
                          height: "35px",
                          textOverflow: "ellipsis",
                          textAlign: "left",
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
                    backgroundColor: "#eff7ffff",
                    fontWeight: 500,
                  }}
                >
                  <TableCell colSpan={celdas.length} sx={styles.textFinal}>
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
              onPageChange={(event, newPage) => handleChangePage(event, newPage)}
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
