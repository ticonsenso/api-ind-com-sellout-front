import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  IconButton,
  Collapse,
  styled,
  alpha,
  Paper
} from "@mui/material";
import {
  DeleteForever as DeleteForeverIcon,
  FactCheck as FactCheckIcon,
  CheckCircle as CheckCircleIcon,
  Unpublished as UnpublishedIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  EditSquare as EditSquareIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { pageOptions, limitGeneral, formatValueByType } from "../containers/constantes";

const decimalesCantidad = 2;
const colorSortActive = "#0072CE"; // Brand Blue
const colorSortInactive = "#B0B0B0";


// --- Styled Components for Clean Floating Table ---
const RootContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0),
  width: "100%",
  display: "flex",
  flexDirection: "column",
  height: "100%", // Adapts to container
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "transparent",
  boxShadow: "none",
  flex: 1, // Fill available space
  overflowY: "auto", // Scroll internally
  overflowX: "auto",
  "& .MuiTable-root": {
    borderCollapse: "separate",
    borderSpacing: "0 8px", // Reduced spacing for tighter look
    width: "100%", // Force full width
    minWidth: "1000px", // Ensure it doesn't squish too much on small screens (scrolls instead)
    tableLayout: "fixed", // Better control over column widths
  },
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
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
  overflow: "hidden",
  verticalAlign: "middle",
}));

import { Tooltip } from "@mui/material";

const ActionButton = styled(Button)(({ theme, colorKey, isIconOnly }) => {
  const colors = {
    success: { main: "#2e7d32", bg: "#e8f5e9" },
    error: { main: "#c62828", bg: "#ffebee" },
    info: { main: "#0072CE", bg: "rgba(0, 114, 206, 0.1)" }, // Brand Blue
    warning: { main: "#ed6c02", bg: "#fff3e0" },
    setting: { main: "#4527a0", bg: "#ede7f6" },
  };
  const current = colors[colorKey] || colors.info;

  return {
    minWidth: isIconOnly ? "36px" : "36px",
    width: isIconOnly ? "36px" : "auto",
    height: "36px",
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.8rem",
    padding: isIconOnly ? "0" : "0 12px",
    color: current.main,
    backgroundColor: current.bg,
    border: "1px solid transparent",
    boxShadow: "none",
    transition: "all 0.2s ease",
    marginLeft: "4px",
    marginRight: "4px",

    "&:hover": {
      backgroundColor: current.main,
      color: "#fff",
      transform: "translateY(-2px)",
      boxShadow: `0 4px 10px ${alpha(current.main, 0.4)}`,
    },
  };
});

