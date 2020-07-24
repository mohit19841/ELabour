import React from 'react';

const SuccessMessage = ({ message }) => {
    return (
    <div className="alert alert-success mb-4">
        <span className="font-18">{message}</span>
    </div>
    )
}

export default SuccessMessage;