import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as Auth from '../../utils/Auth';
import * as DataSanitizer from '../../utils/DataSanitizer';
import { isWholeNumber } from '../../utils/IsWholeNumber';

import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import OneColumnTable from '../components/OneColumnTable';
import AvailabilityBadge from '../components/AvailabilityBadge';
import RatingBadge from '../components/RatingBadge';
import OnVacationBadge from '../components/OnVacationBadge';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import UnauthorizedMessage from '../components/UnauthorizedMessage';

const BASE_URL = "http://localhost:5001/api";

const LabourerProfile = (props) => {

    // Authorization
    const [id] = useState(
        props.match.params.id && isWholeNumber(props.match.params.id) ? props.match.params.id : null
    );

    const [authorized] = useState(
        Auth.authenticateLabourer() && Auth.getID() === id ? true :
        Auth.authenticateAdmin() ? true :
        false
    );

    const [isProfileOwner] = useState(Auth.authenticateLabourer());

    // Component
    const [loaded, setLoaded] = useState();

    // Data
    const [labourer, setLabourer] = useState();
    const [skills, setSkills] = useState();
    const [jobs, setJobs] = useState();
    const [incidents, setIncidents] = useState();
   
    // Table Columns
    const [jobsTableColumns, setJobsTableColumns] = useState();
    const [incidentsTableColumns, setIncidentsTableColumns] = useState();

    const fetchProfileData = async(id) => {
        // Fetch profile data
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
            
            if(data) {
                setLabourer({
                    ...data.labourer,
                    qualityRating: data.averageQuality,
                    safetyRating: data.averageSafety
                });
            }
        } catch(e){
            console.error(e);
        }

        // Fetch skills data
        try {
            const URI = BASE_URL + `/Skills/GetSkillNamesByLabourerId/${id}`;
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
                setSkills(data);
            }
        } catch(e){
            console.error(e);
        }

        // Fetch job data
        try {
            const URI = BASE_URL + `/Job/GetJobByLabourerId/${id}`;
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
        } catch(e){
            console.error(e);
        }

        // Fetch incident data
        try {
            const URI = BASE_URL + `/Incidents/GetIncidentsByLabourerId/${id}`;
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

    const profile = labourer && (
    <>
    <PageHeader
        title={`Labourer Profile`}
        breadcrumbs={[
            { name: "Home", path: "/dashboard" },
            { name: "Labourer Profile" }
        ]}
    />

    <div className="row">
        {/* Profile */}
        <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="card">

            <div className="card-body">
                <h1 className="font-26 mb-2">
                    {`${labourer.labourerFirstName} ${labourer.labourerLastName}`}
                </h1>
            </div>

            <div className="card-body border-top">
                <h3 className="font-16">Status</h3>
                <AvailabilityBadge status={labourer.isAvailable} />
            </div>

            <div className="card-body border-top">
                <h3 className="font-16">Quality Rating</h3>
                <RatingBadge rating={labourer.qualityRating} />
            </div>

            <div className="card-body border-top">
                <h3 className="font-16">Safety Rating</h3>
                <RatingBadge rating={labourer.safetyRating} />
            </div>

            <div className="card-body border-top">
                <h3 className="font-16">Contact Information</h3>
                <ul className="list-unstyled icon-list mb-0">
                    <li className="mb-2">
                        <i className="material-icons">email</i>
                        <span>
                            <a href={`mailto:${labourer.labourerEmail}`}>{labourer.labourerEmail}</a>
                        </span>
                    </li>
                </ul>
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
            {/* Skills */}
            <div className="card">
                <div className="card-header d-flex">
                    <h4 className="card-header-title">Skills</h4>
                    { isProfileOwner &&
                    <div className="toolbar ml-auto">
                        <Link
                            to="/profile/edit"
                            className="btn btn-light btn-sm"
                        >
                            Edit
                        </Link>
                    </div>
                    }
                </div>
                <div className="card-body">
                    { !skills ? <ErrorMessage message={"No skills found."} /> :
                    <OneColumnTable
                        data={skills}
                        header={"Name"}
                    />
                    }
                </div>
            </div>

            { isProfileOwner &&
            <div className="card">
                <h4 className="card-header">Availability</h4>
                <div className="card-body">
                    <p>Check the box below if you <strong>do not</strong> want to accept or be assigned to any new jobs.</p>
                    <OnVacationBadge 
                        labourerId={labourer.labourerId}
                        onLeave={labourer.onLeave} 
                    />
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
                        path="/job"
                        {...props}
                    />
                    }
                </div>
            </div>

            {/* Incidents */}
            <div className="card">
                <div className="card-header d-flex">
                    <h4 className="card-header-title">Incident Reports</h4>
                    { isProfileOwner &&
                    <div className="toolbar ml-auto">
                        <Link
                            to="/incidents"
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

    const content = (
    <Loader loaded={loaded}>
    { labourer ? profile : <ErrorMessage message={"No profile found."} /> }
    </Loader>
    );

    useEffect(() => {
        if(authorized) fetchProfileData(id);
    }, [])

    return <Layout content={authorized ? content : <UnauthorizedMessage />} />;
}

export default LabourerProfile;