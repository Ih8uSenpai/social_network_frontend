import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import { AudioPlayerProvider } from './components/Music/components/AudioPlayerContext';
import AppRoutes from "./app/AppRoutes";
import ThemeProvider from "./features/theme/ThemeContext";

function App() {
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isMusicPage, setIsMusicPage] = useState(false);
    const mode = useSelector((state: RootState) => state.theme.mode);

    useEffect(() => {
        document.body.setAttribute('data-theme', mode);
    }, [mode]);

    return (
        <ThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AudioPlayerProvider selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}>
                    <Router>
                        <AppRoutes
                            selectedTrack={selectedTrack}
                            setSelectedTrack={setSelectedTrack}
                            isVisible={isVisible}
                            setIsVisible={setIsVisible}
                            isMusicPage={isMusicPage}
                            setIsMusicPage={setIsMusicPage}
                        />
                    </Router>
                </AudioPlayerProvider>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;
