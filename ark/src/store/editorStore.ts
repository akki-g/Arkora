// src/store/editorStore.ts
import { create } from 'zustand';
import { createComponent } from '@/lib/componentRegistry';
import { ComponentType, ComponentInstance, EditorState } from '@/types/editor';

const useEditorStore = create<EditorState>((set, get) => ({
  // Canvas components tree
  components: [],
  
  // Currently selected component
  selectedComponentId: null,
  
  // Add a component to the canvas
  addComponent: (type, parentId = null) => {
    const newComponent = createComponent(type);
    
    set((state) => {
      // If no parent, add to root level
      if (!parentId) {
        return { components: [...state.components, newComponent] };
      }
      
      // Otherwise, add to children of specified parent
      const updatedComponents = addComponentToParent(
        state.components, 
        parentId, 
        newComponent
      );
      
      return { components: updatedComponents };
    });
    
    return newComponent.id;
  },
  
  // Update a component's properties
  updateComponent: (id, updatedProps) => {
    set((state) => {
      const updatedComponents = updateComponentInTree(
        state.components,
        id,
        updatedProps
      );
      
      return { components: updatedComponents };
    });
  },
  
  // Remove a component
  removeComponent: (id) => {
    set((state) => {
      const updatedComponents = removeComponentFromTree(state.components, id);
      const selectedId = state.selectedComponentId === id ? null : state.selectedComponentId;
      
      return { 
        components: updatedComponents,
        selectedComponentId: selectedId
      };
    });
  },
  
  // Select a component
  selectComponent: (id) => {
    set({ selectedComponentId: id });
  },
  
  // Move a component
  moveComponent: (sourceId, targetId, position = 'inside') => {
    set((state) => {
      // First, create a copy and remove the source component
      const [updatedComponents, movedComponent] = removeAndReturnComponent(
        state.components, 
        sourceId
      );
      
      if (!movedComponent) return state;
      
      // Then insert the component at the target position
      const finalComponents = position === 'inside'
        ? addComponentToParent(updatedComponents, targetId, movedComponent)
        : insertComponentNextTo(updatedComponents, targetId, movedComponent, position === 'before');
      
      return { components: finalComponents };
    });
  },
  
  // Clear canvas
  clearCanvas: () => {
    set({ components: [], selectedComponentId: null });
  },
  
  // Initialize with a default container
  initializeCanvas: () => {
    const rootContainer = createComponent(ComponentType.CONTAINER, {
      height: '500px',
      backgroundColor: '#f5f5f5',
    });
    
    set({ 
      components: [rootContainer],
      selectedComponentId: rootContainer.id
    });
  }
}));

// Helper function to add a component to a parent
function addComponentToParent(
  components: ComponentInstance[], 
  parentId: string, 
  newComponent: ComponentInstance
): ComponentInstance[] {
  return components.map(component => {
    if (component.id === parentId && Array.isArray(component.children)) {
      return {
        ...component,
        children: [...component.children, newComponent]
      };
    }
    
    if (Array.isArray(component.children)) {
      return {
        ...component,
        children: addComponentToParent(component.children, parentId, newComponent)
      };
    }
    
    return component;
  });
}

// Helper function to update a component
function updateComponentInTree(
  components: ComponentInstance[], 
  id: string, 
  updatedProps: Record<string, any>
): ComponentInstance[] {
  return components.map(component => {
    if (component.id === id) {
      return {
        ...component,
        props: {
          ...component.props,
          ...updatedProps
        }
      };
    }
    
    if (Array.isArray(component.children)) {
      return {
        ...component,
        children: updateComponentInTree(component.children, id, updatedProps)
      };
    }
    
    return component;
  });
}

// Helper function to remove a component
function removeComponentFromTree(components: ComponentInstance[], id: string): ComponentInstance[] {
  return components.filter(component => component.id !== id)
    .map(component => {
      if (Array.isArray(component.children)) {
        return {
          ...component,
          children: removeComponentFromTree(component.children, id)
        };
      }
      return component;
    });
}

// Helper function to remove and return a component
function removeAndReturnComponent(
    components: ComponentInstance[], 
    id: string, 
    parent: ComponentInstance | null = null
  ): [ComponentInstance[], ComponentInstance | null] {
    for (let i = 0; i < components.length; i++) {
      if (components[i].id === id) {
        const component = components[i];
        const updatedComponents = [
          ...components.slice(0, i),
          ...components.slice(i + 1)
        ];
        
        if (parent && Array.isArray(parent.children)) {
          // Explicitly set children as an array to satisfy TypeScript
          parent.children = updatedComponents as ComponentInstance[];
          return [components, component];
        }
        
        return [updatedComponents, component];
      }
      
      if (Array.isArray(components[i].children)) {
        const [updatedChildren, foundComponent] = removeAndReturnComponent(
          components[i].children, 
          id, 
          components[i]
        );
        
        if (foundComponent) {
          return [components, foundComponent];
        }
      }
    }
    
    return [components, null];
  }

// Helper function to insert a component next to another component
function insertComponentNextTo(
  components: ComponentInstance[], 
  targetId: string, 
  component: ComponentInstance, 
  before = true
): ComponentInstance[] {
  const result: ComponentInstance[] = [];
  
  for (let i = 0; i < components.length; i++) {
    if (components[i].id === targetId) {
      if (before) {
        result.push(component);
        result.push(components[i]);
      } else {
        result.push(components[i]);
        result.push(component);
      }
    } else {
      const currentComponent = { ...components[i] };
      
      if (Array.isArray(currentComponent.children)) {
        currentComponent.children = insertComponentNextTo(
          currentComponent.children,
          targetId,
          component,
          before
        );
      }
      
      result.push(currentComponent);
    }
  }
  
  return result;
}

export default useEditorStore;