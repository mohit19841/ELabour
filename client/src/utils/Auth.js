const AUTH_TOKEN = "auth_token";
const USER_NAME = "user_name";
const USER_ID = "user_id";
const USER_ROLE = "user_role";
const TOKEN_EXP = "token_exp";

exports.setSessionData = (data, history) => {
    localStorage.setItem(AUTH_TOKEN, data.token);
    localStorage.setItem(TOKEN_EXP, this.setTokenExpiration());
    localStorage.setItem(USER_ROLE, data.role);
    localStorage.setItem(USER_ID, data.id);
    if(data.role === "Admin") {
        localStorage.setItem(USER_NAME, "Admin");
    } else {
        localStorage.setItem(USER_NAME, data.name);
    }
    history.push("/dashboard");
}

exports.authenticateUser = _ => {
    let authenticated =
    localStorage.getItem(AUTH_TOKEN) &&
    localStorage.getItem(AUTH_TOKEN) !== "" &&
    localStorage.getItem(USER_ROLE) &&
    (
        localStorage.getItem(USER_ROLE) === "Admin" ||
        localStorage.getItem(USER_ROLE) === "Client" ||
        localStorage.getItem(USER_ROLE) === "Labourer"
    ) &&
    localStorage.getItem(USER_NAME) &&
    localStorage.getItem(USER_ID) ? true : false;
    if(!authenticated) {
        localStorage.clear();
    }
    return authenticated;
}

exports.validateToken = _ => {
    return Date.now() > this.getTokenExpirationTime() ? false : true;
}

exports.setTokenExpiration = _ => {
    const HOUR = 1000 * 60 * 60;
    return Date.now() + (HOUR * 2);
}

exports.getTokenExpirationTime = _ => {
    return localStorage.getItem(TOKEN_EXP);
}

exports.authenticateClient = _ => {
    return localStorage.getItem(USER_ROLE) === "Client" ? true : false;
}

exports.authenticateLabourer = _ => {
    return localStorage.getItem(USER_ROLE) === "Labourer" ? true : false;
}

exports.authenticateAdmin = _ => {
    return localStorage.getItem(USER_ROLE) === "Admin" ? true : false;
}

exports.getToken = _ => {
    return localStorage.getItem(AUTH_TOKEN);
}

exports.getID = _ => {
    return localStorage.getItem(USER_ID);
}

exports.getRole = _ => {
    return localStorage.getItem(USER_ROLE);
}

exports.getName = _ => {
    return localStorage.getItem(USER_NAME);
}

exports.logout = _ => {
    localStorage.clear();
}

exports.forceLogout = _ => {
    localStorage.clear();
    window.location.replace("/");
    alert("Something went wrong. Please sign in again.");
}