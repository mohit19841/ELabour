import React from 'react';

const PageNotFound = () => {
    return (
    <div className="bg-light text-center" style={{minHeight:'100vh'}}>
    <div className="container">
    <div className="row">
    <div className="offset-xl-2 col-xl-8 offset-lg-2 col-lg-8 col-md-12 col-sm-12 col-12">
    <div className="error-section">
    <div className="error-section-content">
        <h1 className="display-3">Page Not Found</h1>
        <p>Sorry, there's nothing to see here!</p>
        <a href="/dashboard" className="btn btn-secondary btn-lg">Back to dashboard</a>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    )
}

export default PageNotFound;