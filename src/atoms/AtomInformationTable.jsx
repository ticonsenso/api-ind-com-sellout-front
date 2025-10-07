import { Table, TableBody, TableCell, TableRow } from '@mui/material';

const styles = {
    table: {
        width: '100%',
        backgroundColor: 'white',
        border: '1px solid #D8D8D8',
        mb: 1,
    },
    tableCell: {
        fontWeight: 400,
        fontSize: 13,
        },  
        tableCellValue: {
        fontWeight: 400,
    }
}

const AtomInformationTable = ({ data }) => {
    return (
        <Table 
        sx={{ 
            width: '100%',
            backgroundColor: '#fbfbfb', 
            mb: 2,
        }}>
            <TableBody>
                {Object.entries(data).map(([key, value]) => (
                    <TableRow key={key}>
                        <TableCell sx={styles.tableCell}>
                            {key}:
                        </TableCell>
                        <TableCell sx={styles.tableCellValue}>
                            {typeof value === 'boolean' ? (value ? 'Activo' : 'Inactivo') : value || '-'}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default AtomInformationTable;