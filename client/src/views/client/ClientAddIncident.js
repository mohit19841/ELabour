import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Link } from "react-router-dom";

import * as Auth from "../../utils/Auth";
import * as FormValidator from "../../utils/FormValidator";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import FormErrors from "../components/FormErrors";
import LabourerList from "../components/LabourerList";
import UnauthorizedMessage from "../components/UnauthorizedMessage";

const BASE_URL = "http://localhost:5001/api";

const ClientAddIncident = ({ history }) => {
    // Authorization
    const [authorized] = useState(Auth.authenticateClient());

    // Data
    const [jobs, setJobs] = useState([]);
    const [labourerList, setLabourerList] = useState([]);
    const [incidentOptions, setIncidentOptions] = useState([]);

    // Form Data
    const [formErrors, setFormErrors] = useState([]);

    const [selectedJob, setSelectedJob] = useState();
    const [selectedIncident, setSelectedIncident] = useState();
    const [selectedLabourers, setselectedLabourers] = useState([]);
    const [selectedJobStartDate, setSelectedJobStartDate] = useState();
    const [selectedJobEndDate, setSelectedJobEndDate] = useState();

    const [report, setReport] = useState({
        incidentdate: "",
        incidentsummary: "",
    });

    const { incidentdate, incidentsummary } = report;

    const fetchAllJobs = async () => {
        try {
            const response = await fetch(
                BASE_URL + `/Job/GetJobByClientId/${Auth.getID()}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${Auth.getToken()}`,
                    },
                }
            );

            if(response.status !== 200) {
                throw response;
            }

            let data = await response.json();

            if(data.length) {
                setJobs(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchLabourers = async (id) => {
        if(selectedJob) {
            const URI = BASE_URL + `/JobLabourers/${id}`;
            const response = await fetch(URI, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Auth.getToken()}`,
                },
            });

            if(response.status !== 200) {
                throw response;
            }

            const data = await response.json();

            if(data.length) {
                setLabourerList(data);
            }
        }
    };

    const fetchIncidentOptions = async () => {
        try {
            const URI = BASE_URL + "/IncidentType";
            const response = await fetch(URI);

            let data = await response.json();

            if(response.status !== 200) {
                throw response;
            }

            if(data.length) {
                setIncidentOptions(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onChange = (e) => {
        setReport({ ...report, [e.target.name]: e.target.value });
    };

    const onChangeJob = (job) => {
        if(job) {
            setSelectedJob(job.value);
            setSelectedJobStartDate(job.startDate);
            setSelectedJobEndDate(job.endDate);
            fetchLabourers(job.value);
        }
    };

    const onChangeType = (type) => {
        if (type) {
            setSelectedIncident(type.value);
        }
    };

    const validateForm = (e) => {
        e.preventDefault();
        let errors = [];

        // Validate date
        if (
            !FormValidator.date(incidentdate) &&
            incidentdate === null &&
            incidentdate === ""
        ) {
            errors.push("Invalid date entered.");
        }

        // Check if incident date is between selected job start/end date
        if(selectedJob && incidentdate && incidentdate !== "") {
            let start = new Date(selectedJobStartDate);
            let end = new Date(selectedJobEndDate);
            let selected = new Date(incidentdate);

            // Fix selected date format
            selected.setDate(selected.getDate() + 1);
            selected.setHours(0, 0, 0, 0);

            if(selected < start) {
                errors.push("Date of incident cannot be before the job start date.");
            }

            if(selected > end) {
                errors.push("Date of incident cannot be after the job end date.");
            }
        }

        // Check if incident is today or before
        if(incidentdate && incidentdate !== "") {
            let today = new Date();
            let selected = new Date(incidentdate);

            // Fix selected date format
            selected.setDate(selected.getDate() + 1);
            selected.setHours(0, 0, 0, 0);

            if(selected > today) {
                errors.push("Date of incident cannot be in the future.");
            }
        }

        // Validate incident type
        if(!selectedIncident) {
            errors.push("Incident type is required.");
        }

        // Validate job selection
        if(!selectedJob) {
            errors.push("You must select the job where the incident occured.");
        }

        // Validate labourers affected
        if(!selectedLabourers.length) {
            errors.push("You must select at least one labourer that was involved in the incident.");
        }

        // Validate incident summary
        if(!incidentsummary || incidentsummary === "") {
            errors.push("Incident summary is required.");
        }

        if(errors.length) {
            setFormErrors(errors);
        } else {
            submitForm();
        }
    };

    const submitForm = async () => {
        let token = Auth.getToken();

        let newReport = {
            IncidentTypeId: selectedIncident,
            IncidentReportDate: incidentdate,
            IncidentReportDescription: incidentsummary,
            JobId: selectedJob,
            AdminNotified: false
        };

        try {
            let response = await fetch(BASE_URL + "/incidents/PostIncident", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    IncidentReport: newReport,
                    LabourerReports: selectedLabourers,
                }),
            });

            // Bad response
            if (response.status !== 200) {
                throw response;
            }

            let data = await response.json();

            if(data) {
                history.push(`/incident/${data}`);
            } else {
                setFormErrors(["Failed to create incident. Please try again later."]);
            }
            
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (authorized) {
            fetchAllJobs();
            fetchIncidentOptions();
        }
    }, []);

    const content = (
        <>
            <PageHeader
                title={"Add Incident"}
                breadcrumbs={[
                    { name: "Home", path: "/dashboard" },
                    { name: "Incidents", path: "/incidents" },
                    { name: "Add Incident" },
                ]}
            />

            <div className="card">
                <div className="card-body">
                    <form className="client-add-incident-form">
                        <div>
                            {formErrors.length > 0 && (
                                <FormErrors errors={formErrors} />
                            )}
                        </div>

                        <div className="form-row mb-4">
                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">
                                <label htmlFor="incidentdate">
                                    Date Of Incident
                                    <span className="text-danger">*</span>
                                </label>
                                <input
                                    required
                                    name="incidentdate"
                                    type="date"
                                    className="form-control form-control-lg"
                                    onChange={(e) => onChange(e)}
                                />
                            </div>

                            <div className=" col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">
                                <label
                                    className="d-block"
                                    htmlFor="incidentType"
                                >
                                    Select incident type
                                    <span className="text-danger">*</span>
                                </label>
                                <Select
                                    required
                                    name="incidenttype"
                                    options={
                                        incidentOptions &&
                                        incidentOptions.map((incident) => {
                                            return {
                                                value: incident.incidentTypeId,
                                                label:
                                                    incident.incidentTypeName,
                                            };
                                        })
                                    }
                                    onChange={onChangeType}
                                />
                            </div>
                        </div>
                        <div className="form-row mb-4">
                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">
                                <label className="d-block" htmlFor="job">
                                    Select Job
                                    <span className="text-danger">*</span>
                                </label>
                                <Select
                                    required
                                    name="job"
                                    options={
                                        jobs &&
                                        jobs.map((job) => {
                                            return {
                                                value: job.jobId,
                                                label: job.title,
                                                startDate: job.startDate,
                                                endDate: job.endDate
                                            };
                                        })
                                    }
                                    onChange={onChangeJob}
                                />
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">
                                <label
                                    className="d-block"
                                    htmlFor="injuredLabourers"
                                >
                                    Labourers Affected
                                    <span className="text-danger">*</span>
                                </label>
                                {selectedJob ? (
                                    <LabourerList
                                        selectedJob={selectedJob}
                                        selectedLabourers={selectedLabourers}
                                        setselectedLabourers={
                                            setselectedLabourers
                                        }
                                        labourerList={labourerList}
                                        fetchLabourers={fetchLabourers}
                                    />
                                ) : (
                                    <input
                                        placeholder="Select..."
                                        className="form-control form-control-lg"
                                        disabled
                                    />
                                )}
                            </div>
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="incidentsummary">
                                Summary of Incident
                                <span className="text-danger">*</span>
                            </label>
                            <textarea
                                name="incidentsummary"
                                type="text"
                                placeholder="Enter incident summary"
                                rows="3"
                                className="form-control form-control-lg"
                                onChange={(e) => onChange(e)}
                            />
                        </div>

                        <div className="form-group row text-right mt-4">
                            <div className="col col-lg-12">
                                <Link
                                    to="/dashboard"
                                    className="btn btn-space btn-light btn-lg"
                                >
                                    Cancel
                                </Link>
                                <button
                                    onClick={validateForm}
                                    className="btn btn-space btn-primary btn-lg"
                                >
                                    Create New Incident
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
    
    return <Layout content={authorized ? content : <UnauthorizedMessage />} />;
};

export default ClientAddIncident;
