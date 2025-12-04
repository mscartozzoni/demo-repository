
import React, { createContext, useReducer, useMemo, useCallback } from 'react';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const ToastContext = createContext(undefined);

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case 'UPDATE_TOAST':
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === action.toast.id ? { ...t, ...action.toast } : t
          ),
        };
    case 'DISMISS_TOAST':
        const { toastId } = action;
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t, open: false } : t
          ),
        };
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { toasts: [] });

  const toast = useCallback((props) => {
    const id = genId();

    const update = (props) =>
      dispatch({
        type: 'UPDATE_TOAST',
        toast: { ...props, id: id },
      });

    const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

    dispatch({
      type: 'ADD_TOAST',
      toast: {
        ...props,
        id: id,
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
  }, []);

  const value = useMemo(() => ({ ...state, toast }), [state, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export { ToastProvider, ToastContext };
