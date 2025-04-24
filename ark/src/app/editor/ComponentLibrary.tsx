"use client";

import { useRef, useEffect, useState } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import { getComponentsByCategory } from '@/lib/componentRegistry';
import { ComponentDefinition } from '@/types/editor';

const ComponentCard = ({ component }: { component: ComponentDefinition }) => {
  // Create a ref for the paper element
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, connectDrag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { componentType: component.type },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Connect the drag to the ref in an effect
  useEffect(() => {
    connectDrag(ref);
  }, [connectDrag]);

  return (
    <Paper
      ref={ref}
      elevation={1}
      sx={{
        p: 2,
        m: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? '#f0f0f0' : 'white',
      }}
    >
      <Box sx={{ 
        width: 40, 
        height: 40, 
        backgroundColor: '#e3f2fd', 
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span className="material-icons">{component.icon}</span>
      </Box>
      <Typography variant="body1">{component.name}</Typography>
    </Paper>
  );
};

const ComponentLibrary = () => {
    const [expanded, setExpanded] = useState<string | null>(null);
    const componentsByCategory = getComponentsByCategory();
    
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : null);
    };
  
    // Capitalize first letter of category
    const formatCategory = (category: string) => {
      return category.charAt(0).toUpperCase() + category.slice(1);
    };
  
    return (
      <Box sx={{ p: 2 }}>
        {Object.entries(componentsByCategory).map(([category, components]) => (
          <Accordion 
            key={category}
            expanded={expanded === category}
            onChange={handleChange(category)}
          >
            <AccordionSummary 
              expandIcon={<span className="material-icons">expand_more</span>}
            >
              <Typography>{formatCategory(category)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {components.map((component) => (
                  <ComponentCard key={component.type} component={component} />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };
  
  export default ComponentLibrary;