import React from 'react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
    <div className="footer">
    <div className="container-fluid">
    <div className="row">
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
            Copyright &copy; {year} Labour Recruitment App.
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
            <div className="text-md-right footer-links d-none d-sm-block">
                <a href="https://github.com/mingwang168/Labour-Recruitment" target="blank">GitHub</a>
            </div>
        </div>
    </div>
    </div>
    </div>
    );
}

export default Footer;
