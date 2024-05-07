import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {Slider} from "@mui/material";

interface Slider1Props{
    playbackProgress: number;
    handleProgressChange;
    width?: string;
}
export const Slider1: React.FC<Slider1Props> = ({ playbackProgress, handleProgressChange, width }) => {

    return (
        <Slider
            aria-label="Playback"
            value={playbackProgress}
            onChange={handleProgressChange}
            sx={{
                color: 'white', // Цвет заполненной части
                height: 4,
                '& .MuiSlider-thumb': {
                    height: 0,
                    width: 0,
                    backgroundColor: 'transparent',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                        boxShadow: 'none',
                    },
                },
                '& .MuiSlider-track': {
                    border: 'none',
                },
                '& .MuiSlider-rail': {
                    color: 'grey', // Цвет незаполненной части
                    opacity: 0.5,
                },
            }}
            style={{ marginRight: 8, flexGrow: 1, paddingTop:0, paddingBottom:0, marginBottom:0, width:width }}
        />
    );
};