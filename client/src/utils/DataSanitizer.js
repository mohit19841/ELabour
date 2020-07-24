const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

exports.formatDateString = (date) => {
    // Check if date is in YYYY-MM-DD format
    if(date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        let d = new Date(date);
        d.setDate(d.getDate() + 1);
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} (${weekdays[d.getDay() - 1]})`;
    }

    let d = new Date(date);
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

exports.phone = (p) => {
    let cleaned = ('' + p).replace(/\D/g, '');
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? '(' + match[1] + ') ' + match[2] + '-' + match[3] : p;

}

exports.formatDateParams = (date) => {
    let d = new Date(date);
    const addZero = (n) => {return n<10? '0'+n:''+n;}
    return `${d.getFullYear()}-${addZero(d.getMonth() + 1)}-${addZero(d.getDate())}`;
}