const AtomTableForm = (props) => {
  const {
    columns,
    data,
    actions,
    pagination,
    page,
    limit,
    count,
    textDetails,
    handleChangePage,
    handleChangeRowsPerPage,
    showRowNumber,
    detailsColumns,
    showIcons = false,
    selectable = false,
    selectedRows = [],
    onSelectionChange = () => { },
    onDeleteSelected
  } = props;

  const [expandedRow, setExpandedRow] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState("asc");

  const handleSort = (field) => {
    if (!field) return;
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  const getSortedData = () => {
    if (!orderBy) return data;
    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      return order === "asc"
        ? String(aValue).localeCompare(String(bValue), "es", { sensitivity: "base" })
        : String(bValue).localeCompare(String(aValue), "es", { sensitivity: "base" });
    });
  };

  const handleSelectRow = (id) => {
    let newSelection;
    if (selectedRows.includes(id)) {
      newSelection = selectedRows.filter((rowId) => rowId !== id);
    } else {
      newSelection = [...selectedRows, id];
    }
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((row) => row.id));
    }
  };

  const rowsPerPageOptions =
    count > limitGeneral && count <= 100
      ? [...pageOptions, count]
      : [...pageOptions];

  const toggleRowExpansion = (index) => {
    setExpandedRow((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <RootContainer>
      <StyledTableContainer component={Paper}>
        <Table stickyHeader aria-label="custom table">
          <TableHead>
            <TableRow>
              {selectable && (
                <StyledHeaderCell sx={{ width: "60px" }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: "pointer", width: "18px", height: "18px", accentColor: "#0072CE" }}
                  />
                  {selectedRows.length > 0 && (
                    <IconButton
                      onClick={() => onDeleteSelected?.(selectedRows)}
                      size="small"
                      color="error"
                      sx={{ ml: 1, padding: 0 }}
                    >
                      <DeleteForeverIcon fontSize="small" />
                    </IconButton>
                  )}
                </StyledHeaderCell>
              )}

              {showRowNumber && <StyledHeaderCell sx={{ width: "60px" }}>#</StyledHeaderCell>}
              {detailsColumns?.length > 0 && <StyledHeaderCell sx={{ width: "50px" }} />}

              {columns?.map((column, index) => {
                const isActive = orderBy === column.field;
                return (
                  <StyledHeaderCell
                    key={index}
                    align={column?.align || "left"}
                    onClick={() => column.field && handleSort(column.field)}
                    sx={{
                      cursor: column.field ? "pointer" : "default",
                      width: column.width || "auto"
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent={column.align === 'right' ? 'flex-end' : 'flex-start'}>
                      {column.label}
                      {column.field && (
                        <Box component="span" sx={{ ml: 1, display: 'flex', alignItems: 'center', color: isActive ? "#fff" : "rgba(255,255,255,0.6)" }}>
                          {isActive ? (
                            order === "asc" ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                          ) : (
                            <ArrowUpwardIcon fontSize="small" sx={{ opacity: 0.5, "&:hover": { opacity: 1, color: "#fff" } }} />
                          )}
                        </Box>
                      )}
                    </Box>
                  </StyledHeaderCell>
                );
              })}

              {actions?.length > 0 && (
                <StyledHeaderCell align="center" sx={{ minWidth: "100px", width: "auto" }}>Acciones</StyledHeaderCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.length > 0 ? (
              <>
                {getSortedData()?.map((row, rowIndex) => (
                  <React.Fragment key={row.id || rowIndex}>
                    <StyledBodyRow>
                      {selectable && (
                        <StyledBodyCell padding="checkbox">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => handleSelectRow(row.id)}
                            style={{ cursor: "pointer", width: "18px", height: "18px", margin: "auto", display: "block", accentColor: "#0072CE" }}
                          />
                        </StyledBodyCell>
                      )}
                      {showRowNumber && <StyledBodyCell>{rowIndex + 1}</StyledBodyCell>}

                      {detailsColumns?.length > 0 && (
                        <StyledBodyCell>
                          <IconButton
                            size="small"
                            onClick={() => row.details && toggleRowExpansion(rowIndex)}
                            sx={{
                              color: expandedRow === rowIndex ? "#0072CE" : "inherit",
                              background: expandedRow === rowIndex ? alpha("#0072CE", 0.1) : "transparent"
                            }}
                          >
                            {expandedRow === rowIndex ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </StyledBodyCell>
                      )}

                      {columns?.map((column, colIndex) => (
                        <StyledBodyCell
                          key={colIndex}
                          align={column?.align || "left"}
                          sx={{
                            textAlign: ["dinero", "porcentaje", "number"].includes(column?.type) ? "right" : "left",
                          }}
                        >
                          {column?.render ? (
                            column?.render(row)
                          ) : typeof row[column?.field] === "boolean" ? (
                            row[column?.field] ? (
                              <CheckCircleIcon fontSize="small" sx={{ color: "#2e7d32" }} />
                            ) : (
                              <UnpublishedIcon fontSize="small" sx={{ color: "#d32f2f" }} />
                            )
                          ) : ["valor", "amount", "estimated_value"].includes(column?.field) ? (
                            parseFloat(row[column?.field]).toFixed(decimalesCantidad)
                          ) : (
                            formatValueByType(row[column?.field], column?.type)
                          )}
                        </StyledBodyCell>
                      ))}

                      {actions?.length > 0 && (
                        <StyledBodyCell align="center">
                          <Box
                            display="flex"
                            justifyContent="center"
                            sx={{
                              flexWrap: 'wrap',
                              width: '100%',
                              margin: '0 auto',
                              gap: '4px'
                            }}
                          >
                            {actions?.map((action, actionIndex) => {
                              if (
                                action.label === "Descargar formato" &&
                                row.sourceType !== "FILE"
                              ) return null;
                              if (action.visible && !action.visible(row)) return null;

                              const colorKey = action.color || "info";

                              const buttonContent = (
                                <ActionButton
                                  key={actionIndex}
                                  colorKey={colorKey}
                                  onClick={() => action?.onClick(row, rowIndex)}
                                  size="small"
                                  isIconOnly={showIcons}
                                >
                                  {showIcons ? (
                                    action?.color === "success" ? <FactCheckIcon fontSize="small" /> :
                                      action?.color === "info" ? <EditSquareIcon fontSize="small" /> :
                                        action?.color === "error" ? <DeleteForeverIcon fontSize="small" /> :
                                          action?.color === "setting" ? <SettingsIcon fontSize="small" /> :
                                            action?.color === "warning" ? <WarningIcon fontSize="small" /> : null
                                  ) : action.label}
                                </ActionButton>
                              );

                              return showIcons ? (
                                <Tooltip key={actionIndex} title={action.label} arrow placement="top">
                                  <span>{buttonContent}</span>
                                </Tooltip>
                              ) : (
                                buttonContent
                              );
                            })}
                          </Box>
                        </StyledBodyCell>
                      )}
                    </StyledBodyRow>

                    {row?.details && (
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0, border: 'none' }}
                          colSpan={columns.length + 2 + (selectable ? 1 : 0)}
                        >
                          <Collapse in={expandedRow === rowIndex} timeout="auto" unmountOnExit>
                            <Box sx={{
                              margin: "10px 24px 24px 24px",
                              padding: 3,
                              background: "#f8fafc",
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0',
                            }}>
                              <Typography variant="subtitle2" gutterBottom component="div" sx={{ color: '#0072CE', fontWeight: 700, fontSize: "0.95rem" }}>
                                {textDetails}:
                              </Typography>
                              <Table size="small" aria-label="details">
                                <TableHead>
                                  <TableRow>
                                    {detailsColumns?.map((col, idx) => (
                                      <TableCell key={idx} sx={{ fontWeight: 600, color: '#555', borderBottom: '1px solid #cbd5e1' }}>{col.label}</TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {row?.details?.map((detail, idx) => (
                                    <TableRow key={idx}>
                                      {detailsColumns?.map((col, i) => (
                                        <TableCell key={i} component="th" scope="row" sx={{ borderBottom: '1px solid #e2e8f0' }}>
                                          {detail[col.field]}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={(columns?.length || 0) + (selectable ? 1 : 0) + (showRowNumber ? 1 : 0) + (detailsColumns?.length > 0 ? 1 : 0) + (actions?.length > 0 ? 1 : 0)}
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

      {data?.length > 0 && pagination && (
        <Box sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          px: 2,
          py: 1,
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <TablePagination
            component="div"
            rowsPerPageOptions={rowsPerPageOptions}
            count={count}
            rowsPerPage={limit}
            page={page - 1}
            onPageChange={(event, newPage) => handleChangePage(event, newPage + 1)}
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
      )}
    </RootContainer>
  );
};

export default AtomTableForm;