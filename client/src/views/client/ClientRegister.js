import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import * as Auth from '../../utils/Auth';
import * as FormValidator from '../../utils/FormValidator';

import Select from 'react-select';
import FormErrors from '../components/FormErrors';
import PROVINCES from '../../utils/staticdata/Provinces';

const BASE_URL = "http://localhost:5001/api";

const RegisterClient = ({ history }) => {

    const [formErrors, setFormErrors] = useState([]);
    const [client, setClient] = useState({
        email: "",
        password: "",
        companyname: "",
        phonenumber: "",
        city: "",
        province: "",
        companydescription: ""
    })
    const {
        email,
        password,
        confirmpassword,
        companyname,
        phonenumber,
        city,
        province,
        companydescription
    } = client;

    const onChange = e => {
        setClient({ ...client, [e.target.name]:e.target.value });
    }

    const onChangeProvince = e => {
        setClient({ ...client, province: e.label })
    }

    const validateForm = e => {
        e.preventDefault();
        let errors = [];

        if(companyname === "") {
            errors.push("Company name is required.");
        }

        if(!FormValidator.email(email)) {
            errors.push("Invalid email entered.")
        }

        if(password === confirmpassword) {
            if(!FormValidator.password(password)) {
                errors.push("Password must contain at least 6 letters, and each of the following: one uppercase letter, one lowercase letter, one number, and one symbol.");
            }
        } else {
            errors.push("Passwords do not match.");
        }

        if(!FormValidator.phone(phonenumber)) {
            errors.push("Invalid phone number entered.");
        }

        if(city === "") {
            errors.push("City is required.");
        }

        if(errors.length) {
            setFormErrors(errors);
        } else {
            submitForm();
        }
    }

    const submitForm = async() => {
        try {
            const response = await fetch(BASE_URL + "/RegisterClient", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    User: {
                        email,
                        password,
                    },
                    Client: {
                        ClientName: companyname,
                        ClientEmail: email,
                        ClientPhoneNumber: phonenumber,
                        ClientCity: city,
                        ClientState: province,
                        ClientDescription: companydescription
                    }
                })
            });

            // Bad response
            if(response.status !== 200) {
                setFormErrors(["Registration failed. Please try again later."]);
                throw response;
            }
            // if(response.status !== 403) {
            //     setFormErrors(["Email address '" + email + "' is already taken."]);
            //     throw response;
            // }

            // Success
            let data = await response.json();
            if(data.token && data.token !== " " && data.token !== "") {
                Auth.setSessionData(data, history);
            } else {
                setFormErrors(["Registration failed. Please try again later."]);
            }
        } catch(e) {
            console.error(e);
            setFormErrors(["Registration failed. Please try again later."]);
        }
    }

    return Auth.authenticateUser() ? <Redirect to={{pathname:'/dashboard'}} /> :
    (
        <div className="splash-container-wrapper">
            <form className="splash-container">
                <div className="card">
                    <div className="card-header">
                        <h3 className="mb-1">Create Client Account</h3>
                        <p>Enter your user information.</p>
                    </div>
                    <div className="card-body">
                        { formErrors.length > 0 && <FormErrors errors={formErrors} /> }

                        <div className="form-group">
                            <label htmlFor="companyname">Company Name <span className="text-danger">*</span></label>
                            <input
                                className="form-control form-control-lg"
                                name="companyname"
                                type="text"
                                placeholder="Enter company name"
                                required
                                onChange={e => onChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address <span className="text-danger">*</span></label>
                            <input
                                className="form-control form-control-lg"
                                name="email"
                                type="email"
                                placeholder="Enter email address"
                                required
                                onChange={e => onChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password <span className="text-danger">*</span></label>
                            <input
                                className="form-control form-control-lg"
                                name="password"
                                type="password"
                                placeholder="Enter password"
                                required
                                onChange={e => onChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmpassword">Confirm Password <span className="text-danger">*</span></label>
                            <input
                                className="form-control form-control-lg"
                                name="confirmpassword"
                                type="password"
                                placeholder="Enter password again"
                                required
                                onChange={e => onChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phonenumber">Phone Number <span className="text-danger">*</span></label>
                            <input
                                className="form-control form-control-lg"
                                name="phonenumber"
                                type="tel"
                                placeholder="Enter phone number"
                                required
                                onChange={e => onChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">City <span className="text-danger">*</span></label>
                            <input
                                className="form-control form-control-lg"
                                name="city"
                                type="text"
                                placeholder="Enter city"
                                required
                                onChange={e => onChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="province">Province <span className="text-danger">*</span></label>
                            <Select
                                options={PROVINCES}
                                onChange={e => onChangeProvince(e)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="companydescription">Company Description <span className="text-danger">*</span></label>
                            <textarea
                                className="form-control form-control-lg"
                                name="companydescription"
                                type="text"
                                placeholder="Enter company description"
                                required
                                onChange={e => onChange(e)}
                            />
                        </div>

                        <div className="form-group pt-2">
                            <button
                                className="btn btn-block btn-primary btn-lg"
                                onClick={validateForm}
                            >
                                Create Account
                            </button>
                        </div>

                    </div>
                    <div className="card-footer bg-white">
                        <p>Already have an account? <Link to="/login" className="text-primary">Login here.</Link></p>
                    </div>
                </div>
            </form>
        </div >
    )
}

export default RegisterClient;