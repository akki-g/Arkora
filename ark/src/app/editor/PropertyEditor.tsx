"use client";

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider,
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Switch,
  FormControlLabel,
  SelectChangeEvent
} from '@mui/material';
import useEditorStore from '@/store/editorStore';
import { getComponentDefinition } from '@/lib/componentRegistry';
import { ComponentInstance, PropertyDefinition } from '@/types/editor';

interface PropertyFieldProps {
  name: string;
  config: PropertyDefinition;
  value: any;
  onChange: (name: string, value: any) => void;
}

const PropertyField = ({ name, config, value, onChange }: PropertyFieldProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
        const newValue = config.type === 'boolean' 
          ? (e.target as HTMLInputElement).checked 
          : (e.target as { value: unknown }).value;
        
        onChange(name, newValue);
      };
  
    const handleSelectChange = (e: SelectChangeEvent<unknown>) => {
        onChange(name, e.target.value);
    };

  // Format display name from camelCase
  const displayName = name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
  
  switch (config.type) {
    case 'string':
    case 'number':
      return (
        <TextField
          fullWidth
          margin="dense"
          id={name}
          label={displayName}
          type={config.type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={handleInputChange}
          size="small"
        />
      );
      
    case 'select':
      return (
        <FormControl fullWidth margin="dense" size="small">
          <InputLabel id={`${name}-label`}>{displayName}</InputLabel>
          <Select
            labelId={`${name}-label`}
            id={name}
            value={value}
            label={displayName}
            onChange={handleSelectChange}
          >
            {config.options?.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
      
    case 'color':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
          <TextField
            margin="dense"
            id={name}
            label={displayName}
            value={value}
            onChange={handleInputChange}
            size="small"
            sx={{ flexGrow: 1, mr: 1 }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            style={{ width: 40, height: 40, padding: 0, border: 'none' }}
          />
        </Box>
      );
      
    case 'boolean':
      return (
        <FormControlLabel
          control={
            <Switch
              checked={value}
              onChange={handleInputChange}
              name={name}
              color="primary"
            />
          }
          label={displayName}
          sx={{ my: 1 }}
        />
      );
      
    default:
      return (
        <TextField
          fullWidth
          margin="dense"
          id={name}
          label={displayName}
          value={value}
          onChange={handleInputChange}
          size="small"
        />
      );
  }
};

const PropertyEditor = () => {
  const { components, selectedComponentId, updateComponent, removeComponent } = useEditorStore();
  const [selectedComponent, setSelectedComponent] = useState<ComponentInstance | null>(null);
  
  // Find the selected component whenever selectedComponentId changes
  useEffect(() => {
    if (!selectedComponentId) {
      setSelectedComponent(null);
      return;
    }
    
    const findComponentById = (components: ComponentInstance[], id: string): ComponentInstance | null => {
      for (const component of components) {
        if (component.id === id) {
          return component;
        }
        
        if (component.children && component.children.length > 0) {
          const found = findComponentById(component.children, id);
          if (found) return found;
        }
      }
      
      return null;
    };
    
    const component = findComponentById(components, selectedComponentId);
    setSelectedComponent(component);
  }, [components, selectedComponentId]);
  
  if (!selectedComponent) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary">
          Select a component to edit its properties
        </Typography>
      </Box>
    );
  }
  
  const definition = getComponentDefinition(selectedComponent.type);
  
  if (!definition) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">
          Component type not found: {selectedComponent.type}
        </Typography>
      </Box>
    );
  }
  
  const handlePropertyChange = (name: string, value: any) => {
    if (selectedComponentId) {
      updateComponent(selectedComponentId, { [name]: value });
    }
    };
  
  const handleDelete = () => {
    if (selectedComponentId) {
      removeComponent(selectedComponentId);
    }
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        {definition.name} Properties
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {Object.entries(definition.properties).map(([name, config]) => (
        <PropertyField
          key={name}
          name={name}
          config={config}
          value={selectedComponent.props[name]}
          onChange={handlePropertyChange}
        />
      ))}
      
      <Divider sx={{ my: 2 }} />
      
      <Button 
        variant="outlined" 
        color="error" 
        onClick={handleDelete}
        fullWidth
      >
        Delete Component
      </Button>
    </Box>
  );
};

export default PropertyEditor;