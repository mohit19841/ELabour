import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, breadcrumbs }) => {
    return (title !== "" && breadcrumbs.length) && (
        <div className="page-header">
            <h2 className="pageheader-title">
                {title}
            </h2>
            <div className="page-breadcrumb">
            <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
            { 
                breadcrumbs.map((breadcrumb, i) => {
                    return i === breadcrumbs.length - 1
                    ? <li key={i} className="breadcrumb-item active">{breadcrumb.name}</li>
                    : <li key={i} className="breadcrumb-item"><Link to={breadcrumb.path} className="breadcrumb-link">{breadcrumb.name}</Link></li>;
                    
                })
            }
            </ol>
            </nav>
            </div>
        </div>
    );
}

export default PageHeader;