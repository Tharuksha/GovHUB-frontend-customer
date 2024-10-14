import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#9ad6d7',
            light: '#d0f2f2',
            dark: '#68a3a4',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#ff6f61',
            light: '#ffa899',
            dark: '#c53f36',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#e57373',
            light: '#ffadad',
            dark: '#af4448',
            contrastText: '#FFFFFF',
        },
        warning: {
            main: '#ffb74d',
            light: '#ffe97d',
            dark: '#c88719',
            contrastText: '#FFFFFF',
        },
        info: {
            main: '#64b5f6',
            light: '#9be7ff',
            dark: '#2286c3',
            contrastText: '#FFFFFF',
        }
    },
    typography: {
        fontFamily: 'calibri',
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    height: '40px',
                    padding: '10px 20px',
                    boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.25)',
                    '&:hover': {
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                    },
                },
                outlined: {
                    '&:hover': {
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                text: {
                    // Customize the text button styles here
                    color: '#1976d2', // Primary color
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    padding: '6px 8px',
                    '&:hover': { 
                    },
                    '&:active': { 
                    },
                },
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '4px',
                    boxShadow: '1px 1px 4px #BF7EFF',
                },
            },
        }
    },
    MuiDivider: {
        styleOverrides: {
            root: {
                borderColor: '#BF7EFF',
                margin: '10px 0',
                width: '100%',
                height: '1px',
                opacity: 0.5,
            },
        },
    },
    Icon: {
        styleOverrides: {
            root: {
                fontSize: '20px',
                color: '#BF7EFF',
            },
        },
    },
    MuiSelect: {
        styleOverrides: {
            root: {
                border: '1px solid #BF7EFF',
                borderRadius: '4px',
                boxShadow: '1px 1px 4px #BF7EFF',
                '&:hover': {
                    boxShadow: '1px 1px 4px #BF7EFF',
                },
                '&:focus': {
                    boxShadow: '1px 1px 4px #BF7EFF',
                },
                '&:active': {
                    boxShadow: '1px 1px 4px #BF7EFF',
                }
            }
        }
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiInputBase-root': {
                    borderRadius: '10px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#BF7EFF',
                    },
                    '&:hover fieldset': {
                        borderColor: '#8F59FF',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#8F59FF',
                    },
                },
                '& .MuiInputLabel-root': {
                    color: '#BF7EFF',
                    '&.Mui-focused': {
                        color: '#8F59FF',
                    },
                },
            },
        },
    },
    MuiInputLabel: {
        styleOverrides: {
            root: {
                color: '#BF7EFF',
                '&.Mui-focused': {
                    color: '#8F59FF',
                },
            },
        },
    },
    MuiInputAdornment: {
        styleOverrides: {
            root: {
                color: '#BF7EFF',
            },
        },
    },
});

export default theme;