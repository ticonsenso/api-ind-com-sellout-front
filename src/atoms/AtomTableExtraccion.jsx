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
  TableFooter,
  TablePagination,
  styled,
  Paper,
  Box
} from "@mui/material";

// --- Styled Components echoing AtomTableForm ---
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "transparent",
  boxShadow: "none",
  flex: 1,
  overflowY: "auto",
  overflowX: "auto",
  "& .MuiTable-root": {
    borderCollapse: "separate",
    borderSpacing: "0 8px", // Reduced spacing for spread look
    width: "100%",
    minWidth: "1000px",
  },
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // #0072CE
  color: theme.palette.common.white,
  fontWeight: 700,
  fontSize: "0.85rem",
  padding: "16px",
  borderBottom: "none",
  whiteSpace: "normal",
  wordWrap: "break-word",
  verticalAlign: "bottom",
  lineHeight: "1.2",
  "&:first-of-type": {
    borderTopLeftRadius: "8px",
    borderBottomLeftRadius: "8px",
  },
  "&:last-of-type": {
    borderTopRightRadius: "8px",
    borderBottomRightRadius: "8px",
  },
}));

const StyledBodyRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#ffffff",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  position: "relative",
  zIndex: 1,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    zIndex: 2,
    "& td": {
      borderColor: "transparent",
    }
  },
  "& td:first-of-type": {
    borderTopLeftRadius: "8px",
    borderBottomLeftRadius: "8px",
  },
  "& td:last-of-type": {
    borderTopRightRadius: "8px",
    borderBottomRightRadius: "8px",
  },
}));

const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.875rem",
  color: "#334155",
  borderBottom: "none",
  padding: "12px 16px",
  wordWrap: "break-word",
  whiteSpace: "normal",
  verticalAlign: "middle",
}));

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

  // if (data.length === 0) return null; // Removed check to show headers always

  const formatValueByType = (value, type) => {
    if (value === null || value === undefined) return "-";
    const number = parseFloat(value || 0);

    if (type === "number" || type === "numero") {
      return number.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (type === "dinero") {
      return number.toLocaleString("es-EC", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (type === "porcentaje") {
      return number.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
    }
    return value;
  };

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <StyledTableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {showIndex && <StyledHeaderCell sx={{ width: "50px" }}>#</StyledHeaderCell>}
              {celdas.map((col, index) => (
                <StyledHeaderCell key={index}>
                  {col.label || col.field || "-"}
                </StyledHeaderCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length > 0 ? (
              <>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, rowIndex) => {
                    const globalIndex = page * rowsPerPage + rowIndex;

                    return (
                      <StyledBodyRow key={globalIndex}>
                        {showIndex && (
                          <StyledBodyCell sx={{ textAlign: "center", fontWeight: "bold", color: "#0072CE" }}>
                            {globalIndex + 1}
                          </StyledBodyCell>
                        )}

                        {celdas.map((col, index) => {
                          const campo = col.field;
                          const hasError = errors[globalIndex]?.[campo];
                          const value = formatValueByType(row[campo], col.type);

                          return (
                            <StyledBodyCell
                              key={index}
                              sx={{
                                color: hasError ? "#d32f2f" : "inherit",
                                backgroundColor: hasError ? "#ffebee" : "inherit",
                                fontWeight: hasError ? 600 : 400,
                                maxWidth: col.maxWidth || "200px",
                              }}
                            >
                              {value || "-"}
                            </StyledBodyCell>
                          );
                        })}
                      </StyledBodyRow>
                    );
                  })}

                {celdas.some(c => c.field === "unitsSoldDistributor") && (
                  <TableRow>
                    <TableCell colSpan={showIndex ? celdas.length + 1 : celdas.length} style={{ padding: 0, border: "none" }}>
                      <Box sx={{
                        mt: 3,
                        mb: 1,
                        mr: 2,
                        ml: "auto",
                        width: "fit-content",
                        background: "linear-gradient(135deg, #0072CE 0%, #00569d 100%)", // Rich gradient
                        borderRadius: "16px",
                        padding: "16px 32px",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        boxShadow: "0 10px 25px -5px rgba(0, 114, 206, 0.4)", // Elevator shadow
                        color: "white",
                        transform: "translateY(0)",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                        }
                      }}>
                        <span style={{ fontWeight: 600, opacity: 0.9, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                          Total Unidades
                        </span>
                        <Box sx={{ width: "1px", height: "24px", backgroundColor: "rgba(255,255,255,0.3)" }} />
                        <span style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.5px" }}>
                          {formatValueByType(
                            data.reduce((acc, row) => acc + (parseFloat(row["unitsSoldDistributor"]) || 0), 0),
                            "number"
                          )}
                        </span>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={celdas.length + (showIndex ? 1 : 0)}
                  align="center"
                  sx={{ py: 8, color: 'text.secondary', fontSize: '1.2rem', fontStyle: 'italic', background: 'transparent' }}
                >
                  No existen datos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Pagination Styled */}
      <Box sx={{
        mt: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        px: 2,
        py: 1,
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
        marginBottom: 2
      }}>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[25, 50, 100]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          sx={{
            color: '#334155',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontWeight: 600,
              fontSize: '0.85rem'
            },
            '& .MuiTablePagination-select': {
              backgroundColor: '#F7F9FC',
              borderRadius: '8px',
              paddingTop: '6px',
              paddingBottom: '6px'
            }
          }}
        />
      </Box>
    </div>
  );
};

export default AtomTableExtraccion;