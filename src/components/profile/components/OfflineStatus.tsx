import React from 'react';
import { Box, Typography } from '@mui/material';
import {formatDate, formatDateStatus} from "../../utils/formatDate";

interface OfflineSymbolProps {
    label: string;
}

export const OfflineStatus: React.FC<OfflineSymbolProps> = ({ label }) => {
    return (
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: -25,
                    right: -25,
                    whiteSpace: 'nowrap',
                    backgroundColor: 'gray',
                    border: '1px solid black',
                    borderRadius: '10px',
                    padding: '1px 4px',
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: 'white',
                    }}
                >
                    {formatDateStatus(label)}
                </Typography>
            </Box>
        </div>
    );
};
