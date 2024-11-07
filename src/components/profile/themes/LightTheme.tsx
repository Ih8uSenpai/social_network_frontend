import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    margin: 8,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.23)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'black',
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
                    color: 'black',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0',
                    '&:hover': {
                        backgroundColor: '#d6d6d6',
                        color: '#3f51b5',
                    },
                    textTransform: "none",
                    transitionDuration: '0.5s'
                },
            },
        },
        MuiList: {
            styleOverrides: {
                root: {
                    // Add specific styles for the light theme if needed
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                        borderRadius: '5px',
                    },
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 36, // Minimal width for icons
                    color: 'rgba(0, 0, 0, 0.54)', // Icon color for the light theme
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0, 0, 0, 0.23)', // Background for avatar in light theme
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: '#000', // Black color for primary text (track name)
                },
                secondary: {
                    color: 'rgba(0, 0, 0, 0.54)', // Lighter for secondary text (artist)
                },
            },
        },
    },
});
