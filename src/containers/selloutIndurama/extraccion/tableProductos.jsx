import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, TablePagination, Paper
} from "@mui/material";

const TablaSeleccionProductos = ({
    columns,
    data,
    page,
    limit,
    count,
    selectable,
    selected,
    setSelected,
    setPage,
    setLimit,
}) => {

    const getRealIndex = (localIndex) => page * limit + localIndex;

    const handleSelectRow = (realIndex) => {
        if (!selectable) return;

        if (selected.includes(realIndex)) {
            setSelected(selected.filter(x => x !== realIndex));
        } else {
            setSelected([...selected, realIndex]);
        }
    };

    const handleSelectAll = () => {
        const pageData = data.slice(page * limit, page * limit + limit);
        const indexesOnPage = pageData.map((_, i) => getRealIndex(i));

        if (indexesOnPage.every(idx => selected.includes(idx))) {
            setSelected(selected.filter(x => !indexesOnPage.includes(x)));
        } else {
            setSelected([...new Set([...selected, ...indexesOnPage])]);
        }
    };

    const pageData = data.slice(page * limit, page * limit + limit);
    const indexesOnPage = pageData.map((_, i) => getRealIndex(i));

    return (
        <Paper elevation={1} sx={{
            width: "100%", mb: 1, border: "1px solid #e0e0e0",
            borderRadius: 3,
        }}>
            <TableContainer sx={{
                maxHeight: 340,
                borderRadius: 3,
            }}>
                <Table size="small" stickyHeader>

                    <TableHead >
                        <TableRow>

                            {selectable && (
                                <TableCell padding="checkbox" sx={{
                                    backgroundColor: "#f5f5f5",
                                    color: "#070730ff",
                                }}>
                                    <Checkbox
                                        checked={
                                            indexesOnPage.length > 0 &&
                                            indexesOnPage.every(idx => selected.includes(idx))
                                        }
                                        indeterminate={
                                            indexesOnPage.some(idx => selected.includes(idx)) &&
                                            !indexesOnPage.every(idx => selected.includes(idx))
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                            )}

                            {columns.map((col) => (
                                <TableCell key={col.field} sx={{
                                    color: "#0d5dc5ff",
                                    fontWeight: "bold", backgroundColor: "#f5f5f5"
                                }}>
                                    {col.label}
                                </TableCell>
                            ))}

                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {pageData.map((row, localIndex) => {
                            const realIndex = getRealIndex(localIndex);

                            return (
                                <TableRow
                                    key={realIndex}
                                    hover
                                    onClick={() => handleSelectRow(realIndex)}
                                    sx={{ cursor: "pointer" }}
                                >

                                    {selectable && (
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={selected.includes(realIndex)} />
                                        </TableCell>
                                    )}

                                    {columns.map((col) => (
                                        <TableCell key={col.field}>{row[col.field]}</TableCell>
                                    ))}

                                </TableRow>
                            );
                        })}
                    </TableBody>

                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={count}
                sx={{
                    backgroundColor: "#f5f5f5"
                }}
                page={page}
                rowsPerPage={limit}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setLimit(parseInt(e.target.value, 100));
                    setPage(0);
                }}
                labelRowsPerPage="Filas por página:"
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
            />
        </Paper>
    );
};

export default TablaSeleccionProductos;
