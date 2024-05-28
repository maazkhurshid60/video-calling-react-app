
export const convertDateTimeToStringForCalls = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleString('en-US', { timeZoneName: 'short' });

    return formattedDate;
}