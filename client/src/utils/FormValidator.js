exports.email = (input) => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(input).toLowerCase()) ? true : false;
}

exports.phone = (input) => {
    let re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    return re.test(String(input)) ? true : false;
}

exports.password = (input) => {
    let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(String(input)) ? true : false;
}

exports.name = (input) => {
    let re = /^([a-zA-Z]+?)([-\s'][a-zA-Z]+)*?$/;
    return re.test(String(input)) ? true : false;
}

exports.date = (input) => {
    let re = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    return re.test(String(input)) ? true : false;    
}