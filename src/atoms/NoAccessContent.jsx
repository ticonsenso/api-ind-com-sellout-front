import React from 'react';
import { Box, Typography, styled, keyframes } from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const GlassContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
  textAlign: 'center',
  maxWidth: '500px',
  margin: 'auto',
  animation: `${fadeIn} 0.6s ease-out forwards`,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #0072CE 0%, #00C6FF 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  boxShadow: '0 0 20px rgba(0, 114, 206, 0.4)',
  animation: `${pulse} 3s ease-in-out infinite`,
  '& svg': {
    fontSize: '40px',
    color: 'white',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  color: '#202020ff',
  fontWeight: 800,
  fontSize: '1.5rem',
  marginBottom: theme.spacing(1),
  background: 'linear-gradient(90deg, #3b3b3bff, #2b2828ff)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: 'rgba(61, 61, 61, 0.6)',
  fontSize: '1rem',
  fontWeight: 400,
  maxWidth: '300px',
}));

const NoAccessContent = ({ title = "Acceso Restringido", message = "No cuentas con los permisos necesarios para ver esta sección." }) => {
  return (
    <Box sx={{
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: 3
    }}>
      <GlassContainer>
        <IconWrapper>
          <LockIcon />
        </IconWrapper>
        <Title variant="h5">{title}</Title>
        <Subtitle variant="body1">
          {message}
        </Subtitle>
      </GlassContainer>
    </Box>
  );
};

export default NoAccessContent;
