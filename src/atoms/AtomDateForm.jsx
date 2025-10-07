import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, Typography } from '@mui/material';

const AtomDatePickerInputForm = (props) => {
  const {
    id,
    headerTitle,
    value,
    onChange,
    error = false,
    helperText = '',
    width = '100%',
    required = false,
  } = props;

  return (
    <Box>
      <Typography
        sx={{
          color: '#727176',
          fontSize: '13px',
        }}
      >
        {headerTitle}
        {required ? <span style={{ color: '#fb5f3f' }}> *</span> : ''}
      </Typography>
      <TextField
        id={id}
        type="date"
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        sx={{
          width: width,
          mb: 3,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            height: '51px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'gray',
          },
          '& .MuiInputLabel-root': {
            color: '#757575',
          },
        }}
      />
    </Box>
  );
};

AtomDatePickerInputForm.propTypes = {
  id: PropTypes.string.isRequired,
  headerTitle: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  width: PropTypes.string,
};

export default AtomDatePickerInputForm;