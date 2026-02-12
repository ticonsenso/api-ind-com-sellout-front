import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Unpublished as UnpublishedIcon,
} from "@mui/icons-material";
import { formatValueByType } from "../containers/constantes";

const AtomTableInformationExtraccion = ({
  columns = [],
  data = [],
  pagination = true,
}) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer
      sx={{
        borderRadius: "15px",
        boxShadow: 1,
        overflow: "auto",
        maxHeight: `${limit * 42 + 80}px`,
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                position: "sticky",
                top: 0,
                height: "40px",
                minHeight: "40px",
                backgroundColor: "#f5f5f5",
                color: "#6f6f6f",
                width: "30px",
              }}
            ></TableCell>
            {columns.map((column, index) => (
              <TableCell
                key={index}
                align={column?.align || "left"}
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  minHeight: "40px",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f5f5f5",
                  color: "#6f6f6f",
                }}
              >
                {column?.label || column?.field}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.length > 0 ? (
            data
              .slice(page * limit, (page + 1) * limit)
              .map((row, rowIndex) => (
                <TableRow key={row.id || rowIndex}>
                  <TableCell
                    sx={{
                      fontSize: "12px",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    {rowIndex + 1}
                  </TableCell>
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      align={column?.align || "left"}
                      sx={{
                        fontSize: "13px",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {column?.render ? (
                        column.render(row)
                      ) : typeof row[column.field] === "boolean" ? (
                        row[column.field] ? (
                          <CheckCircleIcon sx={{ color: "green" }} />
                        ) : (
                          <UnpublishedIcon sx={{ color: "red" }} />
                        )
                      ) : (
                        formatValueByType(row[column.field], column.type)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box textAlign="center" py={2}>
                  <Typography variant="body2" color="textSecondary">
                    No existen datos registrados.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}

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
                count={data.length}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[25, 50, 100]}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count}`
                }
              />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AtomTableInformationExtraccion;