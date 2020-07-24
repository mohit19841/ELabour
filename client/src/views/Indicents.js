import React , {useState, useEffect} from 'react';
import { Link, Redirect } from 'react-router-dom';

import * as Auth from '../utils/Auth';
import * as DataSanitizer from '../utils/DataSanitizer';

import Layout from './components/Layout';
import PageHeader from './components/PageHeader';
import Table from './components/Table';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

const BASE_URL = "http://localhost:5001/api";

const Incidents = (props) => {

    // Authorization
    const [authorized] = useState(
        Auth.authenticateClient() || Auth.authenticateLabourer()
    );

    // Component
    const [loaded, setLoaded] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Data
    const [incidents, setIncidents] = useState();
    const [incidentsTableColumns, setIncidentsTableColumns] = useState();

    const fetchIncidents = async(id) => {
        try {
            // URI for either Client or Labourer role
            const URI = `${BASE_URL}/Incidents/GetIncidentsBy${Auth.getRole()}Id/${id}`;

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
                    id: d.incidentReportId,
                    date: DataSanitizer.formatDateString(d.incidentReportDate),
                    job: d.jobTitle,
                    type: d.incidentType
                }));

                setIncidentsTableColumns([
                    {Header: 'Date', accessor: 'date'},
                    {Header: 'Incident Type', accessor: 'type'},
                    {Header: 'Job Title', accessor: 'job'},
                ]);

                setIncidents(formattedData.reverse());
            }
        } catch (e) {
            console.error(e);
        }

        // Set loading state
        setLoaded(true);
    }

    const content = !authorized ? <Redirect to="/dashboard" /> : (
    <>
    <PageHeader
        title={"Incidents"}
        breadcrumbs={[
            { name: "Home", path: "/dashboard" },
            { name: "Incidents" }
        ]}
    />

    <div className="row">
    <div className="col">
    <div className="card">
        <div className="card-header d-flex">
            <h4 className="card-header-title">Incidents</h4>
            { isClient &&
            <div className="toolbar ml-auto">
                <Link
                    to="/addincident"
                    className="btn btn-primary btn-sm"
                >
                    Add New
                </Link>
            </div>
            }
        </div>
        <div className="card-body">
            <Loader loaded={loaded}>
                { !incidents ? <ErrorMessage message={"No incidents to display."} /> :
                <Table
                    data={incidents}
                    columns={incidentsTableColumns}
                    path="/incident"
                    searchable={true}
                    {...props}
                />
                }
            </Loader>
        </div>
    </div>
    </div>
    </div>
    </>
    );

    useEffect(() => {
        if(authorized) {
            fetchIncidents(Auth.getID());
            setIsClient(Auth.authenticateClient());
        }
    }, [])

    return !authorized ? <Redirect to="/dashboard" /> : <Layout content={content} />;
}

export default Incidents;