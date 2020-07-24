import React, { useState, useEffect } from 'react';
import * as Auth from '../../utils/Auth';
import { isWholeNumber } from '../../utils/IsWholeNumber';
import PageHeader from '../components/PageHeader';
import Loader from '../components/Loader';
import Skill from '../components/Skill';
import Layout from '../components/Layout';
import ErrorMessage from '../components/ErrorMessage';
import UnauthorizedMessage from '../components/UnauthorizedMessage';

const BASE_URL = "http://localhost:5001/api";

const AdminSkillDetails = (props) => {

    // Authorization
    const [authorized] = useState(
        Auth.authenticateAdmin()
    );

    const [id] = useState(
        props.match.params.id && isWholeNumber(props.match.params.id) ? props.match.params.id : null
    );

    //Components
    const [loaded, setLoaded] = useState(false);

    //Data
    const [skill, setSkill] = useState();
 
    const getSkillData = async(id) => {
        try{
            const URI = BASE_URL + `/Skills/GetSkill/${id}`;
            let response = await fetch(URI, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Auth.getToken()}`
                }
            });

            if(response.status !== 200){
                throw response;
            }

            let data = await response.json();

            if(
                data &&
                data.skillName &&
                data.adminReceives &&
                data.labourerReceives
            ) {
                setSkill({
                    name: data.skillName,
                    adminReceives: data.adminReceives,
                    labourerReceives: data.labourerReceives
                });
            }
        } catch(e){
            console.error(e);
        }

        // Set loading state
        setLoaded(true);
    }


    useEffect(() => {
        getSkillData(id)
    }, []);

    const content = (
        <>
        <PageHeader
                title={`Skill Details`}
                breadcrumbs={[
                    { name: "Home", path: "/dashboard" },
                    { name: "Skills", path: Auth.authenticateAdmin() ? "/admin/payrates" : <UnauthorizedMessage/> },
                    { name: "Skill Details" }
                ]}
            />

            <Loader loaded={loaded}>
            { !skill ? <ErrorMessage message={"Skill does not exist."} /> : <Skill data={skill} /> }
            <p></p>
            </Loader>
        </>
    );

    return <Layout content={authorized ? content : <UnauthorizedMessage />} />;
}

export default AdminSkillDetails;