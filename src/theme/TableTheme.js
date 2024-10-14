import { createTheme } from "@mui/material";

const tableTheme = createTheme({
    palette: {
        primary: {
            main: '#9bd7d8',
            light: '#E8D9FF',
            dark: '#9bd7d8',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FFC700',
            light: '#FFE54C',
            dark: '#FFA700',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#FF4C4C',
            light: '#FF8080',
            dark: '#FF0000',
            contrastText: '#FFFFFF',
        },
        warning: {
            main: '#FFC700',
            light: '#FFE54C',
            dark: '#FFA700',
            contrastText: '#FFFFFF',
        },
        info: {
            main: '#00BFFF',
            light: '#66D9FF',
            dark: '#0080FF',
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
        MuiTable: {
            styleOverrides: {
                root: {   
                    minWidth: '450px',
                    maxWidth:'500px',
                    height:'400px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                    borderCollapse: 'separate', 
                }, 
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: { 
                    borderBottom: '1px solid #E0E0E0', 
                },
                head: {
                    fontWeight: 'bold',
                    color: '#9bd7d8',  
                },
                body: {
                    color: '#333',
                },

            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#F3F3F3',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#9bd7d8',
                    '&:hover': {
                        backgroundColor: '#F3F3F3',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: '#F3F3F3',
                    },
                    '&.MuiTableHeadRow-root': {
                        backgroundColor: '#D9D9D9',
                    },
                    '&:last-child td, &:last-child th': {
                        border: 0,
                    },
                    '&:hover': {
                        backgroundColor: '#F0F0F0',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    padding: '10px 20px',
                    transition: 'all 0.3s ease-in-out',
                    height: '30px',
                    '&:hover': {
                        boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.25)',
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
    },
});

export default tableTheme;
