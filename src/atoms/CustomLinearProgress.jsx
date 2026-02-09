import { LinearProgress } from '@mui/material';

const CustomLinearProgress = ({ ...props }) => {
    return (
        <LinearProgress
            sx={{
                width: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 10000,
                height: '8px',
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, #91e9f5ff 0%, #189aceff 100%)`
                },
                '& .MuiLinearProgress-bar1Determinate': {
                    transition: 'width 0.2s ease-in-out',
                },
            }}
            {...props}
        />
    );
};

export default CustomLinearProgress;
