import React from 'react';

const UnauthorizedMessage = () => {
    return (
    <div className="alert alert-danger">
        <span className="h5">You don't have permission to view this page.</span>
    </div>
    )
}

export default UnauthorizedMessage;