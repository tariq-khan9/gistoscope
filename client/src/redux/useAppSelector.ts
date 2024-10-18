// hooks.ts
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from './store'; // Adjust the path as needed

// Create a custom useAppSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
