import React, { useState, useEffect } from 'react';

import * as Auth from '../../utils/Auth';
import * as DataSanitizer from '../../utils/DataSanitizer';

import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import ErrorMessage from '../components/ErrorMessage';

const BASE_URL = "http://localhost:5001/api";

const AdminDashboard = (props) => {

    // Components
    const [loaded, setLoaded] = useState(false);

    // Data
    const [jobs, setJobs] = useState();
    const [jobsTableColumns, setJobsTableColumns] = useState();

    // Stats
    const [totalJobsStat, setTotalJobsStat] = useState();
    const [totalClientsStat, setTotalClientsStat] = useState();
    const [totalLabourersStat, setTotalLabourersStat] = useState();
    const [totalIncidentsStat, setTotalIncidentsStat] = useState();

    const fetchDashboardData = async() => {
        // Get jobs
        try {
            const URI = BASE_URL + "/Job/GetAllActiveJobs";
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
                setTotalJobsStat(data.length);
            }
        } catch(e) {
            console.error(e);
        }

        // Get client count
        try {
            const URI = BASE_URL + "/Admin/GetClientCount";
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

            if(data) {
                setTotalClientsStat(data);
            }
        } catch(e) {
            console.error(e);
        }

        // Get labourer count
        try {
            const URI = BASE_URL + "/Admin/GetLabourerCount";
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

            if(data) {
                setTotalLabourersStat(data);
            }
        } catch(e) {
            console.error(e);
        }

        // Get incident count
        try {
            const URI = BASE_URL + "/Admin/GetIncidentCount";
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

            if(data) {
                setTotalIncidentsStat(data);
            }
        } catch(e) {
            console.error(e);
        }

        // Set loading state
        setLoaded(true);
    }

    useEffect(() => {
        fetchDashboardData();
    }, [])

    return (
    <>
    <PageHeader
        title={`Welcome back, Admin!`}
        breadcrumbs={[
            { name: "Home", path: "/dashboard" },
            { name: "Admin Dashboard" }
        ]}
    />

    <Loader loaded={loaded}>
        {/* Stats */}
        <div className="row">
            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="card">
                <div className="card-body">
                    <div className="d-inline-block">
                        <h5 className="text-muted">
                            Total Jobs
                        </h5>
                        <h2 className="mb-0">
                            {`${totalJobsStat} active job(s)`}
                        </h2>
                    </div>
                    <div className="float-right icon-circle-medium icon-box-lg bg-info-light mt-1">
                        <i className="material-icons text-info">work</i>
                    </div>
                </div>
                </div>
            </div>

            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="card">
                <div className="card-body">
                    <div className="d-inline-block">
                        <h5 className="text-muted">
                            Total Clients
                        </h5>
                        <h2 className="mb-0">
                            {`${totalClientsStat} client(s)`}
                        </h2>
                    </div>
                    <div className="float-right icon-circle-medium icon-box-lg bg-success-light mt-1">
                        <i className="material-icons text-success">business</i>
                    </div>
                </div>
                </div>
            </div>

            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="card">
                <div className="card-body">
                    <div className="d-inline-block">
                        <h5 className="text-muted">
                            Total Labourers
                        </h5>
                        <h2 className="mb-0">
                            {`${totalLabourersStat} labourer(s)`}
                        </h2>
                    </div>
                    <div className="float-right icon-circle-medium icon-box-lg bg-brand-light mt-1">
                        <i className="material-icons text-brand">emoji_people</i>
                    </div>
                </div>
                </div>
            </div>

            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="card">
                <div className="card-body">
                    <div className="d-inline-block">
                        <h5 className="text-muted">
                            Incident Reports
                        </h5>
                        <h2 className="mb-0">
                            {`${totalIncidentsStat} report(s)`}
                        </h2>
                    </div>
                    <div className="float-right icon-circle-medium icon-box-lg bg-secondary-light mt-1">
                        <i className="material-icons text-secondary">warning</i>
                    </div>
                </div>
                </div>
            </div>
        </div>

        {/* Jobs Table */}
        <div className="row">
        <div className="col">
        <div className="card">
        <h5 className="card-header">Active Jobs</h5>
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
    </Loader>
    </>
    )
}

export default AdminDashboard;
