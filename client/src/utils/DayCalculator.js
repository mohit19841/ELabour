exports.difference = (start, end) => {
    if(start.getTime() === end.getTime()) {
        return "1 day";
    }
    const day = 24 * 60 * 60 * 1000;
    let diff = Math.round(Math.abs((start - end) / day));
    return `${diff} days`;
}

exports.convert = (date) => {
    let a = date.split("-");
    return new Date(a[0], a[1]-1, a[2]);
}