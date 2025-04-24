import { initialize } from "next/dist/server/lib/render-server";

// Defines all TypeScript interfaces and types for the editor
// Contains the ComponentType enum that lists all available component types
// Defines interfaces for components, properties, and the editor state
// Provides type safety throughout the application

// component types enum
export enum ComponentType { 
    CONTAINER = 'container',
    TEXT = 'text',
    BUTTON = 'button',
    IMAGE = 'image',
    INPUT = 'input',
}

// property types
export type PropertyType = 'string' | 'number' | 'boolean' | 'select' | 'color';

// componenet definition
export interface PropertyDefinition {
    type: PropertyType;
    default: any;
    options?: string[];
}

// component definition
export interface ComponentDefinition {
    type: ComponentType;
    name: string;
    icon: string;
    category: string;
    properties: Record<string, PropertyDefinition>;
    children: boolean;
}

// component instance
export interface ComponentInstance {
    id: string;
    type: ComponentType;
    props: Record<string, any>;
    children: ComponentInstance[];
}

export interface EditorState {
    components: ComponentInstance[];
    selectedComponentId: string | null;
    addComponent: (type: ComponentType, parentId?: string | null) => string;
    updateComponent: (id: string, props: Record<string, any>) => void;
    removeComponent: (id: string) => void;
    selectComponent: (id: string | null) => void;
    moveComponent: (sourceId: string, targetId: string, position?: 'inside' | 'before' | 'after') => void;
    clearCanvas: () => void;
    initializeCanvas: () => void;
}