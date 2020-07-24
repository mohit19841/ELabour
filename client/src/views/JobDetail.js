import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as Auth from '../utils/Auth';
import * as DataSanitizer from '../utils/DataSanitizer';
import { isWholeNumber } from './../utils/IsWholeNumber';

import Loader from './components/Loader';
import Layout from './components/Layout';
import PageHeader from './components/PageHeader';
import Tabs, { TabPane } from 'rc-tabs';
import TabContent from "rc-tabs/lib/TabContent";
import ScrollableInkTabBar from "rc-tabs/lib/ScrollableInkTabBar";
import Table from './components/Table';
import RateClient from "./components/RateClient";
import CheckSafetyMeeting from './components/CheckSafetyMeeting';
import ErrorMessage from './components/ErrorMessage';
import UnauthorizedMessage from './components/UnauthorizedMessage';

const BASE_URL = "http://localhost:5001/api";

const JobDetail = (props) => {

    // Authorization
    const [id] = useState(
        props.match.params.id && isWholeNumber(props.match.params.id) ? props.match.params.id : null
    );

    const [isAdmin] = useState(Auth.authenticateAdmin());
    const [isClient] = useState(Auth.authenticateClient());
    const [isLabourer] = useState(Auth.authenticateLabourer());
    const [isJobOwner, setIsJobOwner] = useState();

    // Component
    const [loaded, setLoaded] = useState(false);

    // Data
    const [details, setDetails] = useState();
    const [incidents, setIncidents] = useState();
    const [incidentsTableColumns, setIncidentsTableColumns] = useState();
    const [attendanceDates, setAttendanceDates] = useState();
    const [attendanceDatesTableColumns, setAttendanceDatesTableColumns] = useState();
    
    const fetchJobDetails = async(id) => {
        // Job details
        try {
            let response = await fetch(BASE_URL + '/job/getJob/' + id , {
                method : 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ Auth.getToken()}`
                }
            })

            if(response.status !== 200) {
                throw response;
            }

            let data = await response.json();

            if(data) {
                setDetails(data);
                setIsJobOwner(isClient && Auth.getID() == data.clientId ? true : false);
            }
        } catch(e) {
            console.error(e);
        }

        // Attendance schedule days
        try {
            let response = await fetch(BASE_URL + '/LabourerAttendance/' + id, {
                method : 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if(response.status !== 200) {
                throw response;
            }

            let data = await response.json();

            if(data.length) {
                let formattedData = data.map(d => ({
                    id: DataSanitizer.formatDateParams(d),
                    date: DataSanitizer.formatDateString(d)
                }));

                setAttendanceDates(formattedData);
                setAttendanceDatesTableColumns([{
                    Header: 'Date',
                    accessor: 'date'
                }]);
            }
        } catch (err) {
            console.error(err);
        }

        // Incident reports 
        try {
            let response = await fetch(BASE_URL + '/incidents/GetIncidentsByJobId/' + id, {
                method : 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Auth.getToken()}`
                }
            });

            if(response.status !== 200) {
                throw response;
            }

            let data = await response.json();

            if(data && data.length) {
                let formattedData = data.map(d => ({
                    id: d.incidentReportId,
                    job: d.job.title,
                    date: DataSanitizer.formatDateString(d.incidentReportDate),
                    type: d.incidentType.incidentTypeName,
                    affected: `${d.labourerIncidentReport.length} labourer(s)`
                }));

                setIncidents(formattedData);

                setIncidentsTableColumns([
                    {
                        Header: 'Date',
                        accessor: 'date',
                    },
                    {
                        Header: 'Incident Type',
                        accessor: 'type',
                    },
                    {
                        Header: '# affected',
                        accessor: 'affected',
                    }
                ]);
            }
        } catch (err) {
            console.error(err);
        }

        // Set loading state
        setLoaded(true);
    }

    const callback = (key) => {};

    useEffect(() => {
        if(id) {
            fetchJobDetails(id);
        } else {
            setLoaded(true);
        }
    }, [])

    const content = (
    <Loader loaded={loaded}>
        {isClient && !isJobOwner ? <UnauthorizedMessage /> : (
        <>
        {!details ?  <ErrorMessage message={"Job does not exist."} /> :
        <>
        <PageHeader
            title={"Job Details"}
            breadcrumbs={[
                { name: "Home", path: "/dashboard" },
                { name: details.title }
            ]}
        />

        <div className="row">
            <div className="col-12 col-xl-4">
                {/* Project Details */}
                <div className="card">
                    <div className="card-body">
                        <h1 className="font-26 mb-2">
                            {details.title}
                        </h1>
                        <p>{details.client.clientName}</p>
                    </div>

                    <div className="card-body border-top">
                        <p>{details.jobDescription}</p>
                    </div>

                    <div className="card-body border-top">
                        <h3 className="font-16">
                            Status
                        </h3>
                        {
                        details.isComplete ?
                        <span className="badge badge-success">
                            Complete
                        </span> :
                        <span className="badge badge-primary">
                            In Progress
                        </span>
                        }
                    </div>

                    <div className="card-body border-top">
                        <h3 className="font-16">
                            Dates
                        </h3>
                        <time>{DataSanitizer.formatDateString(details.startDate)}</time> to <time>{DataSanitizer.formatDateString(details.endDate)}</time>
                    </div>

                    <div className="card-body border-top">
                        <h3 className="font-16">
                            Location
                        </h3>
                        <address className="mb-0">
                            {details.street}<br />
                            {details.city}, {details.state}
                        </address>
                    </div>

                    <div className="card-body border-top">
                        <h3 className="font-16">
                            Labourers Hired
                        </h3>
                        {details.jobSkill.map((jSkill, i) => 
                            <ul key = {i} className="list-unstyled mb-0">
                                <li>{jSkill.skill.skillName} ({jSkill.numberNeeded})</li>
                            </ul>
                        )}
                    </div>

                    <div className="card-body border-top">
                        <h3 className="font-16">
                            Total Hired
                        </h3>
                        <p>
                            {`${details.totalHired} labourer(s) hired`}
                        </p>
                    </div>
                    
                    { isJobOwner &&
                    <div className="card-body border-top">
                        <Link
                            to={`/editjob/${details.jobId}`}
                            className="btn btn-light"
                        >
                            Edit Job Details
                        </Link>
                    </div>
                    }
                </div>
            </div>

            <div className="col-12 col-xl-8">
                <Tabs
                    defaultActiveKey="1"
                    onChange={callback}
                    renderTabBar={() => <ScrollableInkTabBar />}
                    renderTabContent={() => <TabContent />}
                >
                    {/* Labourer Attendance (Client & Admin Only) */}
                    { (isClient || isAdmin) &&
                    <TabPane tab="Labourer Attendance" key="1">
                    <div className="card">
                        <div className="card-body">
                            <p>
                                Daily ratings are used to track a labourer's attendance, and calculate their average quality rating.
                            </p>
                            { !attendanceDates ?
                            <ErrorMessage message={"No dates to display."} /> :
                            <Table
                                columns={attendanceDatesTableColumns}
                                data={attendanceDates}
                                path={`/job/${id}/attendance`}
                                itemsPerPage={5}
                                searchable={true}
                                {...props}
                            />
                            }
                        </div>
                    </div>
                    </TabPane>
                    }

                    {/* Safety Meetings (Client & Admin Only) */}
                    { (isClient || isAdmin) &&
                    <TabPane tab="Safety Meetings" key="2">
                    <div className="card">
                        <div className="card-body">
                            <p>
                                Safety meetings are required before a labourer can start working at the job site. Please check off the dates where the meetings were completed.
                            </p>
                            {   
                                !details.jobLabourer ?
                                <ErrorMessage message={"No labourers to display."} />
                                :
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        details.jobLabourer.map((jLabourer, i) => i < 5 && (
                                            <tr key={i}>
                                            <td className="p-3">
                                                <CheckSafetyMeeting
                                                    key={i}
                                                    firstname={jLabourer.labourer.labourerFirstName}
                                                    lastname={jLabourer.labourer.labourerLastName}
                                                    safetyMeeting={jLabourer.safetyMeetingCompleted}
                                                    labourerId={jLabourer.labourerId}
                                                    jobId={details.jobId}
                                                    clientId={details.clientId}
                                                />
                                            </td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>
                        <div
                            className="card-header mt-0"
                            style={{borderBottom:'none'}}
                        >
                            <Link
                                to={`${window.location.pathname}/safetymeetings`}
                                className="btn btn-primary btn-sm float-right"
                            >
                                View All Labourers
                            </Link>
                        </div>
                    </div>
                    </TabPane>
                    }

                    {/* Client Rating (Labourer & Admin Only) */}
                    { isLabourer &&
                    <TabPane tab="Rate Client" key="3">
                    <div className="card">
                        <div className="card-body">
                            <p>
                                Please give your client a rating from 1 to 5.
                            </p>
                            { details.jobLabourer.map((jLabourer, i) => (
                                Auth.getID() == jLabourer.labourerId && 
                                <RateClient key={i}
                                    jobId={details.jobId}
                                    labourerId={jLabourer.labourer.labourerId}
                                    rating={jLabourer.clientQualityRating}
                                />
                            ))
                            }
                        </div>
                    </div>
                    </TabPane>
                    }

                    {/* Incident Reports */}
                    <TabPane tab="Incident Reports" key="4">
                    <div className="card">
                        <div className="card-body">
                        { !incidents ?
                        <ErrorMessage message={"No incidents to display."} /> :
                        <Table 
                            data={incidents}
                            columns={incidentsTableColumns}
                            path={"/incident"}
                            itemsPerPage={5}
                            searchable={false}
                            {...props}
                        />
                        }
                        </div>
                    </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>   

        </>
        }
        </>
        )}
    </Loader>
    );

    return <Layout content={content} />;
}

export default JobDetail;