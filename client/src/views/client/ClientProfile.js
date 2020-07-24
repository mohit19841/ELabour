import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as Auth from '../../utils/Auth';
import * as DataSanitizer from '../../utils/DataSanitizer';
import { isWholeNumber } from '../../utils/IsWholeNumber';

import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import RatingBadge from '../components/RatingBadge';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import UnauthorizedMessage from '../components/UnauthorizedMessage';

const BASE_URL = "http://localhost:5001/api";

const ClientProfile = (props) => {

    // Authorization
    const [id] = useState(
        props.match.params.id && isWholeNumber(props.match.params.id) ? props.match.params.id : null
    );

    const [authorized] = useState(
        Auth.authenticateClient() && Auth.getID() === id ? true :
        Auth.authenticateAdmin() ? true :
        false
    );

    const [isProfileOwner] = useState(
        authorized && Auth.authenticateClient()
    );

    const [isAdministrator] = useState(Auth.authenticateAdmin());

    // Component
    const [loaded, setLoaded] = useState();

    // Data
    const [client, setClient] = useState();
    const [jobs, setJobs] = useState();
    const [incidents, setIncidents] = useState();

    // Table Columns
    const [jobsTableColumns, setJobsTableColumns] = useState();
    const [incidentsTableColumns, setIncidentsTableColumns] = useState();

    const fetchProfileData = async(id) => {
        // Get client profile
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
                setClient({...data.client, rating: data.averageRating});
            }
        } catch(e) {
            console.error(e);
        }

        // Get client jobs
        try {
            let response = await fetch(BASE_URL + `/Job/GetJobByClientId/${id}`, {
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
                let formattedData = data.map(d => ({
                    id: d.jobId,
                    title: d.title,
                    startdate: DataSanitizer.formatDateString(d.startDate),
                    enddate: DataSanitizer.formatDateString(d.endDate),
                    status: d.isComplete ? "Complete" : "In Progress"
                }));

                setJobsTableColumns([
                    {Header: 'Job Title', accessor: 'title'},
                    {Header: 'Start Date', accessor: 'startdate'},
                    {Header: 'End Date', accessor: 'enddate'},
                    {Header: 'Completion Status', accessor: 'status'},
                ]);
                setJobs(formattedData);
            }
        } catch(e) {
            console.error(e);
        }

        // Get client incidents
        try {
            const URI = BASE_URL + `/Incidents/GetIncidentsByClientId/${id}`;
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
                let formattedData = data.map(d => ({
                    id: d.incidentReportId,
                    job: d.jobTitle,
                    date: DataSanitizer.formatDateString(d.incidentReportDate),
                    type: d.incidentType
                }));

                setIncidents(formattedData);
                setIncidentsTableColumns([
                    {Header: 'Date', accessor: 'date'},
                    {Header: 'Job', accessor: 'job'},
                    {Header: 'Incident Type', accessor: 'type'}
                ]);
            }
        } catch(e){
            console.error(e);
        }

        // Set loading state
        setLoaded(true);
    }

    const profile = client && (
    <>
    <PageHeader
        title={`Client Profile`}
        breadcrumbs={[
            { name: "Home", path: "/dashboard" },
            { name: "Client Profile" }
        ]}
    />

    <div className="row">
        {/* Profile */}
        <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="card">
            <div className="card-body">
                <h1 className="font-26 mb-2">
                    {client.clientName}
                </h1>
            </div>

            <div className="card-body border-top">
                <h3 className="font-16">Quality Rating</h3>
                <RatingBadge rating={client.rating} />
            </div>

            <div className="card-body border-top">
                <h3 className="font-16">Contact</h3>
                <ul className="list-unstyled icon-list mb-0">
                    <li className="mb-2">
                        <i className="material-icons">phone</i>
                        <span>
                            {client.clientPhoneNumber}
                        </span>
                    </li>
                </ul>
            </div>

            { client.clientDescription &&
            <div className="card-body border-top">
                <h3 className="font-16">About</h3>
                <p>{client.clientDescription}</p>
            </div>
            }

            <div className="card-body border-top">
                <h3 className="font-16">Location</h3>
                <address className="mb-0">
                    {`${client.clientCity}, ${client.clientState}`}
                </address>
            </div>

            { isProfileOwner &&
            <div className="card-body border-top">
                <Link
                    to="/profile/edit"
                    className="btn btn-light"
                >
                    Edit Profile
                </Link>
            </div>
            }
        </div>
        </div>

        <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
            {/* Admin Actions */}
            { isAdministrator &&
            <div className="card">
                <h4 className="card-header">Manage Invoices</h4>
                <div className="card-body">
                <p>Invoices table goes here</p>
                </div>
            </div>
            }

            {/* Jobs */}
            <div className="card">
                <div className="card-header d-flex">
                    <h4 className="card-header-title">Active Jobs</h4>
                    { isProfileOwner &&
                    <div className="toolbar ml-auto">
                        <Link
                            to="/dashboard"
                            className="btn btn-primary btn-sm"
                        >
                            View All
                        </Link>
                    </div>
                    }
                </div>   
                <div className="card-body">
                    { !jobs ? <ErrorMessage message={"No jobs to display."} /> :
                    <Table
                        data={jobs}
                        columns={jobsTableColumns}
                        itemsPerPage={5}
                        path={'/job'}
                        searchable={false}
                        {...props}
                    />
                    }
                </div>
            </div>

            {/* Incidents */}
            <div className="card">
            <div className="card-header d-flex">
                <h4 className="card-header-title">Incidents</h4>
                { isProfileOwner &&
                    <div className="toolbar ml-auto">
                        <Link
                            to="/dashboard"
                            className="btn btn-primary btn-sm"
                        >
                            View All
                        </Link>
                    </div>
                } 
            </div>
            <div className="card-body">
                { !incidents ? <ErrorMessage message={"No incidents to display."} /> :
                    <Table
                        data={incidents}
                        columns={incidentsTableColumns}
                        path="/incident"
                        itemsPerPage={5}
                        searchable={false}
                        {...props}
                    />
                }
            </div>
            </div>
        </div>
    </div>
    </>
    );

    const content = !authorized ? <UnauthorizedMessage /> :
    (
    <>
    <Loader loaded={loaded}>
    { client ? profile : <ErrorMessage message={"No profile found."} /> }
    </Loader>
    </>
    );

    useEffect(() => {
        if(authorized) fetchProfileData(id);
    }, [])

    return <Layout content={content} />;
}

export default ClientProfile;