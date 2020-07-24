import React, { useState, useEffect } from 'react';

import * as Auth from '../../utils/Auth';
import * as DataSanitizer from '../../utils/DataSanitizer';

import Loader from '../components/Loader';
import Table from '../components/Table';
import PageHeader from '../components/PageHeader';
import ErrorMessage from '../components/ErrorMessage';

const BASE_URL = "http://localhost:5001/api";

const ClientDashboard = (props) => {

    // Components
    const [loaded, setLoaded] = useState(false);

    // Data
    const [jobs, setJobs] = useState();
    const [jobsTableColumns, setJobsTableColumns] = useState();

    const fetchJobs = async() => {
        try {
            let response = await fetch(BASE_URL + `/Job/GetJobByClientId/${Auth.getID()}`, {
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

                setJobs(formattedData);
                setJobsTableColumns([
                    {Header: 'Job Title', accessor: 'title'},
                    {Header: 'Start Date', accessor: 'startdate'},
                    {Header: 'End Date', accessor: 'enddate'},
                    {Header: 'Completion Status', accessor: 'status'},
                ]);
            }
        } catch(e) {
            console.error(e);
        }

        // Set loading state
        setLoaded(true);
    }

    useEffect(() => {
        fetchJobs();
    }, [])

    return (
    <Loader loaded={loaded}>
    <div className="row">
    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">

        <PageHeader
            title={`Welcome back, ${props.name}!`}
            breadcrumbs={[
                { name: "Home", path: "/dashboard" },
                { name: "Client Dashboard" }
            ]}
        />

        {/* Display dashboard data if jobs exist */}
        { !jobs ?
        <ErrorMessage message={"You have not created any jobs yet."} /> :
        <>

        {/* Jobs Table */}
        <div className="row">
        <div className="col">
        <div className="card">
        <h5 className="card-header">All Jobs</h5>
        <div className="card-body">
            { !jobs ? <ErrorMessage message={"No jobs to display."} /> :
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
    )
}

export default ClientDashboard;