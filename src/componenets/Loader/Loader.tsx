import React from 'react';
import { CircularProgress, Box } from '@mui/material';
let classes = require('./Loader.module.scss');

interface LoaderProps {
  size?: number | string;
  thickness?: number;
  fullScreen?: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 40, 
  thickness = 3.6, 
  fullScreen = false,
  message 
}) => {
  return (
    <Box 
      className={fullScreen ? classes.fullScreen : classes.container}
      role="status" 
      aria-label="Loading..."
    >
      <CircularProgress
        size={size}
        thickness={thickness}
        className={classes.spinner}
        disableShrink
      />
      {message && (
        <div className={classes.message}>
          {message}
        </div>
      )}
    </Box>
  );
};

export default Loader;
