import React from "react";
import { Link } from "react-router-dom";

import hero from "../assets/images/jobsite.jpg";

const Home = (props) => {
  const heroStyles = {
    position: "relative",
    minHeight: "95vh",
    backgroundImage: `url(${hero})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
  };

  return (
    <>
      {/* Navbar */}
      <header className="pt-2 pb-3" style={{ background: "#111111" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-6 col-xl-2">
              <h1 className="mb-0">
                <Link to="/" className="text-white h4 mb-0">
                  Labour Management
                </Link>
              </h1>
            </div>

            <div className="col-6 col-xl-10 text-right pt-1">
              <Link to="/dashboard" className="text-white mr-3">
                Dashboard
              </Link>
              <Link to="/register" className="text-white mr-3">
                Sign Up
              </Link>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <span className="rounded bg-primary py-2 px-3 text-white">
                  Login
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div style={heroStyles}>
        <div className="container">
          <div
            className="hero-text-container row d-flex flex-column justify-content-center"
            style={{ height: "95vh" }}
          >
            <h1 className="display-4 hero-text text-white">
              Find the <strong>Labour</strong> you <br />
              need to succeed
            </h1>
            <Link
              to="/register"
              className="btn btn-primary p-3 text-white mt-3"
              style={{ fontSize: "0.9rem", width: "150px" }}
            >
              Start now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
