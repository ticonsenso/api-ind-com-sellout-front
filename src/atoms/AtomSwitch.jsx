import { Box, Typography, Tooltip, Switch } from '@mui/material';
import PropTypes from 'prop-types';
const AtomSwitch = ({ title, tooltip, checked, onChange }) => {
    return (
        <Tooltip title={tooltip}>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // border: '1px solid #D8D8D8',
                borderRadius: 2,
                backgroundColor: '#F5F5F5',
                padding: 1,
                mb: 1,
                mt: 2,
            }}>
            <Typography
                sx={{
                    fontSize: 15,
                    color: '#727176',
                    fontWeight: 400,
                }}>{title}</Typography>
            <Switch
                color="info"
                checked={checked}
                onChange={onChange}
                />
            </Box>
        </Tooltip>
    );
};

AtomSwitch.propTypes = {
    title: PropTypes.string.isRequired,
    tooltip: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
};

export default AtomSwitch;