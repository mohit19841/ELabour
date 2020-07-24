import React, { useState, useEffect } from "react";

import * as Auth from "../utils/Auth";
import { isWholeNumber } from '../utils/IsWholeNumber';

import Loader from "./components/Loader";
import Layout from "./components/Layout";
import PageHeader from "./components/PageHeader";
import RateWorkers from "./components/RateWorkers";
import ErrorMessage from "./components/ErrorMessage";

const BASE_URL = "http://localhost:5001/api";

const IncidentDetail = (props) => {

    const [id] = useState(
        props.match.params.id && isWholeNumber(props.match.params.id) ? props.match.params.id : null
    );

    // Component
    const [loaded, setLoaded] = useState(false);

    // Data
    const [report, setReport] = useState();
    const [jobLabourer, setJobLabourer] = useState();

    const fetchIncidentDetails = async (id) => {
        try {
            const response = await fetch(
                BASE_URL + "/incidents/GetIncidentByIncidentId/" + id,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Auth.getToken()}`,
                    },
                }
            );

            if(response.status !== 200) {
                throw response;
            }
            
            const data = await response.json();

            if(data) {
                setReport(data.incidentReport);
                setJobLabourer(data.jobLabourers);
            }
        } catch (e) {
            console.error(e);
        }

        // Set loading state
        setLoaded(true);
    };

    const changeRating = async (newRating, labourerId, jobId) => {
        let token = Auth.getToken();
        if (token == null) {
            Auth.forceLogout();
        }

        try {
            const response = await fetch(
                BASE_URL + "/JobHistory/LabourerSafety",
                {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        JobId: jobId,
                        LabourerId: labourerId,
                        LabourerSafetyRating: newRating,
                    }),
                }
            );
            const data = await response.json();
            if (data) {
                console.log(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const content = (
    <>
    <PageHeader
        title={"Incident Details"}
        breadcrumbs={[
            { name: "Home", path: "/dashboard" },
            { name: "Incidents", path: "/incidents" },
            { name: "Incident Details" },
        ]}
    />

    <Loader loaded={loaded}>
        { !report ? <ErrorMessage message={"Incident does not exist."} /> : (
        <div className="row">
        <div className="col col-md-12">
        <div className="card">
            {/* Incident Details */}
            <div className="card-body">
                <h1 className="font-26 mb-0">
                    {report.job.title}
                </h1>
                <p>{report.job.client.clientName}</p>
                <p>
                    {report.job.street}<br />
                    {report.job.city}, {report.job.client.clientState}
                </p>
            </div>
            <div className="card-body border-top">
                <h3 className="font-16">Date of Incident</h3>
                <time>
                    {report.incidentReportDate.split("T")[0]}
                </time>
            </div>
            <div className="card-body border-top">
                <h3 className="font-16">Incident type</h3>
                <p>{report.incidentType.incidentTypeName}</p>
            </div>
            <div className="card-body border-top">
                <h3 className="font-16">
                    Incident Description
                </h3>
                <p>{report.incidentReportDescription}</p>
            </div>

            {/* Safety Ratings */}
            { (jobLabourer && ( Auth.authenticateClient() || Auth.authenticateAdmin() )) && (
            <div className="card" id="safetyratings">
                <h5 className="card-header">
                    Safety Ratings
                </h5>
                <div className="card-body">
                    <p>
                        Give effected labourers a rating, based on their safety-wise performance on this job.
                    </p>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobLabourer.map((j, i) => (
                                <tr key={i}>
                                    <td>
                                        {`${j.labourer.labourerFirstName} ${j.labourer.labourerLastName}`}
                                    </td>
                                    <td>
                                        <RateWorkers
                                            changeRating={changeRating}
                                            clientId={report.job.clientId}
                                            jobId={report.jobId}
                                            labourerId={j.labourer.labourerId}
                                            rating={j.labourerSafetyRating}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            )}
            <div className="card-body border-top">
                <h3 className="font-16">Incident File</h3>
                <div className="custom-file">
                    <input
                        type="file"
                        className="custom-file-input"
                        id="customFile"
                        style={{cursor:'pointer'}}
                    />
                    <label
                        className="custom-file-label d-flex"
                        htmlFor="customFile"
                    >
                        <i className="material-icons mr-2">publish</i> Choose incident file
                    </label>
                </div>
            </div>
        </div>
        </div>
        </div>
        )}
    </Loader>
    </>
    );

    useEffect(() => {
        if(id) {
            fetchIncidentDetails(id)
        }else {
            setLoaded(true);
        }
    }, []);

    return <Layout content={content} />;
};

export default IncidentDetail;
