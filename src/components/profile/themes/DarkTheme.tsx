import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    margin: 8,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    margin: 8,
                    color: 'white',
                    borderRadius: '4px',
                    backgroundColor: '#4b4c57',
                    '&:hover': {
                        backgroundColor: '#656775',
                        color: '#90caf9',
                    },
                    textTransform:"none",
                    transitionDuration:'0.5s'
                },
            },
        },
        MuiList: {
            styleOverrides: {
                root: {

                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '5px',
                    },
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 36, // Уменьшаем минимальную ширину для иконок
                    color: 'rgba(255, 255, 255, 0.7)', // Цвет иконок
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.23)', // Фон для аватара
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: '#fff', // Белый цвет для основного текста (название трека)
                },
                secondary: {
                    color: 'rgba(255, 255, 255, 0.7)', // Светлее для второстепенного текста (исполнитель)
                },
            },
        },

        // Добавляем стилизацию для других компонентов, если необходимо
    },
});
