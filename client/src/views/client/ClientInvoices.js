import React, { useState, useEffect } from 'react';

import * as Auth from '../../utils/Auth';
import * as DataSanitizer from '../../utils/DataSanitizer';

import Loader from '../components/Loader';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Select from 'react-select';
import FormErrors from '../components/FormErrors';
import UnauthorizedMessage from '../components/UnauthorizedMessage';

const BASE_URL = "http://localhost:5001/api";

const ClientInvoices = (props) => {

    // Authorization
    const [authorized] = useState(Auth.authenticateClient());

    // Components
    const [loaded, setLoaded] = useState(false);
    const [formErrors, setFormErrors] = useState([]);

    // Data
    const [jobs, setJobs] = useState();
    const [jobsTableColumns, setJobsTableColumns] = useState();
    const [weeks, setWeeks] = useState();

    // Form
    const [selectedJob, setSelectedJob] = useState();
    const [selectedWeek, setSelectedWeek] = useState();

    const fetchJobs = async() => {
        try {
            const URI = BASE_URL + `/Job/GetJobByClientId/${Auth.getID()}`;
            let response = await fetch(URI, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Auth.getToken()}`
                }
            });
    
            if(response.status !== 200) {
                throw response;
            }
    
            let data = await response.json();
    
            if(data.length) {
                setJobs(data.map((d) => {
                    return {
                        label: d.title,
                        value: d.jobId
                    }
                }));
            }
        } catch(e) {
            console.error(e);
        }
    }

    const fetchInvoiceWeeksByJobID = async(id) => {
        try {
            const URI = BASE_URL + `/ClientInvoice/${id}`;
            let response = await fetch(URI, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Auth.getToken()}`
                }
            });
    
            if(response.status !== 200) {
                throw response;
            }
    
            let data = await response.json();

            if(data.length) {
                setWeeks(data.map((d) => {
                    let start = DataSanitizer.formatDateString(d.firstDay);
                    let end = DataSanitizer.formatDateString(d.lastDay);
                    let label = `${start} - ${end}`;
                    return {
                        label: label,
                        value: "",
                        JobId: d.jobId,
                        StartDay: DataSanitizer.formatDateParams(d.firstDay),
                        EndDay: DataSanitizer.formatDateParams(d.lastDay)
                    }
                }));
            } else {
                setSelectedWeek(null);
            }
        } catch(e) {
            console.error(e);
        }
    }

    const onChangeJob = (selection) => {
        if(selection) {
            setSelectedJob(selection.value);
            fetchInvoiceWeeksByJobID(selection.value);
        }
    }

    const onChangeWeek = (selection) => {
        if(selection) {
            setSelectedWeek(selection);
        }
    }

    const validateForm = _ => {
        let errors = [];

        if(!selectedJob) {
            errors.push("No job has been selected.");
        }

        if(!selectedWeek) {
            errors.push("No billing week has been selected.");
        }

        if(errors.length) {
            setFormErrors(errors);
            return false;
        } else {
            return true;
        }
    }

    const submitForm = e => {
        e.preventDefault();

        if(validateForm()) {
            const { JobId, StartDay, EndDay } = selectedWeek;
            props.history.push(`/invoice/${JobId}/${StartDay}/${EndDay}`);
        }
    }

    useEffect(() => {
        if(authorized) {
            fetchJobs();
            setLoaded(true);
        }
    }, [])

    const content = (
    <>
    <PageHeader
        title={`Invoices`}
        breadcrumbs={[
            { name: "Home", path: "/dashboard" },
            { name: "Invoices" }
        ]}
    />

    <Loader loaded={loaded}>
        <div className="row">
        <div className="col">
        <div className="card">
        <h5 className="card-header">Generate an Invoice</h5>
        <div className="card-body">
        
        {formErrors.length > 0 && (
        <FormErrors errors={formErrors} />
        )}

        <form onSubmit={submitForm}>
            <label htmlFor="job">Select Job</label>
            <Select
                required
                name="job"
                options={jobs}
                onChange={onChangeJob}
                className="mb-3"
            />

            <label htmlFor="job">Select Billing Week</label>
            <Select
                required
                value={selectedWeek}
                name="week"
                options={weeks}
                onChange={onChangeWeek}
                isDisabled={selectedJob ? false : true}
                className="mb-3"
            />

            <button
                className="btn btn-primary btn-lg mt-3 float-right"
            >
                Generate
            </button>
        </form>
        </div>
        </div>
        </div>
        </div>    
    </Loader>
    </>
    );

    return <Layout content={authorized ? content : <UnauthorizedMessage />} />;
}

export default ClientInvoices;