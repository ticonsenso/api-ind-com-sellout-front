import { Box, Typography, Tooltip, Switch } from '@mui/material';
import PropTypes from 'prop-types';

const AtomSwitch = ({
    title,
    tooltip,
    checked,
    color = "#f5f5f5",
    height = "52px",
    onChange }) => {

    return (
        <Tooltip title={tooltip}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2,
                    backgroundColor: color,
                    height: height,
                    mb: 1,
                    gap: 1,
                    mt: 2.1,
                }}>
                <Typography
                    sx={{
                        fontSize: 15,
                        color: '#727176',
                        fontWeight: 400,
                    }}>{title}</Typography>
                <Switch
                    size='small'
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