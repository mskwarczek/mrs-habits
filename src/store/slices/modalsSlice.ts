import { createSlice, SerializedError } from '@reduxjs/toolkit';

export interface IModal {
  isOpen: boolean;
}

export interface IModalsState {
  creatorModal: IModal;
  error?: SerializedError;
}

const initialModalState = {
  isOpen: false,
};

const initialState = {
  creatorModal: initialModalState,
  error: undefined,
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openCreatorModal(state) {
      state.creatorModal.isOpen = true;
      state.error = initialState.error;
    },
    closeCreatorModal(state) {
      state.creatorModal.isOpen = false;
      state.error = initialState.error;
    },
  },
});

export const { openCreatorModal, closeCreatorModal } = modalsSlice.actions;

export default modalsSlice.reducer;
