"use client";

import { CSSProperties } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import useEditorStore from '@/store/editorStore';
import DropZone from './DropZone';
import { getComponentDefinition } from '@/lib/componentRegistry';
import { ComponentType, ComponentInstance } from '@/types/editor';

const Canvas = () => {
  const { components, selectedComponentId, selectComponent } = useEditorStore();
  
  const renderComponent = (component: ComponentInstance) => {
    const isSelected = component.id === selectedComponentId;
    const definition = getComponentDefinition(component.type);
    
    if (!definition) {
      return <div>Component type not found: {component.type}</div>;
    }
    
    // Common props for all components
    const commonProps = {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        selectComponent(component.id);
      },
      style: {
        cursor: 'pointer',
        border: isSelected ? '2px solid #2196f3' : 'none',
        ...component.props,
      } as CSSProperties,
    };
    
    // Render based on component type
    switch (component.type) {
      case ComponentType.CONTAINER:
        return (
          <Box 
            key={component.id}
            {...commonProps}
            sx={{ 
              position: 'relative',
              minHeight: '50px',
              ...component.props
            }}
          >
            {Array.isArray(component.children) && component.children.length > 0 ? (
              component.children.map((child, index) => (
                <div key={child.id}>
                  <DropZone parentId={component.id} index={index} />
                  {renderComponent(child)}
                </div>
              ))
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: '100%',
                  opacity: 0.5
                }}
              >
                <Typography>Drop components here</Typography>
              </Box>
            )}
            <DropZone 
              parentId={component.id} 
              index={component.children ? component.children.length : 0} 
            />
          </Box>
        );
        
      case ComponentType.TEXT:
        return (
          <Typography 
            key={component.id}
            variant="body1" 
            {...commonProps}
          >
            {component.props.content}
          </Typography>
        );
        
      case ComponentType.BUTTON:
        return (
          <button
            key={component.id}
            {...commonProps}
            style={{
              ...commonProps.style,
              padding: '8px 16px',
              backgroundColor: component.props.variant === 'contained' ? '#1976d2' : 'transparent',
              color: component.props.variant === 'contained' ? 'white' : '#1976d2',
              border: component.props.variant === 'outlined' ? '1px solid #1976d2' : 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: component.props.fullWidth ? '100%' : 'auto',
            }}
          >
            {component.props.text}
          </button>
        );
        
      case ComponentType.INPUT:
        return (
          <div key={component.id} {...commonProps}>
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
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        );
        
      case ComponentType.IMAGE:
        return (
          <Box key={component.id} {...commonProps}>
            <img
              src={component.props.src}
              alt={component.props.alt}
              style={{
                width: component.props.width,
                height: component.props.height,
                objectFit: component.props.objectFit as 'fill' | 'contain' | 'cover' | 'none' | 'scale-down',
              }}
            />
          </Box>
        );
        
      default:
        return (
          <Box key={component.id} {...commonProps}>
            Unknown component type: {component.type}
          </Box>
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
        backgroundColor: '#fafafa',
        p: 2,
      }}
    >
      {components.length === 0 ? (
        <DropZone parentId={null} isRoot />
      ) : (
        components.map((component) => renderComponent(component))
      )}
    </Paper>
  );
};

export default Canvas;