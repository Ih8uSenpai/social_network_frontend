import { createTheme } from '@mui/material/styles';

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
                    backgroundColor: '#f1f1f1',
                    '&:hover': {
                        backgroundColor: '#d5d5d5',
                        color: '#1976d2',
                    },
                    textTransform: "none",
                    transitionDuration: '0.5s'
                },
            },
        },
        MuiList: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        cursor:'pointer'
                    },
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 36,
                    color: 'rgba(0, 0, 0, 0.7)',
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: '#000',
                },
                secondary: {
                    color: 'rgba(0, 0, 0, 0.7)',
                },
            },
        },
    },
});



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
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor:'rgba(0, 0, 0, 0.4)'
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        cursor:'pointer'
                    },
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 36,
                    color: 'rgba(255, 255, 255, 0.7)',
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.23)',
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: '#fff',
                },
                secondary: {
                    color: 'rgba(255, 255, 255, 0.7)',
                },
            },
        },

    },
});
