import * as React from 'react';
import Avatar from '@mui/material/Avatar';

const AvatarIcon = (props) => {
    const { name, type } = props;
    const stringToColor = (string) => {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    const stringAvatar = (name, type) => {
        if (type === 'name') {
            return {
                sx: {
                    bgcolor: stringToColor(name),
                    width: 40,
                    height: 40,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginRight: '10px',
                },
                children: <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>{name.substring(0, 3)}...</div>,
            };
        } else {
            return {
                sx: {
                    bgcolor: stringToColor(name),
                    width: '100%',
                    height: '150px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginRight: '10px',
                    marginTop: '20px',
                    borderRadius: '4px 4px 0px 0px',
                },
                children: <div style={{ width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.8)' }}>{name.substring(0, 3)}...</div>,
            }
        }
    }

    return (
        <Avatar {...stringAvatar(name, type)} />
    );
}

export default AvatarIcon
