import React from "react";
import { Link } from "react-router-dom";
import * as Auth from "../../utils/Auth";

import NotificationsTab from "./NotificationsTab";
import placeholder from "../../assets/images/avatars/placeholder.jpg";

const TopNav = () => {
  const username = Auth.getName();
  const displayNotifications = Auth.authenticateAdmin();

  return (
    <div className="dashboard-header">
      <nav className="navbar navbar-expand-lg bg-white fixed-top">
        {/* Logo */}
        <a
          href="/dashboard"
          className="navbar-brand topnav-logo"
          style={{ color: "#3d405c", textTransform: "none" }}
        >
          Labour Management
        </a>

        {/* Mobile Menu Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
          <i
            className="material-icons text-dark mt-2 mr-1"
            style={{ fontSize: "2rem" }}
          >
            menu
          </i>
        </button>

        {/* User Menu */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto navbar-right-top">
            {/* Notifications */}
            {displayNotifications && <NotificationsTab />}

            {/* User Dropdown */}
            <li className="nav-item dropdown nav-user">
              <Link
                className="d-flex nav-link nav-user-img"
                to="/dashboard"
                id="navbarDropdownMenuLink2"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  src={placeholder}
                  alt={username}
                  className="user-avatar-md rounded-circle"
                />
                <h5 className="ml-2 mt-1 mb-0 text-dark nav-user-name">
                  {username}
                </h5>
              </Link>
              <div
                className="dropdown-menu dropdown-menu-right nav-user-dropdown"
                aria-labelledby="navbarDropdownMenuLink2"
              >
                <Link to="/profile/edit" className="dropdown-item mt-1">
                  Settings
                </Link>
                <Link to="/" onClick={Auth.logout} className="dropdown-item">
                  Logout
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default TopNav;
