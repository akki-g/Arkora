"use client";

import { useEffect } from "react";
import dynamic from 'next/dynamic';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const EditorLayout = dynamic (
    () => import ('@/app/editor/EditorLayout'),
    { ssr: false }
);

export default function EditorPage() {
  // Add Material Icons (in your layout or via a script tag)
    useEffect(() => {
        // Add Material Icons if not already added
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
        link.rel = 'stylesheet';
        document.head.appendChild(link);


        return () => {
         // Clean up on unmount
            document.head.removeChild(link)
        };
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <EditorLayout />
        </DndProvider>
    );
}
