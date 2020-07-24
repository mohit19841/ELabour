import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Checkbox from 'react-simple-checkbox';

import * as Auth from '../../utils/Auth';

const BASE_URL = "http://localhost:5001/api";

const CheckSafetyMeeting = (props) => {

    const [completed, setCompleted] = useState(props.safetyMeeting)

    const changeSafetyMeetingCompleted = async(check) => {
        try {
            const URI = BASE_URL + '/JobLabourers';
            const response = await fetch(URI, {
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${Auth.getToken()}`
                }, 
                body: JSON.stringify({
                    JobId: props.jobId,
                    LabourerId: props.labourerId,
                    SafetyMeetingCompleted: check
                })
            });

            if(response.status !== 200) {
                throw response;
            }

            const data = await response.json();

            if(data) {
                setCompleted(check);
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <Checkbox
                size="3"
                tickSize="2"
                color="#28a745"
                onChange={changeSafetyMeetingCompleted} 
                checked={completed}
            />
            { Auth.authenticateAdmin() ?
            <Link
                to={`/profile/labourer/${props.labourerId}`}
                className="ml-3"
            >
                {`${props.firstname} ${props.lastname}`}
            </Link>
            :
            <span className="ml-3">
                {`${props.firstname} ${props.lastname}`}
            </span>
            }
            
        </>
    );
}

export default CheckSafetyMeeting;