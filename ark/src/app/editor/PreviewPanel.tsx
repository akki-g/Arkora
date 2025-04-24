"use client";

import { Box, Paper } from '@mui/material';
import { ComponentType, ComponentInstance } from '@/types/editor';
import { CSSProperties } from 'react';

interface PreviewPanelProps {
  components: ComponentInstance[];
}

const PreviewPanel = ({ components }: PreviewPanelProps) => {
  const renderPreviewComponent = (component: ComponentInstance) => {
    // Preview doesn't have editor functionality like selection
    switch (component.type) {
      case ComponentType.CONTAINER:
        return (
          <Box 
            key={component.id}
            sx={{ 
              position: 'relative',
              ...component.props as any
            }}
          >
            {Array.isArray(component.children) && 
              component.children.map((child) => renderPreviewComponent(child))}
          </Box>
        );
        
      case ComponentType.TEXT:
        return (
          <div 
            key={component.id}
            style={component.props as CSSProperties}
          >
            {component.props.content}
          </div>
        );
        
      case ComponentType.BUTTON:
        return (
          <button
            key={component.id}
            style={{
              padding: '8px 16px',
              backgroundColor: component.props.variant === 'contained' ? '#1976d2' : 'transparent',
              color: component.props.variant === 'contained' ? 'white' : '#1976d2',
              border: component.props.variant === 'outlined' ? '1px solid #1976d2' : 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: component.props.fullWidth ? '100%' : 'auto',
              ...(component.props as CSSProperties)
            }}
          >
            {component.props.text}
          </button>
        );
        
      case ComponentType.INPUT:
        return (
          <div key={component.id}>
            <label 
              style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontWeight: component.props.required ? 'bold' : 'normal',
              }}
            >
              {component.props.label}
              {component.props.required && ' *'}
            </label>
            <input
              type="text"
              placeholder={component.props.placeholder}
              style={{
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: component.props.fullWidth ? '100%' : 'auto',
              }}
            />
          </div>
        );
        
      case ComponentType.IMAGE:
        return (
          <img
            key={component.id}
            src={component.props.src}
            alt={component.props.alt}
            style={{
              width: component.props.width,
              height: component.props.height,
              objectFit: component.props.objectFit as 'fill' | 'contain' | 'cover' | 'none' | 'scale-down',
            }}
          />
        );
        
      default:
        return (
          <div key={component.id}>
            Unknown component type: {component.type}
          </div>
        );
    }
  };
  
  return (
    <Paper 
      elevation={2}
      sx={{
        height: 'calc(100vh - 100px)',
        width: '100%',
        overflow: 'auto',
        backgroundColor: 'white',
        p: 2,
      }}
    >
      {components.map(component => renderPreviewComponent(component))}
    </Paper>
  );
};

export default PreviewPanel;