import {
    format,
    parseISO,
    isToday,
    isYesterday,
    startOfWeek,
    startOfMonth,
    startOfYear,
    endOfWeek,
    endOfMonth,
    endOfYear,
    isWithinInterval, subDays, subWeeks, subMonths, isSameDay,
} from 'date-fns';

export function formatDate(sentAt: string) {
    const sentDate = new Date(sentAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const dayDiff = Math.floor((today.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24));
    const yearDiff = today.getFullYear() - sentDate.getFullYear();

    const time = sentDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    if (sentDate.toDateString() === today.toDateString()) {
        return time;
    } else if (sentDate.toDateString() == yesterday.toDateString()) {
        return 'yesterday';
    } else if (dayDiff == 1) {
        return `${dayDiff} day ago`;
    } else if (dayDiff < 7) {
        return `${dayDiff} days ago`;
    } else if (yearDiff === 0) {
        return sentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    } else {
        return sentDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
    }
}

export function formatDateStatus(sentAt: string): string {
    const sentDate = new Date(sentAt);
    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - sentDate.getTime()) / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} sec`;
    } else if (minutes < 60) {
        return `${minutes} min`;
    } else if (hours < 24) {
        return `${hours} h`;
    } else {
        return `${days} d`;
    }
}




export interface StartEndDateRange {
    start: Date;
    end: Date;
}



export function formatDateRange(dateRange: StartEndDateRange): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisWeekStart = startOfWeek(today);
    const thisWeekEnd = endOfWeek(today);
    const thisMonthStart = startOfMonth(today);
    const thisMonthEnd = endOfMonth(today);
    const thisYearStart = startOfYear(today);
    const thisYearEnd = endOfYear(today);

    if (isToday(dateRange.start) && isToday(dateRange.end)) {
        return 'today';
    } else if (isYesterday(dateRange.start) && isYesterday(dateRange.end)) {
        return 'yesterday';
    } else if (
        isSameDay(dateRange.start, thisWeekStart) &&
        isSameDay(dateRange.end, thisWeekEnd)
    ) {
        return 'this week';
    } else if (
        isSameDay(dateRange.start, thisMonthStart) &&
        isSameDay(dateRange.end, thisMonthEnd)
    ) {
        return 'this month';
    } else if (
        isSameDay(dateRange.start, thisYearStart) &&
        isSameDay(dateRange.end, thisYearEnd)
    ) {
        return 'this year';
    } else {
        // Default formatting for any date range not covered above
        return `from ${format(dateRange.start, 'PPP')} to ${format(dateRange.end, 'PPP')}`;
    }
}


export function formatDate3(sentAt: string) {
    const sentDate = new Date(sentAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const dayDiff = Math.floor((today.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24));
    const yearDiff = today.getFullYear() - sentDate.getFullYear();

    const time = sentDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    if (sentDate.toDateString() === today.toDateString()) {
        return "today at " + time;
    } else if (sentDate.toDateString() === yesterday.toDateString()) {
        return 'yesterday at ' + time;
    } else if (dayDiff < 7) {
        return `${dayDiff} days ago at ` + time;
    } else if (yearDiff === 0) {
        return sentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) + " at " + time;
    } else {
        return sentDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
    }
}