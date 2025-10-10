import { RootState } from '../index';
import { PendingActionDescriptor } from './authPromptSlice';

interface AuthPromptSliceShape {
  open: boolean;
  reason?: string;
  pendingAction?: PendingActionDescriptor | null;
  triggerElementId?: string;
}

const slice = (state: RootState) => state.authPrompt as AuthPromptSliceShape;

export const selectAuthPromptOpen = (state: RootState) => slice(state).open;
export const selectAuthPromptReason = (state: RootState) => slice(state).reason;
export const selectAuthPromptPending = (state: RootState) => slice(state).pendingAction;
export const selectAuthPromptTriggerId = (state: RootState) => slice(state).triggerElementId;
