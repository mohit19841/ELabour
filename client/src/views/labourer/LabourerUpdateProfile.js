import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as Auth from '../../utils/Auth';
import * as FormValidator from '../../utils/FormValidator';

import Select from 'react-select';
import PageHeader from '../components/PageHeader';
import Loader from '../components/Loader';
import FormErrors from '../components/FormErrors';
import ErrorMessage from '../components/ErrorMessage';

const BASE_URL = "http://localhost:5001/api";

const LabourerUpdateProfile = (props) => {

    // Authorization
    const [id] = useState(Auth.getID());

    // Component
    const [loaded, setLoaded] = useState();
    const [profileExists, setProfileExists] = useState(false);
    const [skillOptions, setSkillOptions] = useState();
    const [formErrors, setFormErrors] = useState([]);

    // Form Data
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        isAvailable: null
    });

    const {
        firstname,
        lastname,
        email,
        isAvailable
    } = formData;

    const fetchProfileData = async() => {
        try {
            const URI = BASE_URL + `/LabourerProfile/${id}`;
            let response = await fetch(URI, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            
            if(response.status !== 200) {
                throw response;
            }
    
            let data = await response.json();

            if(data.labourer) {
                setProfileExists(true);

                // Set profile data
                let profile = data.labourer;
                setFormData({
                    firstname: profile.labourerFirstName,
                    lastname: profile.labourerLastName,
                    email: profile.labourerEmail,
                    // isAvailable: profile.isAvailable
                });
            }
        } catch(e){
            console.error(e);
        }

        try {
            const URI = BASE_URL + `/SkillsLabourer/${id}`;
            let response = await fetch(URI, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            
            if(response.status !== 200) {
                throw response;
            }
    
            let data = await response.json();

            if(data.length) {
                setSelectedSkills(data.map((d) => ({
                    value: d.skill.skillId,
                    label: d.skill.skillName
                })));
            }
        } catch(e){
            console.error(e);
        }
        
        // Set loading state
        setLoaded(true);
    }

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

    const submitForm = async() => {
        try {
            let URI = BASE_URL + `/LabourerProfile/${Auth.getID()}`;
            let response = await fetch(URI, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({
                    Labourer: {
                        LabourerId: id,
                        LabourerFirstName: firstname,
                        LabourerLastName: lastname,
                        LabourerEmail: email
                    },
                    Skills: selectedSkills.map(skill => {
                        return { SkillName: skill.label }
                    })
                })
            })

            if(response.status !== 204) {
                throw response;
            } else {
                props.history.push(`/profile/labourer/${id}`);
            }
        } catch(e){
            console.error(e);
        }
    }

    const validateForm = e => {
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

        if(!selectedSkills.length) {
            errors.push("You must select at least one skill.")
        }
        
        if(errors.length) {
            setFormErrors(errors);
        } else {
            submitForm();
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onChangeSkill = (skills) => {
        if(!skills) {
            setSelectedSkills([]);
        } else if(!skills.length) {
            setSelectedSkills([]);
        } else {
            let selected = [];
            skills.forEach(skill => selected.push(skill));
            setSelectedSkills(selected);
        }
    }

    useEffect(() => {
        fetchProfileData();
        fetchSkillOptions();
    }, [])

    const form = profileExists && (
    <>
    <PageHeader
        title={`Update Profile`}
        breadcrumbs={[
            { name: "Home", path: "/dashboard" },
            { name: "Update Profile" }
        ]}
    />

    <div className="card">
    <div className="card-body">
    { formErrors.length > 0 && <FormErrors errors={formErrors} /> }
    <form onSubmit={e => validateForm(e)}>
        <div className="form-group">
            <label htmlFor="title">
                First Name <span className="text-danger">*</span>
            </label>
            <input
                required
                onChange={e => onChange(e)}
                value={firstname}
                name="firstname"
                type="text"
                maxLength="40"
                className="form-control form-control-lg"
            />
        </div>

        <div className="form-group">
            <label htmlFor="title">
                Last Name <span className="text-danger">*</span>
            </label>
            <input
                required
                onChange={e => onChange(e)}
                value={lastname}
                name="lastname"
                type="text"
                maxLength="40"
                className="form-control form-control-lg"
            />
        </div>

        <div className="form-group">
            <label htmlFor="title">
                Email Address <span className="text-danger">*</span>
            </label>
            <input
                required
                onChange={e => onChange(e)}
                value={email}
                name="email"
                type="email"
                className="form-control form-control-lg"
            />
        </div>

        <div className="form-group">
            <label className="d-block" htmlFor="skills">
                Select Skills <span className="text-danger">*</span>
            </label>
            <Select
                defaultValue={selectedSkills}
                options={
                    skillOptions && skillOptions.map(skill => {
                        return {
                            value: skill.skillId,
                            label: skill.skillName
                        }
                    })
                }
                onChange={onChangeSkill} 
                isMulti 
            />
        </div>

        {/* <div className="form-group">
            <label className="mt-2 mr-3">
                Are you available for work?
            </label>
            <div className="switch-button switch-button-success">
                <input
                    checked={isAvailable}
                    type="checkbox"
                    name="switch16"
                    id="switch16"
                    onChange={onChangeAvailability}
                />
                <span><label htmlFor="switch16"></label></span>
            </div>
        </div> */}

        <div className="form-group row text-right mt-3">
        <div className="col col-lg-12">
            <Link
                to={`/profile/labourer/${id}`}
                className="btn btn-light btn-lg"
            >
                Cancel
            </Link>
            <button
                type="submit"
                onClick={e => validateForm(e)}
                className="btn btn-primary btn-lg ml-2"
            >
                Save Changes
            </button>
        </div>
        </div>

    </form>  
    </div>
    </div>
    </>
    );

    return (
    <Loader loaded={loaded}>
    { form ? form : <ErrorMessage message={"No profile found."} /> }
    </Loader>
    );
}

export default LabourerUpdateProfile;