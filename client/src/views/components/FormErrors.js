import React from 'react';

const FormErrors = ({ errors }) => {
    return (
    <div className="alert alert-danger">
    <ul className="pl-3 mb-0">
    {errors.map((error, i) => <li key={i}>{error}</li>)}
    </ul>
    </div>
    )
}

export default FormErrors;