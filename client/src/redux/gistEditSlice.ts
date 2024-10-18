import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GistState {
  showModal: string;
  gistId: number | null;
  versionId: number | null;
  versionData: string;
  editId: number | null;
  editData: string;
}

const initialState: GistState = {
  showModal: 'hidden',
  gistId: null,
  versionId: null,
  versionData: '',
  editId: null,
  editData: ''
};

const gistEditSlice = createSlice({
  name: 'gistEdit',
  initialState,
  reducers: {
    setShowModal(state, action: PayloadAction<string>) {
      state.showModal = action.payload;
    },
    setGistId(state, action: PayloadAction<number | null>) {
      state.gistId = action.payload;
    },
    setVersionId(state, action: PayloadAction<number | null>) {
      state.versionId = action.payload;
    },
    setVersionData(state, action: PayloadAction<string>) {
      state.versionData = action.payload;
    },
    setEditId(state, action: PayloadAction<number | null>) {
      state.editId = action.payload;
    },
    setEditData(state, action: PayloadAction<string>) {
      state.editData = action.payload;
    },
  },
});

export const {
  setShowModal,
  setGistId,
  setVersionId,
  setVersionData,
  setEditId,
  setEditData,
} = gistEditSlice.actions;

export default gistEditSlice.reducer;
