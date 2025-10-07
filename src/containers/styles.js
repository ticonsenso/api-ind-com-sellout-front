export const stylesContent = {
    container: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      m:0,
      p:0,
      overflow: 'auto',
    },
    
    toggleButtonContainer: {
      '& .MuiToggleButton-root': {
        borderRadius: '8px',
        border: '1px solid #727176',
        marginRight: '8px',
        '&:hover': {
          borderColor: '#5D6FFF',
          color: '#5D6FFF',
        },
        '&.Mui-selected': {
          borderColor: '#5D6FFF',
          color: '#5D6FFF',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(93, 111, 255, 0.1)',
          },
        },
      },
      '& .MuiToggleButtonGroup-grouped:not(:last-of-type)': {
        marginRight: '8px',
      },
    },
  };