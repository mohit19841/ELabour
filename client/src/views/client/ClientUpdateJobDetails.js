import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';

import TopNav from '../components/TopNav';
import SideNav from '../components/SideNav';
import * as Auth from '../../utils/Auth';
import Select from 'react-select';
import PROVINCES from '../../utils/staticdata/Provinces';

const BASE_URL = "http://localhost:5001/api";

const ClientUpdateJobDetails = (props) => {

    const [formErrors, setFormErrors] = useState([]);
    const [job, setJob] = useState({
        title: "",
        startdate: "",
        enddate: "",
        jobdescription: "",
        address: "",
        province: "",
        city: "",
        duration: ""
    })
    const { title, startdate, enddate, description, address, province, city } = job;

    const fetchJobDetails = async(id) => {
       
        try {
            let response = await fetch(BASE_URL + '/job/getJob/' + id , {
                method : 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ Auth.getToken()}`
                }
            })
            let data = await response.json();
            setJob({
                clientId : data.clientId,
                title : data.title,
                description : data.jobDescription,
                address : data.street,
                city : data.city
            });
        } catch (err) {
            console.error(err);
        }
    }

    const onChange = e => {
        e.preventDefault();
        setJob( {...job , [e.target.name]: e.target.value})
    }

    const onChangeProvince = e => {
        setJob({ ...job, province: e.label })
    }

    const submitForm = async () => {
        let token = Auth.getToken();
        
        let editJob = {
            ClientId: job.clientId,
            Title: title,
            JobDescription: description,
            Street: address,
            City: city,
            State: province,
        }

        if (Auth.getID() != editJob.ClientId) {
            console.log(Auth.getID())
            console.log(editJob.ClientId)
            setFormErrors(["Failed to edit job. You are not allowed to edit the job."]);
        } else {
            try {
                const URI = BASE_URL + '/job/PutJob/' + props.match.params.id;
                let response = await fetch(URI, {            
                    'method': 'PUT',
                    'headers': {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(editJob)
                })

                if(response.status !== 200) {
                    setFormErrors(["Failed to edit job. Please try again later."]);
                    throw response;
                }

                let data = await response.json();

                if(data) {
                    props.history.push('/job/' + data);
                }
            } catch(e) {
                console.error(e);
            }
        }
    }

    const validateForm = e => {
        e.preventDefault();
        let errors = [];

       
        if(province === "") {
            errors.push("Province is required.");
        }
        if(errors.length) {
            setFormErrors(errors);
        } else {
            submitForm();
        }
    }

    useEffect(() => {
        if(props.match.params.id) {
            if(Number.isInteger(Number(props.match.params.id))) {
                fetchJobDetails(props.match.params.id);
            }
        }
    }, [props.match.params.id])
 
    return (
        <div className="dashboard-main-wrapper">
        <TopNav />
        <SideNav />

        <div className="dashboard-wrapper">
        <div className="container-fluid dashboard-content">

           {/* Page Header */}
           <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="page-header">
                <h2 className="pageheader-title">Update Job</h2>
                <div className="page-breadcrumb">
                <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/dashboard" className="breadcrumb-link">Dashboard</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Update Job</li>
                </ol>
                </nav>
                </div>
            </div>
            </div>
            </div>

            {/* Form */}
            <div className="card">
            <div className="card-body">
            {/* Display form errors, if any */}
            { formErrors.length > 0 &&
            <div className="alert alert-danger">
            <ul className="pl-3 mb-0">
            { formErrors.map((error, i) => <li key={i}>{error}</li>) }
            </ul>
            </div>
            }
            <form className="client-add-job-form">
                <div className="form-group mb-4">
                    <label htmlFor="title">Job Title <span className="text-danger">*</span></label>
                    <input
                        required
                        name="title"
                        type="text"
                        value={ title }
                        placeholder="Enter job title"
                        className="form-control form-control-lg"
                        onChange={e => onChange(e)}
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="description">Job Description</label>
                    <textarea
                        name="description"
                        type="text"
                        value={ description }
                        placeholder="Enter job description"
                        rows="3"
                        className="form-control form-control-lg"
                        onChange={e => onChange(e)}
                    />
                </div>
                <div className="form-row mb-4">
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">
                        <label htmlFor="address">Address <span className="text-danger">*</span></label>
                        <input
                            required
                            name="address"
                            type="text"
                            value={ address }
                            placeholder="Enter address"
                            className="form-control form-control-lg"
                            onChange={e => onChange(e)}
                        />
                    </div>
                    <div className="form-group col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">
                        <label htmlFor="province">Province <span className="text-danger">*</span></label>
                        <Select
                            required
                            name="province"
                            options={PROVINCES}
                            onChange={e => onChangeProvince(e)}
                        />
                            
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">
                        <label htmlFor="city">City <span className="text-danger">*</span></label>
                        <input
                            required
                            maxLength="30"
                            name="city"
                            type="text"
                            value={ city }
                            placeholder="Enter city"
                            className="form-control form-control-lg"
                            onChange={e => onChange(e)}
                        />
                    </div>
                </div>

                <div className="form-group row text-right mt-4">
                <div className="col col-lg-12">
                    <Link to="/dashboard" className="btn btn-space btn-light btn-lg">Cancel</Link>
                    <button onClick={validateForm} className="btn btn-space btn-primary btn-lg">Save Changes</button>
                </div>
                </div>
  
            </form>
            </div>
            </div>

        </div>
        </div>
    </div>
    )
}


export default ClientUpdateJobDetails;