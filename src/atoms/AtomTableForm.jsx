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
  Tooltip,
  IconButton,
  Collapse,
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
} from "@mui/icons-material";
import { pageOptions } from "../containers/constantes";
import { limitGeneral } from "../containers/constantes";

const decimalesCantidad = 2;

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
  } = props;

  const [expandedRow, setExpandedRow] = useState(null);

  const rowsPerPageOptions =
    count > limitGeneral && count <= 100
      ? [...pageOptions, count]
      : [...pageOptions];

  const colorSuccess = "#57CA22";
  const cololContentSuccess = "#ECF5F6";
  const colorError = "#FF1A44";
  const colorInfo = "#33C2FF";
  const colorContentInfo = "#DDECFA";
  const colorContentError = "#F2DAE7";
  const colorContentWarning = "#F2DAE7";
  const colorWarning = "#FF9800";
  const colorSetting = "#1d22b2";
  const colorContentSetting = "#e0e1ff";

  const coloresActions = {
    success: {
      color: colorSuccess,
      content: cololContentSuccess,
    },
    error: {
      color: colorError,
      content: colorContentError,
    },
    info: {
      color: colorInfo,
      content: colorContentInfo,
    },
    warning: {
      color: colorWarning,
      content: colorContentWarning,
    },
    setting: {
      color: colorSetting,
      content: colorContentSetting,
    },
  };

  const formatValueByType = (value, type) => {
    if (value === null || value === undefined || value === "") return "N/A";

    const number = parseFloat(value);

    if (type === "dinero") {
      return number.toLocaleString("es-EC", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });
    }

    if (type === "porcentaje") {
      return (
        number.toLocaleString("es-EC", {
          minimumFractionDigits: 2,
        }) + "%"
      );
    }

    if (type === "number") {
      return number.toLocaleString("es-EC", {
        minimumFractionDigits: 2,
      });
    }

    return value;
  };

  const toggleRowExpansion = (index) => {
    setExpandedRow((prevIndex) => (prevIndex === index ? null : index));
  };

  const styleTable = {
    cell: {
      fontSize: "13px",
      fontWeight: 500,
      zIndex: 1,
      minWidth: "80px",
      position: "sticky",
      top: 0,
      backgroundColor: "#ffffffff",
      textTransform: "uppercase",
      color: "#424242e0",
      lineHeight: "23px",
      // textAlign: "center",
    },
  };
  return (
    <TableContainer
      sx={{
        borderRadius: "15px",
        height: "auto",
        // maxHeight: "62vh",
        overflow: "auto",
        border: "none",
        borderTop: "1px solid #EDEDED",
        boxShadow: 2,
        mt: 1,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {showRowNumber && (
              <TableCell
                sx={{
                  zIndex: 1,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#ffffffff",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#6f6f6f",
                  width: "40px",
                }}
              ></TableCell>
            )}

            {detailsColumns?.length > 0 && (
              <TableCell
                sx={{
                  zIndex: 1,
                  position: "sticky",
                  top: 0,
                  minWidth: "20px",
                  width: "15px",
                }}
              ></TableCell>
            )}
            {columns?.map((column, index) => (
              <TableCell
                key={index}
                align={column?.align || "left"}
                sx={{
                  ...styleTable.cell,
                  textAlign:
                    column?.type === "dinero" ||
                      column?.type === "porcentaje" ||
                      column?.type === "number"
                      ? "right"
                      : "left",
                }}
              >
                {column?.label}
              </TableCell>
            ))}
            {actions?.length > 0 && (
              <TableCell
                align="center"
                sx={{
                  ...styleTable.cell,
                }}
              >
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length > 0 ? (
            <>
              {data?.map((row, rowIndex) => (
                <React.Fragment key={row.id || rowIndex}>
                  <TableRow>
                    {showRowNumber && <TableCell>{rowIndex + 1}</TableCell>}
                    {detailsColumns?.length > 0 && (
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            row.details && toggleRowExpansion(rowIndex)
                          }
                        >
                          {expandedRow === rowIndex ? (
                            <KeyboardArrowUpIcon
                              sx={{
                                backgroundColor: "details.main",
                                borderRadius: "50%",
                                color: "white",
                              }}
                            />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    )}
                    {columns?.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        align={column?.align || "left"}
                        sx={{
                          fontSize: "12px",
                          backgroundColor: "#f9f9f9b4",
                          color: "#595959ff",
                          fontWeight: "400",
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textAlign:
                            column?.type === "dinero" ||
                              column?.type === "porcentaje" ||
                              column?.type === "number"
                              ? "right"
                              : "left",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                        onClick={() =>
                          row.details && toggleRowExpansion(rowIndex)
                        }
                      >
                        {column?.render ? (
                          column?.render(row)
                        ) : typeof row[column?.field] === "boolean" ? (
                          row[column?.field] ? (
                            <CheckCircleIcon sx={{ color: "green" }} />
                          ) : (
                            <UnpublishedIcon sx={{ color: "red" }} />
                          )
                        ) : column?.field === "valor" ||
                          column?.field === "amount" ||
                          column?.field === "estimated_value" ? (
                          parseFloat(row[column?.field]).toFixed(
                            decimalesCantidad
                          )
                        ) : (
                          formatValueByType(row[column?.field], column?.type)
                        )}
                        {console.log(column)}
                      </TableCell>
                    ))}
                    {actions?.length > 0 && (
                      <TableCell align="center" sx={{ backgroundColor: "#f9f9f9", }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "7px",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          {actions?.map((action, actionIndex) => {
                            if (
                              action.label === "Descargar formato" &&
                              row.sourceType !== "FILE"
                            ) {
                              return null;
                            }
                            if (action.visible && !action.visible(row)) {
                              return null;
                            }
                            const colorKey = action.color || "info";
                            const colorStyles =
                              coloresActions[colorKey] || coloresActions.info;

                            return (
                              <Button
                                key={actionIndex}
                                onClick={() => action?.onClick(row, rowIndex)}
                                startIcon={
                                  showIcons && (
                                    <Box
                                      sx={{
                                        minWidth: 10,
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        marginRight: "-12px",
                                        height: "32px",
                                      }}
                                    >
                                      {action?.color === "success" ? (
                                        <Tooltip title={action?.label}>
                                          <FactCheckIcon fontSize="small" />
                                        </Tooltip>
                                      ) : action?.color === "info" ? (
                                        <Tooltip title={action?.label}>
                                          <EditSquareIcon fontSize="small" />
                                        </Tooltip>
                                      ) : action?.color === "error" ? (
                                        <Tooltip title={action?.label}>
                                          <DeleteForeverIcon fontSize="small" />
                                        </Tooltip>
                                      ) : action?.color === "setting" ? (
                                        <Tooltip title={action?.label}>
                                          <SettingsIcon fontSize="small" />
                                        </Tooltip>
                                      ) : action?.color === "warning" ? (
                                        <Tooltip title={action?.label}>
                                          <WarningIcon fontSize="small" />
                                        </Tooltip>
                                      ) : null}
                                    </Box>
                                  )
                                }
                                sx={{
                                  minWidth: 10,
                                  height: "32px",
                                  border: `1px solid ${colorStyles.color}`,
                                  backgroundColor: colorStyles.content,
                                  color: colorStyles.color,
                                  fontWeight: 400,
                                  textTransform: "capitalize",
                                  fontSize: "14px",
                                  borderRadius: "8px",
                                  display: "flex",
                                  "&:hover": {
                                    backgroundColor:
                                      colorKey === "success"
                                        ? "#c8f7cd"
                                        : colorKey === "info"
                                          ? "#c2ebf3"
                                          : colorKey === "error"
                                            ? "#ffb1af"
                                            : colorKey === "setting"
                                              ? "#c9cbff"
                                              : colorKey === "warning"
                                                ? "#ffe9b3"
                                                : "#e0e0e0",
                                  },
                                }}
                              >
                                {!showIcons && (
                                  <>
                                    {action?.color === "success" ? (
                                      <FactCheckIcon fontSize="small" />
                                    ) : action?.color === "info" ? (
                                      <EditSquareIcon fontSize="small" />
                                    ) : action?.color === "error" ? (
                                      <DeleteForeverIcon fontSize="small" />
                                    ) : action?.color === "setting" ? (
                                      <SettingsIcon fontSize="small" />
                                    ) : action?.color === "warning" ? (
                                      <WarningIcon fontSize="small" />
                                    ) : null}
                                    {action?.label}
                                  </>
                                )}
                              </Button>
                            );
                          })}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                  {row?.details && (
                    <TableRow
                      sx={{
                        height: expandedRow === rowIndex ? "5px" : "0px",
                        overflow: "hidden",
                        border: "none",
                      }}
                    >
                      <TableCell
                        colSpan={columns.length + 2}
                        sx={{
                          border: "none",
                          backgroundColor:
                            expandedRow === rowIndex ? "#f9f9f9" : "white",
                        }}
                      >
                        <Collapse in={expandedRow === rowIndex} unmountOnExit>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#6f6f6f",
                              }}
                              gutterBottom
                            >
                              {textDetails}:
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  {detailsColumns?.map((col, idx) => (
                                    <TableCell
                                      sx={{
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        backgroundColor: "details.main",
                                        textTransform: "capitalize",
                                        color: "white",
                                      }}
                                      key={idx}
                                    >
                                      {col.label}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row?.details?.map((detail, idx) => (
                                  <TableRow key={idx}>
                                    {detailsColumns?.map((col, i) => (
                                      <TableCell
                                        sx={{
                                          fontSize: "12px",
                                          color: "#6f6f6f",
                                          fontWeight: "400",
                                          backgroundColor: "white",
                                        }}
                                        key={i}
                                      >
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
              {pagination && (
                <TableRow>
                  <TablePagination
                    sx={{
                      color: "#757575",
                      backgroundColor: "#f9f9f9",
                      position: "sticky",
                      bottom: -1,
                      zIndex: 1,
                    }}
                    count={count}
                    rowsPerPageOptions={rowsPerPageOptions}
                    page={page - 1}
                    rowsPerPage={limit}
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
            </>
          ) : (
            <TableRow>
              <TableCell
                colSpan={
                  columns?.length +
                  (actions?.length ? 1 : 0) +
                  (showRowNumber ? 1 : 0) +
                  (detailsColumns?.length ? 1 : 0)
                }
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
    </TableContainer>
  );
};

export default AtomTableForm;