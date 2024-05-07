import React from 'react';
import { Box } from '@mui/material';

export const OnlineStatus: React.FC = () => {
    return (
        <Box
            sx={{
                width: 16,
                height: 16,
                backgroundColor: 'green',
                border: '2px solid black',
                borderRadius: '50%',
            }}
        />
    );
};

