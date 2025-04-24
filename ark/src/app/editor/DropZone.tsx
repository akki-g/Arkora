"use client";

import { useRef, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDrop } from 'react-dnd';
import useEditorStore from '@/store/editorStore';
import { ComponentType } from '@/types/editor';

interface DropZoneProps {
  parentId: string | null;
  index?: number;
  isRoot?: boolean;
}

const DropZone = ({ parentId, index, isRoot = false }: DropZoneProps) => {
  const { addComponent } = useEditorStore();
  const ref = useRef<HTMLDivElement>(null);
  
  // Debug state for visibility
  const [debugMode] = useState(true); // Initially true for debugging
  
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item: { componentType: ComponentType }, monitor) => {
      console.log('Item dropped:', item.componentType, 'parentId:', parentId);
      addComponent(item.componentType, parentId);
      return { dropped: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));
  
  const isActive = isOver && canDrop;

  // Always connect the ref
  useEffect(() => {
    drop(ref);
  }, [drop]);

  return (
    <Box
      ref={ref}
      sx={{
        height: isRoot ? '100%' : debugMode ? '30px' : '20px',
        width: '100%',
        backgroundColor: isActive 
          ? '#e3f2fd' 
          : debugMode 
            ? 'rgba(0, 0, 255, 0.05)' 
            : 'transparent',
        borderRadius: '4px',
        border: isActive 
          ? '2px dashed #2196f3' 
          : debugMode 
            ? '1px dashed #ccc' 
            : 'none',
        marginY: isRoot ? 0 : 1,
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
        }
      }}
    >
      {debugMode && !isRoot && (
        <Typography variant="caption" color="text.secondary">
          Drop Zone
        </Typography>
      )}
    </Box>
  );
};

export default DropZone;