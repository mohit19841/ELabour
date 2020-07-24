import React , {useState, useEffect} from 'react';
import { Link, Redirect } from 'react-router-dom';

import * as FormValidator from '../../utils/FormValidator';
import * as Auth from '../../utils/Auth';

import Select from 'react-select';
import FormErrors from '../components/FormErrors';

const BASE_URL = "http://localhost:5001/api";

const RegisterLabourer = ({ history }) => {

    // Form Options
    const [formErrors, setFormErrors] = useState([]);
    const [skillOptions, setSkillOptions] = useState([]);

    // Input Data
    const [labourer, setLabourer] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: ""
    });

    const [selectedSkills, setSelectedSkills] = useState([]);

    const {
        firstname,
        lastname,
        email,
        password,
        confirmpassword
    } = labourer;
    
    const fetchSkillOptions = async() => {
        try {
            const URI = BASE_URL + '/Skills/GetAllSkills';
            const response = await fetch(URI);

            if(response.status !== 200) {
                throw response;
            }

            let data = await response.json();

            if(data.length) {
                setSkillOptions(data);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const onChange = e => {
        e.preventDefault();
        setLabourer({ ...labourer, [e.target.name]: e.target.value }); 
    }

    const onChangeSkill = (skills) => {
        if(skills) {
            let selected = [];
            skills.forEach(skill => selected.push(skill.value));
            setSelectedSkills(selected);
        } else {
            setSelectedSkills([]);
        }
    }

    const validateForm = (e) => {
        e.preventDefault();
        let errors = [];

        if(!FormValidator.name(firstname)) {
            errors.push("Invalid first name entered.");
        }

        if(!FormValidator.name(lastname)) {
            console.log(lastname)
            errors.push("Invalid last name entered.");
        }

        if(!FormValidator.email(email)) {
            errors.push("Invalid email entered.");
        }

        if(password === confirmpassword) {
            if(!FormValidator.password(password)) {
                errors.push("Password must contain at least 8 characters, and each of the following: one uppercase letter, one lowercase letter, one number, and one symbol.");
            }
        } else {
            errors.push("Passwords do not match.");
        }

        if(!selectedSkills.length) {
            errors.push("You must select at least one skill.")
        }

        if(errors.length) {
            setFormErrors(errors);
        } else {
            submitForm();
        }
    }

    const submitForm = async() => {
        try {
            let response = await fetch(BASE_URL + "/RegisterLabourer", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    User: {
                        email,
                        password
                    },
                    Labourer: { 
                        LabourerFirstName: firstname,
                        LabourerLastName: lastname
                    },
                    Skills: selectedSkills
                })
            });

            if(response.status !== 200) {
                setFormErrors(["Registration failed. Please try again later."]);
                throw response;
            }

            // Success
            let data = await response.json();

            if(data.token && data.token !== "") {
                Auth.setSessionData(data, history);
            } else {
                setFormErrors(["Registration failed. Please try again later."]);
            }
        } catch(e) {
            console.error(e);
            setFormErrors(["Registration failed. Please try again later."]);
        }
    }

    useEffect(() => {
        fetchSkillOptions();
    }, [])

    return Auth.authenticateUser() ? <Redirect to={{pathname:'/dashboard'}} /> :
    (
    <>
    <div className="splash-container-wrapper">
    <form className="splash-container" onSubmit={e => validateForm(e)}>
    <div className="card">
        <div className="card-header">
            <h3 className="mb-1">Create Labourer Account</h3>
            <p>Enter your user information.</p>
        </div>
        <div className="card-body">
            { formErrors.length > 0 && <FormErrors errors={formErrors} /> }
            
            <div className="form-group">
                <label htmlFor="firstname">First Name <span className="text-danger">*</span></label>
                <input
                    autoFocus
                    className="form-control form-control-lg"
                    name="firstname"
                    type="text"
                    placeholder="Enter first name"
                    required
                    onChange={e => onChange(e)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="lastname">Last Name <span className="text-danger">*</span></label>
                <input
                    className="form-control form-control-lg"
                    name="lastname"
                    type="text"
                    placeholder="Enter last name"
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
                <small className="form-text text-muted">Password should be a minimum of 8 characters and contain at least one uppercase letter, lowercase letter, number, and symbol.</small>
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
                <label className="d-block" htmlFor="skills">Select Skills <span className="text-danger">*</span></label>
                <Select 
                    options={ skillOptions && skillOptions.map(skill => {
                        return {
                            value: skill.skillId,
                            label: skill.skillName}
                        }
                    )} 
                    onChange={onChangeSkill} 
                    isMulti 
                />
            </div>
            <div className="form-group pt-2">
                <button
                    className="btn btn-block btn-primary btn-lg"
                    type="submit"
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
    </div>
    </>
    )
}

export default RegisterLabourer;