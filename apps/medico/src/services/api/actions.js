
import { handleApiError } from './utils';

let mockActions = [];
let nextActionId = 1;

export const getActions = async () => {
    console.warn("getActions is using mock data.");
    return { success: true, data: mockActions };
};

export const addAction = async (actionData) => {
  try {
    const newAction = { id: nextActionId++, ...actionData, user_id: 'mock-user-id' };
    mockActions.push(newAction);
    return { success: true, data: newAction };
  } catch (error) {
    return handleApiError(error, 'addAction');
  }
};

export const updateAction = async (actionId, updates) => {
  try {
    let actionUpdated = null;
    mockActions = mockActions.map(action => {
      if (action.id === actionId) {
        actionUpdated = { ...action, ...updates };
        return actionUpdated;
      }
      return action;
    });
    if (!actionUpdated) throw new Error("Action not found");
    return { success: true, data: actionUpdated };
  } catch (error) {
    return handleApiError(error, 'updateAction');
  }
};

export const deleteAction = async (actionId) => {
  try {
    const initialLength = mockActions.length;
    mockActions = mockActions.filter(action => action.id !== actionId);
    if (mockActions.length === initialLength) throw new Error("Action not found");
    return { success: true, data: { id: actionId } };
  } catch (error) {
    return handleApiError(error, 'deleteAction');
  }
};
