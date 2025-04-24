import { nanoid } from 'nanoid';

import {
    ComponentType, 
    ComponentDefinition,
    ComponentInstance
} from '@/types/editor';


export const componentRegistry: Record<ComponentType, ComponentDefinition> = {
    [ComponentType.CONTAINER]: {
        type: ComponentType.CONTAINER, 
        name: 'Container',
        icon: 'dashboard',
        category: 'layout',
        properties: {
            width: { type: 'string', default: '100%' },
            height: { type: 'string', default: 'auto'},
            backgroundColor: { type: 'color', default: '#ffffff'},
            padding: { type: 'string', default: '16px'},
            border: { type: 'string', default: 'none' },
            borderRadius: { type: 'string', default: '0px' },
        },
        children: true,
    },

    [ComponentType.TEXT]: {
        type: ComponentType.TEXT,
        name: 'Text',
        icon: 'text_fields',
        category: 'basic',
        properties: {
            content: { type: 'string', default: 'Text content' },
            color: { type: 'color', default: '#000000' },
            fontSize: { type: 'string', default: '16px' },
            fontWeight: { type: 'select', options: ['normal', 'bold'], default: 'normal'},
            textAlign: { type: 'select', options: ['left', 'center', 'right'], default: 'left' }
        },
        children: false,
    },

    [ComponentType.BUTTON]: {
        type: ComponentType.BUTTON,
        name: 'Button',
        icon: 'smart_button',
        category: 'basic',
        properties: {
          text: { type: 'string', default: 'Button' },
          variant: { type: 'select', options: ['contained', 'outlined', 'text'], default: 'contained' },
          color: { type: 'select', options: ['primary', 'secondary', 'error', 'info', 'success', 'warning'], default: 'primary' },
          size: { type: 'select', options: ['small', 'medium', 'large'], default: 'medium' },
          fullWidth: { type: 'boolean', default: false },
        },
        children: false,
      },

      [ComponentType.INPUT]: {
        type: ComponentType.INPUT,
        name: 'Input Field',
        icon: 'input',
        category: 'form',
        properties: {
          label: { type: 'string', default: 'Label' },
          placeholder: { type: 'string', default: 'Enter text...' },
          variant: { type: 'select', options: ['outlined', 'filled', 'standard'], default: 'outlined' },
          required: { type: 'boolean', default: false },
          fullWidth: { type: 'boolean', default: true },
        },
        children: false,
      },
      
      [ComponentType.IMAGE]: {
        type: ComponentType.IMAGE,
        name: 'Image',
        icon: 'image',
        category: 'media',
        properties: {
          src: { type: 'string', default: 'https://via.placeholder.com/300x200' },
          alt: { type: 'string', default: 'Image description' },
          width: { type: 'string', default: '100%' },
          height: { type: 'string', default: 'auto' },
          objectFit: { type: 'select', options: ['fill', 'contain', 'cover', 'none', 'scale-down'], default: 'cover' },
        },
        children: false,
      },
    };


    export const getComponentDefinition = (type: ComponentType): ComponentDefinition | null => {
        return componentRegistry[type] || null;
    }

    export const createComponent = (
        type: ComponentType,
        overrideProps: Record<string, any> = {}
    ): ComponentInstance => {
        const definition = getComponentDefinition(type);
        if (!definition) { 
            throw new Error(`Component type ${type} not found`)
        }

        const defaultProps = Object.entries(definition.properties).reduce<Record<string, any>>((acc, [key, config])=> {
            acc[key] = config.default;
            return acc;
        }, {});

        return {
            id: `${type}_${nanoid(6)}`,
            type,
            props: { ...defaultProps, ...overrideProps},
            children: [],
        };
    };

    export const getAllCompoents = () : ComponentDefinition[] => {
        return Object.values(componentRegistry);
    };

    export const getComponentsByCategory = (): Record<string, ComponentDefinition[]> => {
        return Object.values(componentRegistry).reduce<Record<string, ComponentDefinition[]>>((acc, component) => {
          if (!acc[component.category]) {
            acc[component.category] = [];
          }
          acc[component.category].push(component);
          return acc;
        }, {});
    };