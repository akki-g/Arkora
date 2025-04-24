"use client";

import { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
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
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item: { componentType: ComponentType }) => {
      addComponent(item.componentType, parentId);
      return { dropped: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));
  
  const isActive = isOver && canDrop;

  useEffect(() => {
    drop(ref);
  }, [drop]);

  return (
    <Box
      ref={ref}
      sx={{
        height: isRoot ? '100%' : '20px',
        width: '100%',
        backgroundColor: isActive ? '#e3f2fd' : 'transparent',
        borderRadius: '4px',
        border: isActive ? '2px dashed #2196f3' : 'none',
        marginY: isRoot ? 0 : 1,
        transition: 'all 0.2s',
      }}
    />
  );
};

export default DropZone;