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
  Box,
  TableFooter,
  TablePagination,
} from "@mui/material";

const AtomTableExtraccion = ({
  loading = false,
  data = [],
  celdas = [],
  errors = {},
  showIndex = true,
  setData = () => { },
  setErrores = () => { },
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  if (loading) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (data.length === 0) return null;

  const formatValueByType = (value, type) => {
    if (value === null || value === undefined || value === "") return "-";

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
      });
    }

    return value;
  };

  /* =====================================================
     👉 CÁLCULOS IMPORTANTES (VENTAS / DEVOLUCIONES)
  ===================================================== */

  const { totalVentas, totalDevoluciones } = data.reduce(
    (acc, row) => {
      let valor = Number(row.unitsSoldDistributor);

      // 👉 Si no tiene cantidad, se asigna 1
      if (!valor) valor = 1;

      if (valor > 0) {
        acc.totalVentas += valor;
      }

      if (valor < 0) {
        acc.totalDevoluciones += valor;
      }

      return acc;
    },
    { totalVentas: 0, totalDevoluciones: 0 }
  );

  return (
    <TableContainer
      sx={{
        borderRadius: "15px",
        boxShadow: 1,
        border: "1px solid #e0e0e0",
        overflow: "auto",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            {showIndex && <TableCell>#</TableCell>}
            {celdas.map((col, index) => (
              <TableCell key={index}>{col.label}</TableCell>
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
                    <TableCell>{globalIndex + 1}</TableCell>
                  )}

                  {celdas.map((col, index) => (
                    <TableCell key={index}>
                      {formatValueByType(row[col.field], col.type)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}

          <TableRow sx={{ backgroundColor: "#daffddff" }}>
            <TableCell
              sx={{
                fontWeight: "700",
                color: "#116118ff",
              }}
              colSpan={celdas.length - 1} align="right">
              TOTAL UNIDADES VENDIDAS:
            </TableCell>
            <TableCell sx={{ fontWeight: "700", color: "#116118ff" }}>
              {formatValueByType(totalVentas, "number")}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>

          <TableRow sx={{ backgroundColor: "#fdecea" }}>
            <TableCell
              sx={{
                fontWeight: "700",
                color: "#c24a25ff",
              }}
              colSpan={celdas.length - 1} align="right">
              TOTAL DEVOLUCIONES:
            </TableCell>
            <TableCell sx={{ fontWeight: "700", color: "#c24a25ff" }}>
              {formatValueByType(totalDevoluciones, "number")}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              count={data.length}
              page={page}
              rowsPerPageOptions={[25, 50, 100]}
              rowsPerPage={rowsPerPage}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Filas por página:"
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default AtomTableExtraccion;
