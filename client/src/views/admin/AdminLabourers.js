import React, { useState, useEffect } from 'react';

import * as Auth from '../../utils/Auth';

import Loader from '../components/Loader';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import ErrorMessage from '../components/ErrorMessage';
import UnauthorizedMessage from '../components/UnauthorizedMessage';

const BASE_URL = "http://localhost:5001/api";

const AdminLabourers = (props) => {

    // Authorization
    const [authorized] = useState(Auth.authenticateAdmin());

    // Component
    const [loaded, setLoaded] = useState(false);

    // Data
    const [labourers, setLabourers] = useState();
    const [labourersTableColumns, setLabourersTableColumns] = useState();

    const fetchLabourers = async() => {
        try {
            let response = await fetch(BASE_URL + "/LabourerProfile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Auth.getToken()}`
                }
            });

            if(response.status !== 200) {
                throw response;
            }

            let data = await response.json();

            if(data && data.length) {
                let formattedData = data.map(d => ({
                    id: d.labourerId,
                    name: `${d.labourerFirstName} ${d.labourerLastName}`,
                    email: d.labourerEmail,
                    availability: d.isAvailable ? "Yes" : "No"
                }));

                setLabourers(formattedData);
                setLabourersTableColumns([
                    {Header: 'Name', accessor: 'name',},
                    {Header: 'Email', accessor: 'email',},
                    {Header: 'Is Available', accessor: 'availability'}
                ]);
            }
        } catch(e) {
            console.error(e);
        }

        // Set loading state
        setLoaded(true);
    }

    useEffect(() => {
        if(authorized) fetchLabourers();
    }, [])

    const content = (
    <>
    <PageHeader
        title={`Manage Labourers`}
        breadcrumbs={[
            { name: "Home", path: "/dashboard" },
            { name: "Labourers" }
        ]}
    />
    
    <Loader loaded={loaded}>
        <div className="row">
        <div className="col">
        <div className="card">
            <h4 className="card-header">All Labourers</h4>
            <div className="card-body">
            { !labourers ? <ErrorMessage message={"No labourers to display."} /> :
            <Table
                data={labourers}
                columns={labourersTableColumns}
                path="/profile/labourer"
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

export default AdminLabourers;