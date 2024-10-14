import { Avatar, Toolbar } from '@mui/material';
import React from 'react';

const TopToolBar = () => {
    return (
        <div>
            <Toolbar
                sx={{
                    height: '70px',
                    backgroundColor: '#fcf7ff',
                    color: '#BF7EFF',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 'normal',
                    fontFamily: 'calibri',
                    transition: 'all 0.3s ease-in-out',
                }}
                variant="regular">
                <div style={{ fontSize: '40px', fontWeight: '300' }}>
                    Gov Hub
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '10px',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontFamily: 'calibri',
                        fontWeight: 'normal',
                        color: '#BF7EFF',
                        fontSize: '18px',
                    }}>
                    Welcome Admin
                    <Avatar sx={{ width: '40px', height: '40px' }} />
                </div>
            </Toolbar>
        </div>
    );
};

export default TopToolBar;