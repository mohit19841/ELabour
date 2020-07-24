import React from 'react';

const AvailabilityBadge = ({ status }) => {

    const output = status ? "Available" : "Unavailable";
    const color = status ? "success" : "danger";

    return (
        <p className={`font-18 bg-${color}-light d-inline-block p-2 rounded text-${color}`}>
            {output}
        </p>
    )
}

export default AvailabilityBadge;