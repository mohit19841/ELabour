import React, { useState, useEffect } from 'react';

import * as Auth from '../utils/Auth';
import { isWholeNumber } from '../utils/IsWholeNumber';

import Loader from './components/Loader';
import Layout from './components/Layout';
import PageHeader from './components/PageHeader';
import CheckSafetyMeeting from './components/CheckSafetyMeeting';
import ErrorMessage from './components/ErrorMessage';
import UnauthorizedMessage from './components/UnauthorizedMessage';

const BASE_URL = "http://localhost:5001/api";

const SafetyMeetingsDetail = (props) => {

    // Authorization
    const [id] = useState(
        props.match.params.id && isWholeNumber(props.match.params.id) ? props.match.params.id : null
    );

    const [authorized, setAuthorized] = useState(
        Auth.authenticateAdmin() || Auth.authenticateClient()
    );

    // Component
    const [loaded, setLoaded] = useState(false);

    // Data
    const [details, setDetails] = useState("");
    const [list, setList] = useState();

    const fetchLabourersList = async() => {
        try {
            const URI = `${BASE_URL}/job/getJob/${id}`;
            let response = await fetch(URI, {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ Auth.getToken()}`
                }
            });

            let data = await response.json();

            if(response.status !== 200) {
                throw response;
            }

            if(data && data.jobLabourer.length) {
                setDetails(data);
                setList(data.jobLabourer);
            }
        } catch (err) {
            console.error(err);
        }

        // Set loading state
        setLoaded(true);
    }

    useEffect(() => {
        fetchLabourersList();
    }, [])

    const content = (
        <Loader loaded={loaded}>
            { !details ? <ErrorMessage message="Job does not exist." /> :
            <>
            <PageHeader
                title={`${details.title}: Safety Meetings`}
                breadcrumbs={[
                    { name: "Home", path: "/dashboard" },
                    { name: details.title, path: `/job/${details.jobId}`},
                    { name: "Safety Meetings" }
                ]}
            />

            {/* Labourers Table */}
            { !list ? <ErrorMessage message={"No labourers to display."} /> :
            <div className="card">
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Labour Type</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                details.jobLabourer.map((jLabourer, i) => (
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
                                        <td>
                                            {jLabourer.skill.skillName}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>                    
                </div>
            </div>
            }
            </>
            }
        </Loader>
    );

    return <Layout content={authorized ? content : <UnauthorizedMessage />} />
}

export default SafetyMeetingsDetail;
