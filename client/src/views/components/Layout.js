import React, { useEffect } from 'react';
import TopNav from '../components/TopNav';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';

const Layout = ({ content }) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
    <div className="dashboard-main-wrapper">
        <TopNav />
        <SideNav />
    
        <div className="dashboard-wrapper">
            <div className="container-fluid dashboard-content">
            {content}
            </div>

            <Footer />
        </div>
    </div>
    )
}

export default Layout;