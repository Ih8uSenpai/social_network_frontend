import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/theme/themeSlice';

const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

export const store = configureStore({
    reducer: {
        theme: themeReducer,
    },
    preloadedState: {
        theme: {
            mode: savedTheme === 'dark' ? 'dark' : 'light', // по умолчанию light
        },
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
