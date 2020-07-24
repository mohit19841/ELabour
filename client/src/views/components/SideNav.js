import React from 'react';
import { Link } from 'react-router-dom';
import * as Auth from '../../utils/Auth';

const SideNav = () => {

    const CLIENT_LINKS = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "dashboard"
        },
        {
            name: "Profile",
            path: `/profile/client/${Auth.getID()}`,
            icon: "account_box"
        },
        {
            name: "Add Job",
            path: "/addjob",
            icon: "edit"
        },
        {
            name: "Incidents",
            path: "/incidents",
            icon: "report_problem"
        },
        {
            name: "Invoices",
            path: "/invoices",
            icon: "receipt"
        }
    ];

    const LABOURER_LINKS = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "dashboard"
        },
        {
            name: "My Profile",
            path: `/profile/labourer/${Auth.getID()}`,
            icon: "account_box"
        },
        {
            name: "Incidents",
            path: "/incidents",
            icon: "report_problem"
        }
    ];
    
    const ADMIN_LINKS = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "dashboard"
        },
        {
            name: "Jobs",
            path: "/admin/jobs",
            icon: "work"
        },
        {
            name: "Clients",
            path: "/admin/clients",
            icon: "business"
        },
        {
            name: "Labourers",
            path: "/admin/labourers",
            icon: "emoji_people"
        },
        {
            name: "Incidents",
            path: "/admin/incidents",
            icon: "report_problem"
        },
        {
            name: "Invoices",
            path: "/admin/invoices",
            icon: "receipt"
        },
        {
            name: "Payrolls",
            path: "/admin/payrolls",
            icon: "report"
        },
        {
            name: "Payrates",
            path: "/admin/payrates",
            icon: "trending_up"
        }
    ];

    let role = Auth.getRole();
    let links;

    if(role === "Client") {
        links = CLIENT_LINKS;
    } else if(role === "Labourer") {
        links = LABOURER_LINKS;
    } else if(role === "Admin") {
        links = ADMIN_LINKS;
    } else {
        Auth.forceLogout();
    }

    return (
    <div className="nav-left-sidebar sidebar-dark">
    <div className="menu-list">
    <nav className="navbar navbar-expand-lg navbar-light">

        {/* Mobile Menu Toggle */}
        <a className="d-xl-none d-lg-none" href="/dashboard">Dashboard</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        {/* Main Navigation */}
        <div className="collapse navbar-collapse" id="navbarNav">

        { links && 
        <ul className="navbar-nav flex-column">
            <li className="nav-divider">
                {`${role} Menu`}
            </li>
            {
                links.map((link, i) => {
                    return (
                    <div className="nav-item" key={i}>
                    <Link to={link.path} className="nav-link">
                        <i className="material-icons pb-1">{link.icon}</i>{link.name}
                    </Link>
                    </div>
                    );
                })
            }
        </ul>
        }
        </div>
    </nav>
    </div>
    </div>
    )
}

export default SideNav;