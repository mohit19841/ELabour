import React, { useEffect, useState } from 'react';

import * as Auth from '../../utils/Auth';
import * as DataSanitizer from '../../utils/DataSanitizer';
import { isWholeNumber } from '../../utils/IsWholeNumber';

import Loader from '../components/Loader';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import RateWorkers from '../components/RateWorkers';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';
import UnauthorizedMessage from '../components/UnauthorizedMessage';

const BASE_URL = "http://localhost:5001/api";

const ClientLabourerAttendance = (props) => {

    // Authorization
    const [authorized] = useState(
        Auth.authenticateAdmin() || Auth.authenticateClient()
    )

    const [params] = useState({
        id: props.match.params.id && isWholeNumber(props.match.params.id) ? props.match.params.id : null,
        date: props.match.params.date ? props.match.params.date + "T00:00:00" : null
    });

    const [isJobOwner, setIsJobOwner] = useState();

    // Component
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    // Data
    const [title, setTitle] = useState("Job Detail");
    const [list, setList] = useState();
    
    const changeRating = async(newRating, labourerId) => {
        try {
            const URI = BASE_URL + '/LabourerAttendance';
            const response = await fetch(URI, {
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${Auth.getToken()}`
                }, 
                body: JSON.stringify({
                    JobId: props.match.params.id,
                    LabourerId: labourerId,
                    DailyQualityRating: newRating,
                    Date: props.match.params.date + "T00:00:00"
                })
            });

            if(response.status !== 200) {
                setError(<ErrorMessage message={"Error: Could not update rating."} />);
                throw response;
            } else {
                setSuccess(<SuccessMessage message={"Successfully updated rating."} />);
                setTimeout(() => setSuccess(), 2000);
                setError(null);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const getList = async(id, date) => {
        try {
            const URI = BASE_URL + `/LabourerAttendance/data?jobId=${id}&date=${date}`;
            const response = await fetch(URI, {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Auth.getToken()}`
                }
            })

            if(response.status !== 200) {
                throw response;
            }

            let data = await response.json();

            if(data.length) {
                let clientID = data[0].job.clientId;

                if(Auth.authenticateClient() && Auth.getID() == clientID) {
                    setIsJobOwner(true);
                }

                let formattedData = data.map(d => ({
                    name: `${d.labourer.labourerFirstName} ${d.labourer.labourerLastName}`,
                    rating: d.dailyQualityRating,
                    labourerId : d.labourer.labourerId,
                    clientId: d.job.clientId
                }));

                setList(formattedData);
                setTitle(data[0].job.title);
            }
        } catch (e) {
            console.error(e);
        }

        // Set loading state
        setLoaded(true);
    }

    useEffect(() => {
        if(params.id && params.date) {
            getList(params.id, params.date);
        } else {
            setLoaded(true);
        }
    }, [])

    const content = (isJobOwner || Auth.authenticateAdmin()) && (
    <Loader loaded={loaded}>
        { !list ? <ErrorMessage message={"Error: Could not fetch data."} /> :
        <>
        <PageHeader
            title={`Labourer Attendance for ${DataSanitizer.formatDateString(params.date)}`}
            breadcrumbs={[
                { name: "Home", path: "/dashboard" },
                { name: title, path: `/job/${params.id}` },
                { name: "Labourer Attendance" }
            ]}
        />

        {/* Display status messages */}
        { error && error }
        { success && success }

        {/* Labourers Table */}
        <div className="card">
        <div className="card-body">
        { 
            list &&
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Labourer Name</th>
                        <th>Quality Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((l,i) => (
                        <tr key = {i}>
                            <td>{l.name}</td>
                                <td>
                                    <RateWorkers  
                                        changeRating={changeRating} 
                                        rating={l.rating} 
                                        clientId={l.clientId} 
                                        labourerId={l.labourerId} 
                                    />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>   
            </table>
        } 
        </div>
        </div>
        </>
        }
    </Loader>
    );

    return <Layout content={authorized ? content : <UnauthorizedMessage /> } />;
}

export default ClientLabourerAttendance;