import { useDispatch, useSelector } from "react-redux";
import {AppDispatch, RootState} from "../../app/store";
import { toggleTheme } from "./themeSlice";


export const useAppTheme = () => {
    const dispatch: AppDispatch = useDispatch();
    const isDarkMode = useSelector((state: RootState) => state.theme.mode === "dark");

    const handleToggle = () => {
        dispatch(toggleTheme());
    };

    return {
        isDarkMode,
        toggleTheme: handleToggle,
    };
};
