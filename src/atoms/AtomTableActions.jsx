import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Button,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  pageOptions,
  limitGeneral,
  pageGeneral,
} from "../containers/constantes";

import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

const AtomTableActions = (props) => {
  const {
    rows,
    buttonMenu,
    showIcons = false,
    columnsToShow,
    columnsToMap,
    pagination = true,
    limit,
    page = pageGeneral,
    handleChangePage,
    handleChangeRowsPerPage,
    totalData = 0,
    mostrarIndice = false,
    footer = null,
    detailsColumns = null,
    actionsDetails = null,
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const rowsPerPageOptions =
    totalData > limitGeneral && totalData <= 100
      ? [...pageOptions, totalData]
      : [...pageOptions];

  const toggleRowExpansion = (index) => {
    setExpandedRow((prevIndex) => (prevIndex === index ? null : index));
  };

  const onChangePage = (event, newPage) => {
    handleChangePage(newPage + 1);
  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj) || "";
  };

  const formatValueByType = (value, type) => {
    if (value === null || value === undefined || value === "") return "N/A";

    const number = parseFloat(value);

    if (type === "numero") {
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
      return number.toLocaleString("es-EC", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    if (number) {
      return number.toLocaleString("es-EC", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    return value;
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const styles = {
    tableCell: {
      fontWeight: 500,
      fontSize: 12,
      color: "#A0A0A0",
      backgroundColor: "#f9f9f9",
      position: "sticky",
      top: 0,
      zIndex: 1,
      textTransform: "uppercase",
    },
    cellNumber: {
      fontWeight: 500,
      fontSize: 12,
      color: "#A0A0A0",
      position: "sticky",
    },
    tableCellDetails: {
      fontWeight: 400,
      fontSize: 12,
      color: "white",
      backgroundColor: "details.main",
      position: "sticky",
    },
  };
  const menuItems = (row) => {
    const open = Boolean(anchorEl) && selectedRow === row;

    if (!columnsToShow.includes("Acciones")) {
      return null;
    }
    // const filteredButtons =
    //   row.kpiName === "Rotación de Venta"
    //     ? buttonMenu.filter((item) => item.label === "Eliminar")
    //     : buttonMenu;

    if (showIcons) {
      return (
        <Box sx={{ display: "flex" }}>
          {buttonMenu?.map((item) => (
            <Tooltip title={item.label}>
              <IconButton
                key={`icon-${item.id}`}
                onClick={() => item.onClick(row, rows.indexOf(row))}
                color={item.color}
                sx={{
                  width: 30,
                  height: 30,
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      );
    }

    return (
      <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={(event) => handleClick(event, row)}
        >
          <MoreVertIcon sx={{ color: "#5D6FFF" }} />
        </IconButton>
        <Menu
          id="long-menu"
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "",
            },
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              style: {
                width: "auto",
              },
            },
          }}
        >
          {buttonMenu?.map((item) => (
            <MenuItem
              key={`item-${item.id}`}
              onClick={() => {
                item.onClick(selectedRow, rows.indexOf(selectedRow));
                handleClose();
              }}
              sx={{
                backgroundColor: "#F3F2F8",
                border: "none",
                borderRadius: "5px",
                fontWeight: "400",
                fontSize: "14px",
                margin: 1,
                gap: 1,
                color: `${item.color}.main`,
                display: "flex",
                alignItems: "center",
                "&:hover": {
                  transition: "all 0.3s ease",
                  backgroundColor: `${item.color}.main`,
                  color: "white",
                },
              }}
            >
              {React.cloneElement(item.icon, { fontSize: "medium" })}
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  };

  return (
    <TableContainer
      variant="outlined"
      component={Paper}
      sx={{
        borderRadius: "8px",
        width: "100%",
        mt: 1,
        mb: 2,
        maxHeight: "62vh",
        overflow: "auto",
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {mostrarIndice && <TableCell sx={styles.tableCell}></TableCell>}
            {columnsToShow?.map((column, index) => (
              <TableCell
                key={`column-${index}`}
                align="left"
                sx={styles.tableCell}
              >
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.length > 0 ? (
            <>
              {rows?.map((row, rowIndex) => (
                <React.Fragment key={row.id || rowIndex}>
                  <TableRow
                    key={rowIndex}
                    sx={{
                      fontSize: 13,
                      backgroundColor:
                        rowIndex % 2 === 0 ? "#f5f5ff" : "#ffffff",
                      cursor: row.details ? "pointer" : "default",
                    }}
                    onClick={() => row.details && toggleRowExpansion(rowIndex)}
                  >
                    {mostrarIndice && (
                      <TableCell align="left" sx={styles.cellNumber}>
                        {(page - 1) * limit + rowIndex + 1}
                      </TableCell>
                    )}
                    {columnsToMap?.map((column, index) => {
                      const value = row.id;

                      return (
                        <TableCell
                          key={`${row.id}-${index}`}
                          align="left"
                          sx={{
                            fontSize: 12,
                          }}
                        >
                          {Object.keys(row)[index] === "state" &&
                          (row[column] === 1 || row[column] === 0) ? (
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor:
                                  row[column] === 1 ? "green" : "red",
                              }}
                            />
                          ) : row[column] === true || row[column] === false ? (
                            row[column] === true ? (
                              "SI"
                            ) : (
                              "NO"
                            )
                          ) : (
                            formatValueByType(
                              getNestedValue(row, column),
                              column
                            )
                          )}
                        </TableCell>
                      );
                    })}
                    {columnsToShow?.includes("Acciones") && (
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {menuItems(row)}
                          {row.details && (
                            <IconButton size="small">
                              {expandedRow ? (
                                <ExpandLessIcon
                                  sx={{
                                    color: "#149f1a",
                                    borderRadius: "50%",
                                  }}
                                />
                              ) : (
                                <ExpandMoreIcon
                                  sx={{
                                    color: "#149f1a",
                                    borderRadius: "50%",
                                  }}
                                />
                              )}
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                  {row?.details && (
                    <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                      <TableCell colSpan={columnsToShow.length + 1}>
                        <Collapse
                          in={expandedRow === rowIndex}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box>
                            <Typography
                              sx={{
                                color: "text.secondary",
                                fontSize: 13,
                                fontWeight: 500,
                              }}
                              gutterBottom
                            >
                              Detalles:
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  {detailsColumns.map((col, idx) => (
                                    <TableCell
                                      sx={styles.tableCellDetails}
                                      key={idx}
                                    >
                                      {col.label}
                                    </TableCell>
                                  ))}
                                  {actionsDetails && (
                                    <TableCell sx={styles.tableCell}>
                                      Acciones
                                    </TableCell>
                                  )}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row?.details?.map((detalle, idx) => (
                                  <TableRow
                                    key={idx}
                                    sx={{ backgroundColor: "white" }}
                                  >
                                    {detailsColumns.map((col, i) => (
                                      <TableCell
                                        sx={{
                                          fontSize: 12,
                                          color: "#575757",
                                        }}
                                        key={i}
                                      >
                                        {detalle[col.field]}
                                      </TableCell>
                                    ))}
                                    {actionsDetails && (
                                      <TableCell>
                                        {actionsDetails.map((item, index) => (
                                          <IconButton
                                            key={index}
                                            color={item.color}
                                            onClick={() =>
                                              item.onClick(detalle, index)
                                            }
                                          >
                                            {item.icon}
                                          </IconButton>
                                        ))}
                                      </TableCell>
                                    )}
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

              {footer && (
                <TableRow sx={{ backgroundColor: "white" }}>
                  <TableCell
                    colSpan={footer.colspan}
                    sx={{
                      textAlign: "center",
                      fontSize: "13px",
                      textTransform: "capitalize",
                      fontWeight: "500",
                      lineHeight: "28px",
                      height: "50px",
                      color: "primary.main",
                    }}
                  >
                    {footer?.title}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "left",
                      fontSize: "13px",
                      textTransform: "capitalize",
                      fontWeight: "500",
                      lineHeight: "28px",
                      color: "primary.main",
                    }}
                  >
                    {(() => {
                      const valor = footer?.field;
                      const total = formatValueByType(
                        rows.reduce(
                          (sum, item) => sum + parseFloat(item[valor]),
                          0
                        ),
                        footer?.type
                      );
                      const esCommissionWeight =
                        valor === "commissionWeight" || valor === "weight";
                      const esMayorA100 = total > 100;

                      const contenido = (
                        <Box
                          sx={{
                            color:
                              esCommissionWeight && esMayorA100
                                ? "red"
                                : "inherit",
                            fontWeight:
                              esCommissionWeight && esMayorA100
                                ? "bold"
                                : "inherit",
                          }}
                        >
                          {formatValueByType(total, footer?.type)}
                        </Box>
                      );

                      return esCommissionWeight && esMayorA100 ? (
                        <Tooltip title="El peso es mayor a 100">
                          {contenido}
                        </Tooltip>
                      ) : (
                        contenido
                      );
                    })()}
                  </TableCell>
                  {footer?.field1 && (
                    <TableCell
                      sx={{
                        textAlign: "left",
                        fontSize: "14px",
                        textTransform: "capitalize",
                        fontWeight: "500",
                        lineHeight: "28px",
                      }}
                    >
                      $
                      {(() => {
                        const valor = footer.field1;
                        return formatValueByType(
                          rows.reduce(
                            (sum, item) => sum + parseFloat(item[valor]),
                            0
                          ),
                          footer?.type
                        );
                      })()}
                    </TableCell>
                  )}
                  {footer?.field2 && (
                    <TableCell
                      sx={{
                        textAlign: "left",
                        fontSize: "14px",
                        textTransform: "capitalize",
                        fontWeight: "500",
                        lineHeight: "28px",
                      }}
                    >
                      $
                      {(() => {
                        const valor = footer?.field2;
                        return formatValueByType(
                          rows.reduce(
                            (sum, item) => sum + parseFloat(item[valor]),
                            0
                          ),
                          footer?.type
                        );
                      })()}
                    </TableCell>
                  )}
                  <TableCell></TableCell>
                </TableRow>
              )}
            </>
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnsToShow?.length + (buttonMenu?.length ? 1 : 0)}
              >
                <Box textAlign="center" py={2}>
                  <Typography variant="body1" color="textSecondary">
                    No existen datos registrados.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && (
        <TableRow
          sx={{
            fontWeight: "bold",
            color: "#A0A0A0",
            backgroundColor: "#f9f9f9",
            position: "sticky",
            bottom: -1,
            zIndex: 1,
          }}
        >
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            count={totalData}
            rowsPerPage={limit}
            page={page - 1}
            onPageChange={(event, newPage) =>
              handleChangePage(event, newPage + 1)
            }
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          />
        </TableRow>
      )}
    </TableContainer>
  );
};

AtomTableActions.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleClickMenu: PropTypes.func,
  handleChangePage: PropTypes.func,
  handleChangeRowsPerPage: PropTypes.func,
  totalData: PropTypes.number,
  page: PropTypes.number,
  limit: PropTypes.number,
  buttonMenu: PropTypes.arrayOf(PropTypes.object),
  showIcons: PropTypes.bool,
  columnsToShow: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnsToMap: PropTypes.arrayOf(PropTypes.string).isRequired,
  pagination: PropTypes.bool,
};

export default AtomTableActions;