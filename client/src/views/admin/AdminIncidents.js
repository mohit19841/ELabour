import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import * as Auth from '../../utils/Auth';
import * as DataSanitizer from '../../utils/DataSanitizer';

import Loader from '../components/Loader';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import ErrorMessage from '../components/ErrorMessage';
import UnauthorizedMessage from '../components/UnauthorizedMessage';

const BASE_URL = "http://localhost:5001/api";

const AdminIncidents = (props) => {

    // Authorization
    const [authorized] = useState(Auth.authenticateAdmin());

    // Component
    const [loaded, setLoaded] = useState(false);

    // Data
    const [incidents, setIncidents] = useState();
    const [incidentsTableColumns, setIncidentsTableColumns] = useState();

    const fetchIncidents = async() => {
        try {
            let response = await fetch(BASE_URL + "/Incidents/GetAllIncidents", {
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
                    id: d.incidentReportId,
                    job: d.job.title,
                    date: DataSanitizer.formatDateString(d.incidentReportDate),
                    type: d.incidentType.incidentTypeName,
                    affected: `${d.labourerIncidentReport.length} labourer(s)`
                }));

                setIncidentsTableColumns([
                    {Header: 'Date', accessor: 'date'},
                    {Header: 'Job Title', accessor: 'job'},
                    {Header: 'Incident Type', accessor: 'type'},
                    {Header: '# affected', accessor: 'affected'},
                ]);

                setIncidents(formattedData);
            }
        } catch(e) {
            console.error(e);
        }

        // Set loading state
        setLoaded(true);
    }

    useEffect(() => {
        if(authorized) fetchIncidents();
    }, [])

    const content = (
    <>
    <PageHeader
        title={"Manage Incidents"}
        breadcrumbs={[
            { name: "Home", path: "/dashboard" },
            { name: "Incidents" }
        ]}
    />

    <Loader loaded={loaded}>
        <div className="row">
        <div className="col">
        <div className="card">
            <h4 className="card-header">Incidents</h4>
            <div className="card-body">
                { !incidents ? <ErrorMessage message={"No incidents to display."} /> :
                <Table
                    data={incidents}
                    columns={incidentsTableColumns}
                    path="/incident"
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
    );

    return <Layout content={authorized ? content : <UnauthorizedMessage />} />;
}

export default AdminIncidents;