import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from './themeTypes';

interface ThemeState {
    mode: Theme;
}

const initialState: ThemeState = {
    mode: 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.mode);
        },
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.mode = action.payload;
            localStorage.setItem('theme', state.mode);
        },
    },
});


export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
