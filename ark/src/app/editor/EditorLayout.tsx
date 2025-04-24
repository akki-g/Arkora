// src/components/editor/EditorLayout.tsx
"use client";

import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, Divider } from '@mui/material';
import ComponentLibrary from './ComponentLibrary';
import Canvas from './Canvas';
import PropertyEditor from './PropertyEditor';
import PreviewPanel from './PreviewPanel';
import useEditorStore from '@/store/editorStore';
import BrowserFrame from './BrowserFrame';

const drawerWidth = 280;

const EditorLayout = () => {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const { components, initializeCanvas } = useEditorStore();
  
  // Initialize canvas with a default container
  useEffect(() => {
    if (components.length === 0) {
      initializeCanvas();
    }
  }, [components.length, initializeCanvas]);
  
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Top App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            App Builder Platform
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              sx={{ 
                cursor: 'pointer', 
                fontWeight: mode === 'edit' ? 'bold' : 'normal',
                textDecoration: mode === 'edit' ? 'underline' : 'none'
              }}
              onClick={() => setMode('edit')}
            >
              Edit
            </Typography>
            <Typography
              sx={{ 
                cursor: 'pointer', 
                fontWeight: mode === 'preview' ? 'bold' : 'normal',
                textDecoration: mode === 'preview' ? 'underline' : 'none'
              }}
              onClick={() => setMode('preview')}
            >
              Preview
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Left Sidebar - Component Library */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {/* This creates space for the AppBar */}
        <Box sx={{ overflow: 'auto', height: '100%' }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Components
          </Typography>
          <Divider />
          <ComponentLibrary />
        </Box>
      </Drawer>
      
      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* This creates space for the AppBar */}
        
        {mode === 'edit' ? (
          <BrowserFrame>
            <Canvas />
          </BrowserFrame>
        ) : (
          <PreviewPanel components={components} />
        )}
    </Box>
      
      {/* Right Sidebar - Property Editor */}
      {mode === 'edit' && (
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar /> {/* This creates space for the AppBar */}
          <Box sx={{ overflow: 'auto', height: '100%' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Properties
            </Typography>
            <Divider />
            <PropertyEditor />
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default EditorLayout;