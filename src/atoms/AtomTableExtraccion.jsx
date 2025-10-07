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
  setData = () => {},
  setErrores = () => {},
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
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: "#6f6f6f",
                height: "35px",
                backgroundColor: "#F5F5F5",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 0,
                  margin: 0,
                  width: "40px",
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
                    <DeleteIcon color="error" sx={{ fontSize: "18px" }} />
                  </IconButton>
                )}
              </Box>
            </TableCell>

            {showIndex && (
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#6f6f6f",
                  height: "35px",
                  backgroundColor: "#F5F5F5",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  textAlign: "center",
                }}
              ></TableCell>
            )}

            {celdas.map((col, index) => (
              <TableCell
                key={index}
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  zIndex: 1,
                  position: "sticky",
                  top: 0,
                  textAlign: col.type === "TEXT" ? "left" : "right",
                  backgroundColor: "#f5f5f5",
                  textTransform: "capitalize",
                  color: "#6f6f6f",
                  lineHeight: "23px",
                }}
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
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      checked={filasSeleccionadas.includes(globalIndex)}
                      onChange={() => handleSeleccionarFila(globalIndex)}
                    />
                  </TableCell>

                  {showIndex && (
                    <TableCell
                      sx={{
                        backgroundColor: "#f3f6ff",
                        fontWeight: 500,
                        textAlign: "left",
                        fontSize: "12px",
                        width: "30px",
                        color: "text.secondary",
                      }}
                    >
                      {globalIndex + 1}
                    </TableCell>
                  )}

                  {celdas.map((col, index) => {
                    const campo = col.field;
                    const hasError = errors[globalIndex]?.[campo];
                    const value = formatValueByType(row[campo], col.type);

                    const maxWidth = col.maxWidth || "120px";
                    const minWidth = col.minWidth || "20px";

                    return (
                      <TableCell
                        key={index}
                        style={{
                          color: hasError ? "red" : "inherit",
                          backgroundColor: hasError ? "#ffe6e6" : "inherit",
                          fontSize: "13px",
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
          {celdas.map((col, index) => {
            if (col.field === "unitsSoldDistributor") {
              const totalUnits = data.reduce((acc, row) => {
                const val = parseFloat(row[col.field]) || 0;
                return acc + val;
              }, 0);
              return (
                <TableRow
                  sx={{
                    backgroundColor: "#e3f2fd",
                    fontWeight: "bold",
                  }}
                >
                  <TableCell
                    colSpan={celdas.length + 1}
                    sx={{ fontWeight: "bold", textAlign: "right" }}
                  >
                    TOTAL UNIDADES VENDIDAS:
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>
                    {totalUnits}
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