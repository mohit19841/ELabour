import React, { useState } from 'react'
import { Redirect, Link } from 'react-router-dom';
import * as FormValidator from '../utils/FormValidator';
import * as Auth from '../utils/Auth';
import FormErrors from './components/FormErrors';

const BASE_URL = "http://localhost:5001/api";

const Login = ({ history }) => {

    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const [formErrors, setFormErrors] = useState([]);
    const { email, password } = user;

    const onChange = (e) => {
        e.preventDefault();
        setUser({ ...user, [e.target.name]:e.target.value })
    }

    const validateForm = e => {
        e.preventDefault();
        let errors = [];

        if(!FormValidator.email(email)) {
            errors.push("Invalid email entered.")
        }
        if(errors.length) {
            setFormErrors(errors);
        } else {
            submitForm();
        }
    }
    
    const submitForm = async() => {
        let loginData = { email, password };
        
        try {
            const response = await fetch(BASE_URL + '/login', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            })

            // Bad response
            if(response.status !== 200) {
                setFormErrors(["Login failed. Please try again later."]);
                throw response;
            }

            // Success
            let data = await response.json();
            if(data.token && data.token !== "") {
                Auth.setSessionData(data, history);
            } else {
                setFormErrors(["Invalid login information entered."]);
            }
        } catch(e) {
            setFormErrors(["Login failed. Please try again later."]);
            console.error(e);
        }
    }

    return Auth.authenticateUser() ? <Redirect to={{pathname:'/dashboard'}} /> :
    (
        <>
        <div className="splash-container-wrapper">
        <div className="splash-container">
        <div className="card">
        <div className="card-header">
            <h3 className="mb-1">Login</h3>
            <p>Don't have an account yet? Create one <Link to="/register" className="text-primary">here.</Link></p>
        </div>
        <div className="card-body">
        { formErrors.length > 0 && <FormErrors errors={formErrors} /> }

        <form onSubmit={validateForm}>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    autoFocus
                    required
                    type="email"
                    name="email"
                    className="form-control form-control-lg"
                    onChange = {e => onChange(e)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    required
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    onChange = {e => onChange(e)}
                />
            </div>
            <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
            >
                Login
            </button>
        </form>
        </div>
        </div>
        </div>
        </div>
        </>
    )
}


export default Login;