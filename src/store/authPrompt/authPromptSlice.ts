import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PendingActionDescriptor {
  type: string;
  payload?: any;
}

interface RequireAuthPayload {
  reason?: string;
  pendingAction?: PendingActionDescriptor | null;
  triggerElementId?: string; // to restore focus
}

interface AuthPromptState {
  open: boolean;
  reason?: string;
  pendingAction?: PendingActionDescriptor | null;
  triggerElementId?: string;
}

const initialState: AuthPromptState = {
  open: false,
  reason: undefined,
  pendingAction: null,
  triggerElementId: undefined,
};

const authPromptSlice = createSlice({
  name: 'authPrompt',
  initialState,
  reducers: {
    requireAuth: (state, action: PayloadAction<RequireAuthPayload | undefined>) => {
      state.open = true;
      state.reason = action.payload?.reason;
      state.pendingAction = action.payload?.pendingAction || null;
      state.triggerElementId = action.payload?.triggerElementId;
    },
    closeAuthPrompt: (state) => {
      state.open = false;
      state.reason = undefined;
      state.pendingAction = null;
      state.triggerElementId = undefined;
    },
    authSatisfied: (state) => {
      // consumer (middleware/thunk) can read pendingAction before it is cleared if needed
      state.open = false;
      state.reason = undefined;
      state.triggerElementId = undefined;
    },
    clearPendingAction: (state) => {
      state.pendingAction = null;
    }
  }
});

export const { requireAuth, closeAuthPrompt, authSatisfied, clearPendingAction } = authPromptSlice.actions;
export default authPromptSlice.reducer;
