import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Auth from '../../utils/Auth';

import Loader from '../components/Loader';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import ErrorMessage from '../components/ErrorMessage';
import UnauthorizedMessage from '../components/UnauthorizedMessage';

const BASE_URL = "http://localhost:5001/api";

const AdminPayrates = (props) => {

    // Authorization
    const [authorized] = useState(Auth.authenticateAdmin());

    // Component
    const [loaded, setLoaded] = useState(false);

    // Data
    const [skills, setSkills] = useState();
    const [skillsTableColumns, setSkillsTableColumns] = useState();

    const fetchSkills = async() => {
        try {
            const URI = BASE_URL + "/Skills/GetAllSkills";
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

            if(data && data.length) {
                let formattedData = data.map(d => {
                    let rate = (Math.floor(Math.random() * 10) + 20).toFixed(2);
                    let adminRate = (rate * 1.2).toFixed(2);
                    return {
                        id: d.skillId,
                        name: d.skillName,
                        labourerReceives: `$${rate}/hr`,
                        adminReceives: `$${adminRate}/hr`
                    }
                });

                setSkills(formattedData);
                setSkillsTableColumns([
                    {Header: 'Name', accessor: 'name',},
                    {Header: 'Labourer Receives', accessor: 'labourerReceives',},
                    {Header: 'Admin Receives (20% cut)', accessor: 'adminReceives'}
                ]);
            }
        } catch(e) {
            console.error(e);
        }

        // Set loading state
        setLoaded(true);
    }

    useEffect(() => {
        if(authorized) {
            fetchSkills();
        } else {
            setLoaded(true);
        }
    }, [])

    const content = (
    <>
    <PageHeader
        title={`Manage Skill Payrates`}
        breadcrumbs={[
            { name: "Home", path: "/dashboard" },
            { name: "Skill Payrates" }
        ]}
    />
    
    <Loader loaded={loaded}>
        <div className="row">
        <div className="col">
        <div className="card">
            <div className="card-header d-flex">
                <h4 className="card-header-title">All Skills</h4>
                <div className="toolbar ml-auto">
                    <Link 
                        to="/admin/addskill"
                        className="btn btn-primary btn-sm"
                    >
                        Add New Skill
                    </Link>
                </div>
            </div>
            <div className="card-body">
                { !skills ? <ErrorMessage message={"No payrates to display."} /> :
                <Table
                    data={skills}
                    columns={skillsTableColumns}
                    itemsPerPage={10}
                    path="/admin/skill"
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

export default AdminPayrates;