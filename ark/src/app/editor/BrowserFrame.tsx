"use client";

import { useState } from 'react';
import { Box, Paper, IconButton, TextField, Select, MenuItem, Typography } from '@mui/material';

interface BrowserFrameProps {
  children: React.ReactNode;
}

const BrowserFrame = ({ children }: BrowserFrameProps) => {
  const [viewportSize, setViewportSize] = useState('desktop');
  
  const getViewportStyles = () => {
    switch(viewportSize) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Browser Chrome */}
      <Paper 
        elevation={3}
        sx={{ 
          width: '100%', 
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          bgcolor: '#f0f0f0',
          mb: 0
        }}
      >
        {/* Browser Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
          {/* Window Controls */}
          <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f57' }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#fdbc2c' }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#28c941' }} />
          </Box>
          
          {/* Navigation Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <IconButton size="small">
              <span className="material-icons" style={{ fontSize: 18 }}>arrow_back</span>
            </IconButton>
            <IconButton size="small">
              <span className="material-icons" style={{ fontSize: 18 }}>arrow_forward</span>
            </IconButton>
            <IconButton size="small">
              <span className="material-icons" style={{ fontSize: 18 }}>refresh</span>
            </IconButton>
          </Box>
          
          {/* URL Bar */}
          <TextField
            size="small"
            fullWidth
            defaultValue="https://myapp.example.com/"
            InputProps={{
              startAdornment: (
                <span className="material-icons" style={{ fontSize: 16, marginRight: 4 }}>
                  lock
                </span>
              ),
            }}
            sx={{ 
              bgcolor: '#fff', 
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
              },
            }}
          />
          
          {/* Viewport Controls */}
          <Select
            size="small"
            value={viewportSize}
            onChange={(e) => setViewportSize(e.target.value)}
            sx={{ ml: 2, minWidth: 120 }}
          >
            <MenuItem value="desktop">Desktop</MenuItem>
            <MenuItem value="tablet">Tablet</MenuItem>
            <MenuItem value="mobile">Mobile</MenuItem>
          </Select>
        </Box>
      </Paper>
      
      {/* Browser Content */}
      <Paper 
        elevation={3}
        sx={{ 
          flexGrow: 1, 
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: 2,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          bgcolor: '#f5f5f5',
          overflow: 'auto'
        }}
      >
        <Box 
          sx={{ 
            ...getViewportStyles(),
            transition: 'width 0.3s, height 0.3s',
            overflow: 'auto',
            bgcolor: '#ffffff',
            boxShadow: viewportSize !== 'desktop' ? '0 0 10px rgba(0,0,0,0.1)' : 'none',
            border: viewportSize !== 'desktop' ? '1px solid #e0e0e0' : 'none',
          }}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
};

export default BrowserFrame;