import React, { useState, useEffect } from 'react';

import * as Auth from '../../utils/Auth';
import * as DataSanitizer from '../../utils/DataSanitizer';

import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import ErrorMessage from '../components/ErrorMessage';

const BASE_URL = "http://localhost:5001/api";

const LabourerDashboard = (props) => {

    // Components
    const [loaded, setLoaded] = useState(false);

    // Data
    const [jobs, setJobs] = useState();

    // Stats
    const [assignedJobsStat, setAssignedJobsStat] = useState();
    const [totalIncidentsStat, setTotalIncidentsStat] = useState();
    const [overallRatingStat, setOverallRatingStat] = useState();

    // Table Columns
    const [jobsTableColumns, setJobsTableColumns] = useState();

    const fetchDashboardData = async() => {
        try {
            const URI = `${BASE_URL}/Job/GetJobByLabourerId/${Auth.getID()}`;

            // Fetch
            let response = await fetch(URI, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Auth.getToken()}`
                }
            })

            // Check for valid response
            if(response.status !== 200) {
                throw response;
            }
            
            // Process response data
            let data = await response.json();

            if(data.length) {
                let formattedData = data.map(d => ({
                    id: d.jobId,
                    title: d.title,
                    startdate: DataSanitizer.formatDateString(d.startDate),
                    enddate: DataSanitizer.formatDateString(d.endDate),
                    status: d.isComplete ? "Complete" : "In Progress"
                }));

                setJobs(formattedData.reverse());
                
                setJobsTableColumns([
                    {Header: 'Job Title', accessor: 'title'},
                    {Header: 'Start Date', accessor: 'startdate'},
                    {Header: 'End Date', accessor: 'enddate'},
                    {Header: 'Completion Status', accessor: 'status'},
                ]);
                
                setAssignedJobsStat(data.length);
            }

        } catch (e) {
            console.error(e);
        }

        // Fetch total incidents number
        try {
            const URI = BASE_URL + `/Incidents/GetIncidentsByLabourerId/${Auth.getID()}`;
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
                setTotalIncidentsStat(data.length);
            }
        } catch(e){
            console.error(e);
        }

        // Fetch overall rating
        try {
            const URI = BASE_URL + `/LabourerProfile/${Auth.getID()}`;
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

            if(data && data.averageQuality) {
                let rating = Math.round((data.averageQuality / 5) * 100);
                setOverallRatingStat(rating);
            }
        } catch(e){
            console.error(e);
        }

        // Set loading state
        setLoaded(true);
    }

    useEffect(() => {
        fetchDashboardData();
    }, [])

    return (
    <Loader loaded={loaded}>
    <div className="row">
    <div className="col-12">

        {/* Page Header */}
        <PageHeader
            title={`Welcome back, ${props.name}!`}
            breadcrumbs={[
                { name: "Home", path: "/dashboard" },
                { name: "Labourer Dashboard" }
            ]}
        />

        {/* Display dashboard data if jobs exist */}
        { !jobs ?
        <ErrorMessage message={"You have not been assigned any jobs yet."} /> :
        <>
        {/* Warning for low ratings */}
        {
            (overallRatingStat && overallRatingStat <= 70) &&
            <ErrorMessage
                message={
                <p className="font-18">
                    <strong>Warning:</strong> Your quality rating is significantly lower than the average rating of other labourers on this platform.
                </p>
                }
            />
        }
        
        {/* Stats */}
        <div className="row">
            <div className="col-12 col-md-4">
	        <div className="card">
	        <div className="card-body">
                <div className="d-inline-block">
                    <h5 className="text-muted">
                        Assigned Jobs
                    </h5>
                    <h2 className="mb-0">
                        { assignedJobsStat ? assignedJobsStat : "N/A" }
                    </h2>
                </div>
                <div className="float-right icon-circle-medium icon-box-lg bg-info-light mt-1">
                    <i className="material-icons text-info">work</i>
                </div>
	        </div>
	        </div>
	        </div>

            <div className="col-12 col-md-4">
	        <div className="card">
	        <div className="card-body">
                <div className="d-inline-block">
                    <h5 className="text-muted">
                        Total Incidents
                    </h5>
                    <h2 className="mb-0">
                    { totalIncidentsStat ? totalIncidentsStat : "N/A" }
                    </h2>
                </div>
                <div className="float-right icon-circle-medium icon-box-lg bg-secondary-light mt-1">
                    <i className="material-icons text-secondary">report_problem</i>
                </div>
	        </div>
	        </div>
	        </div>

            <div className="col-12 col-md-4">
	        <div className="card">
	        <div className="card-body">
                <div className="d-inline-block">
                    <h5 className="text-muted">
                        Overall Rating
                    </h5>
                    <h2 className="mb-0">
                        { overallRatingStat ? `${overallRatingStat}%` : "N/A" }
                    </h2>
                </div>
                <div className="float-right icon-circle-medium icon-box-lg bg-brand-light mt-1">
                    <i className="material-icons text-brand">thumb_up</i>
                </div>
	        </div>
	        </div>
	        </div>
        </div>

        {/* Jobs Table */}
        <div className="row">
        <div className="col">
        <div className="card">
            <h4 className="card-header">All Jobs</h4>
            <div className="card-body">
                { jobs &&
                    <Table
                        data={jobs}
                        columns={jobsTableColumns}
                        path="/job"
                        searchable={true}
                        {...props}
                    />
                }
            </div>
        </div>
        </div>
        </div>
    </>
    }
    </div>
    </div>
    </Loader>
    );
}

export default LabourerDashboard;