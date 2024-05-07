import * as React from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {StaticDateRangePicker} from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import {PickersShortcutsItem} from '@mui/x-date-pickers/PickersShortcuts';
import {Box, Card, CardContent, Container, createTheme, Grid, Paper, ThemeProvider, Typography} from "@mui/material";
import {darkTheme} from "./DarkTheme";
import {DateRange, DateRangePicker, SingleInputDateRangeField} from "@mui/x-date-pickers-pro";
import {useEffect, useState} from "react";
import PostAddIcon from '@mui/icons-material/PostAdd';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CommentIcon from '@mui/icons-material/Comment';
import {
    countCommentsPerPeriod,
    countFollowersPerPeriod, countFollowingPerPeriod,
    countLikesPerPeriod,
    countPostsPerPeriod, countVisitsPerPeriod
} from "./service/StatisticsService";

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
    {
        label: 'This Week',
        getValue: () => {
            const today = dayjs();
            return [today.startOf('week'), today.endOf('week')];
        },
    },
    {
        label: 'Last Week',
        getValue: () => {
            const today = dayjs();
            const prevWeek = today.subtract(7, 'day');
            return [prevWeek.startOf('week'), prevWeek.endOf('week')];
        },
    },
    {
        label: 'Last 7 Days',
        getValue: () => {
            const today = dayjs();
            return [today.subtract(7, 'day'), today];
        },
    },
    {
        label: 'Current Month',
        getValue: () => {
            const today = dayjs();
            return [today.startOf('month'), today.endOf('month')];
        },
    },
    {
        label: 'Next Month',
        getValue: () => {
            const today = dayjs();
            const startOfNextMonth = today.endOf('month').add(1, 'day');
            return [startOfNextMonth, startOfNextMonth.endOf('month')];
        },
    },
    {label: 'Reset', getValue: () => [null, null]},
];


const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

interface ProfileStatisticsProps {
    token: string;
    profileId: number;
    userId: number;
}

export const ProfileStatistics: React.FC<ProfileStatisticsProps> = ({
                                                                        token,
                                                                        profileId,
                                                                        userId
                                                                    }) => {
    const [value, setValue] = useState<DateRange<Dayjs>>([dayjs(), dayjs()]);
    const [selectedRange, setSelectedRange] = useState<string>('today');
    const [openPicker, setOpenPicker] = useState(false);
    const [postsCount, setPostsCount] = useState(0);
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [visitsCount, setVisitsCount] = useState(0);
    const formatDate = (date: Dayjs | null) => {
        return date ? date.format("YYYY-MM-DD HH:mm:ss") : null;
    };

    useEffect(() => {
        if (value[0] && value[1]) {
            const formattedStartDate = formatDate(value[0]);
            const formattedEndDate = formatDate(value[1]);
            if (formattedStartDate && formattedEndDate) {
                countPostsPerPeriod(profileId, formattedStartDate, formattedEndDate, token)
                    .then((postCount) => setPostsCount(postCount));
                countLikesPerPeriod(profileId, formattedStartDate, formattedEndDate, token)
                    .then((likesCount) => setLikesCount(likesCount));
                countCommentsPerPeriod(profileId, formattedStartDate, formattedEndDate, token)
                    .then((commentsCount) => setCommentsCount(commentsCount));
                countFollowersPerPeriod(userId, formattedStartDate, formattedEndDate, token)
                    .then((followersCount) => setFollowersCount(followersCount));
                countFollowingPerPeriod(userId, formattedStartDate, formattedEndDate, token)
                    .then((followingCount) => setFollowingCount(followingCount));
                countVisitsPerPeriod(userId, formattedStartDate, formattedEndDate, token)
                    .then((visitsCount) => setVisitsCount(visitsCount));
            }
        }
    }, [value, profileId, token]);


    const StatisticCard = ({icon, title, value}) => (
        <Grid item xs={4}>
            <Card sx={{display: 'flex', alignItems: 'center', height: '100%'}}>
                <CardContent sx={{display: 'flex', alignItems: 'center'}}>
                    <Box sx={{mr: 2, color: 'action.active'}}>{icon}</Box>
                    <Box>
                        <Typography variant="subtitle1" color="text.secondary">
                            {title}
                        </Typography>
                        <Typography variant="h6">{value}</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
    return (
        <ThemeProvider theme={darkTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Paper elevation={5} sx={{padding: 2, margin: 'auto', maxWidth: 700, bgcolor: 'background.default'}}>
                    <Grid container spacing={2}>
                        <StatisticCard icon={<PostAddIcon/>} title="Posts created" value={postsCount}/>
                        <StatisticCard icon={<ThumbUpAltIcon/>} title="Likes received" value={likesCount}/>
                        <StatisticCard icon={<CommentIcon/>} title="Comments" value={commentsCount}/>
                        <StatisticCard icon={<VisibilityIcon/>} title="Page visits" value={visitsCount}/>
                        <StatisticCard icon={<PeopleIcon/>} title="Followers" value={followersCount}/>
                        <StatisticCard icon={<PersonAddIcon/>} title="Following" value={followingCount}/>
                    </Grid>
                </Paper>

                <Box
                    marginTop={2}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <DateRangePicker
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                        onAccept={() => setOpenPicker(false)}
                        slotProps={{
                            shortcuts: {
                                // @ts-ignore
                                items: shortcutsItems,
                            },
                        }}
                        slots={{field: SingleInputDateRangeField}}
                    />
                </Box>
            </LocalizationProvider>
        </ThemeProvider>
    );
}