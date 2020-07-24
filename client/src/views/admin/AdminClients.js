import React, { useState, useEffect } from 'react';

import * as Auth from '../../utils/Auth';

import Loader from '../components/Loader';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import UnauthorizedMessage from '../components/UnauthorizedMessage';
import ErrorMessage from '../components/ErrorMessage';

const BASE_URL = "http://localhost:5001/api";

const AdminClients = (props) => {

    // Authorization
    const [authorized] = useState(Auth.authenticateAdmin());

    // Component
    const [loaded, setLoaded] = useState(false);

    // Data
    const [clients, setClients] = useState();
    const [clientsTableColumns, setClientsTableColumns] = useState();

    const fetchClients = async() => {
        try {
            const URI = BASE_URL + "/ClientProfile";
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
                    id: d.clientId,
                    name: d.clientName,
                    email: d.clientEmail,
                    phone: d.clientPhoneNumber,
                    location: `${d.clientCity}, ${d.clientState}`
                }));

                setClients(formattedData);
                setClientsTableColumns([
                    {Header: 'Name', accessor: 'name'},
                    {Header: 'Email', accessor: 'email'},
                    {Header: 'Phone', accessor: 'phone'},
                    {Header: 'Location', accessor: 'location'},
                ]);
            }
        } catch(e) {
            console.error(e);
        }

        // Set loading state
        setLoaded(true);
    }

    useEffect(() => {
        if(authorized) fetchClients();
    }, [])

    const content = (
    <>
    <PageHeader
        title={`Manage Clients`}
        breadcrumbs={[
            { name: "Home", path: "/dashboard" },
            { name: "Clients" }
        ]}
    />

    <Loader loaded={loaded}>
    <div className="row">
    <div className="col">
    <div className="card">
        <h4 className="card-header">All Clients</h4>
        <div className="card-body">
        { !clients ? <ErrorMessage message={"No clients to display."} /> :
        <Table
            data={clients}
            columns={clientsTableColumns}
            path="/profile/client"
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

export default AdminClients;