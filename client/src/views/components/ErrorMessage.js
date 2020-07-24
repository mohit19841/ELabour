import React from 'react';

const ErrorMessage = ({ message }) => {
    return (
    <div className="alert alert-danger mb-4">
        <span className="font-18">{message}</span>
    </div>
    )
}

export default ErrorMessage;