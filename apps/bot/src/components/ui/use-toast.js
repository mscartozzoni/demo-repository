
// Inspired by react-hot-toast library
import React from 'react';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

let memoryState = {
  toasts: [],
};

const listeners = [];

let toastCount = 0;

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return toastCount.toString();
}

const dispatch = (action) => {
  const { type, toast, toastId } = action;

  switch (type) {
    case 'ADD_TOAST':
      memoryState = {
        ...memoryState,
        toasts: [toast, ...memoryState.toasts].slice(0, TOAST_LIMIT),
      };
      break;

    case 'UPDATE_TOAST':
      memoryState = {
        ...memoryState,
        toasts: memoryState.toasts.map((t) =>
          t.id === toast.id ? { ...t, ...toast } : t
        ),
      };
      break;

    case 'DISMISS_TOAST':
      // The toast is still in the DOM, so we can animate it out.
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', toastId });
      }, TOAST_REMOVE_DELAY);

      memoryState = {
        ...memoryState,
        toasts: memoryState.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      };
      break;

    case 'REMOVE_TOAST':
      if (toastId === undefined) {
        memoryState = { ...memoryState, toasts: [] };
      } else {
        memoryState = {
          ...memoryState,
          toasts: memoryState.toasts.filter((t) => t.id !== toastId),
        };
      }
      break;
    
    default:
        break;
  }

  listeners.forEach((listener) => {
    listener(memoryState);
  });
};

export const toast = (props) => {
  const id = genId();

  const update = (props) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
};

export function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}
