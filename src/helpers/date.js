import moment from 'moment';

export function relativeDateTime(originalDate) {
    if (!originalDate) {
        return "";
    }
    const date = moment(originalDate);
    const now = moment();

    const minutesDiff = now.diff(date, "minutes");
    const daysDiff = now.dayOfYear() - date.dayOfYear();
    const yearsDiff = now.year() - date.year();

    if (minutesDiff < 1) {
        return "just now";
    }

    if (minutesDiff < 60) {
        return `${minutesDiff} minutes ago`;
    }

    if (yearsDiff === 0) {
        if (daysDiff === 0) {
            return `today at ${date.format("HH:mm")}`;
        }

        if (daysDiff === 1) {
            return `yesterday at ${date.format("HH:mm")}`;
        }

        return date.format("D MMMM at HH:mm");
    }

    return date.format("D MMMM YYYY at HH:mm");
}