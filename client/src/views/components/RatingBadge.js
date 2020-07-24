import React from 'react';

const RatingBadge = ({rating}) => {

    const output = rating == 0 || !rating ? "N/A" : `${Math.round((rating / 5) * 100)}%`;

    const color = (
        rating === 0 || !rating ? "info" :
        rating >= 4 ? "success" :
        rating === 3 ? "warning" :
        "danger"
    );

    return (
        <p className={`font-18 bg-${color}-light d-inline-block p-2 rounded text-${color}`}>
            {output}
        </p>
    )
}

export default RatingBadge;