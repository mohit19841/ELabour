exports.getBadgeColor = (status) => {
    let color = "primary";
    if(status === "Complete") {
        color = "success";
    } else if(status === "In Progress") {
        color = "warning";
    } else if(status === "Required") {
        color = "danger";
    }
    return color;
}