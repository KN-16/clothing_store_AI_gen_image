import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingScreen({message}) {
  return (
    <Box 
      sx={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: 'rgba(0, 0, 0, 0.05)', // Tạo background nhẹ nhàng
        flexDirection: 'column',
      }}
    >
      <CircularProgress 
        size={70} 
        color="primary" // Màu sắc của spinner
        thickness={5} // Độ dày của vòng xoay
        sx={{ animationDuration: '500ms', marginBottom: 2 }} // Tăng tốc độ xoay một chút
      />
      <Typography 
        variant="h6" 
        color="textSecondary" 
        sx={{ fontWeight: 'bold', letterSpacing: 1.5 }}
      >
        {message}...
      </Typography>
    </Box>
  );
}
