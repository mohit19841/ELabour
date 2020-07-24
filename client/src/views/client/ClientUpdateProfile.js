import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as Auth from '../../utils/Auth';
import * as FormValidator from '../../utils/FormValidator';

import Select from 'react-select';
import PageHeader from '../components/PageHeader';
import Loader from '../components/Loader';
import FormErrors from '../components/FormErrors';
import ErrorMessage from '../components/ErrorMessage';

import PROVINCES from '../../utils/staticdata/Provinces';
const BASE_URL = "http://localhost:5001/api";

const ClientUpdateProfile = (props) => {

    // Authorization
    const [id] = useState(Auth.getID());

    // Component
    const [loaded, setLoaded] = useState();
    const [profileExists, setProfileExists] = useState(false);
    const [formErrors, setFormErrors] = useState([]);

    // Form Data
    const [formData, setFormData] = useState({
        companyname: "",
        email: "",
        phonenumber: "",
        city: "",
        province: "",
        companydescription: ""
    });

    const {
        companyname,
        email,
        phonenumber,
        city,
        province,
        companydescription
    } = formData;

    const fetchProfileData = async() => {
        try {
            let response = await fetch(BASE_URL + `/ClientProfile/${id}`, {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${Auth.getToken()}`
                }
            });

            if(response.status !== 200) {
                throw response;
            }

            let data = await response.json();

            if(data.client) {
                setProfileExists(true);

                // Set client data
                let client = data.client;
                let defaultProvince = PROVINCES.find(p => {
                    return p.label === client.clientState
                });

                setFormData({
                    companyname: client.clientName,
                    email: client.clientEmail,
                    phonenumber: client.clientPhoneNumber,
                    city: client.clientCity,
                    province: PROVINCES.find(p => p.label === client.clientState),
                    companydescription: client.clientDescription ? client.clientDescription : ""
                });
            }
        } catch(e) {
            console.error(e);
        }

        setLoaded(true);
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
            let response = await fetch(BASE_URL + `/ClientProfile`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({
                    Client: {
                        ClientId: id,
                        ClientName: companyname,
                        ClientEmail: email,
                        ClientPhoneNumber: phonenumber,
                        ClientCity: city,
                        ClientState: typeof(province) === "object" ? province.label : province,
                        ClientDescription: companydescription
                    }
                })
            });

            if(response.status !== 204) {
                throw response;
            } else {
                props.history.push(`/profile/client/${id}`);
            }
        } catch(e) {
            console.error(e)
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onChangeProvince = e => {
        setFormData({ ...formData, province: e.label });
    }
    
    useEffect(() => {
        fetchProfileData();
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
                Company Name <span className="text-danger">*</span>
            </label>
            <input
                required
                onChange={e => onChange(e)}
                value={companyname}
                name="companyname"
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
            <label htmlFor="title">
                Phone Number <span className="text-danger">*</span>
            </label>
            <input
                required
                onChange={e => onChange(e)}
                value={phonenumber}
                name="phonenumber"
                type="text"
                className="form-control form-control-lg"
            />
        </div>

        <div className="form-group">
            <label htmlFor="title">
                City <span className="text-danger">*</span>
            </label>
            <input
                required
                onChange={e => onChange(e)}
                value={city}
                name="city"
                type="text"
                className="form-control form-control-lg"
            />
        </div>

        <div className="form-group">
            <label htmlFor="province">
                Province <span className="text-danger">*</span>
            </label>
            <Select
                required
                defaultValue={province}
                onChange={e => onChangeProvince(e)}
                options={PROVINCES}
            />
        </div>

        <div className="form-group">
            <label htmlFor="title">
                Company Description
            </label>
            <textarea
                onChange={e => onChange(e)}
                value={companydescription}
                name="companydescription"
                type="text"
                className="form-control form-control-lg"
                rows="5"
            />
        </div>

        <div className="form-group row text-right mt-3">
        <div className="col col-lg-12">
            <Link
                to={`/profile/client/${id}`}
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

export default ClientUpdateProfile;