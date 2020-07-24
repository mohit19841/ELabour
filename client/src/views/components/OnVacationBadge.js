import React, {useState} from 'react'
import Checkbox from 'react-simple-checkbox';
import * as Auth from '../../utils/Auth';

const BASE_URL = "http://localhost:5001/api";

const OnVacationBadge = ({ labourerId, onLeave }) => {

    const [onVacation, setOnVacation] = useState(onLeave);

    const ChangeOnVacation = async(check) => {
        try {
            const URI = BASE_URL + '/LabourerProfile';
            const response = await fetch(URI, {
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${Auth.getToken()}`
                }, 
                body: JSON.stringify({
                    LabourerId: labourerId,
                    OnLeave: check
                })
            });

            if(response.status !== 200) {
                throw response;
            }

            const data = await response.json();

            if(data) {
                setOnVacation(check);
            }

        } catch(e) {
            console.error(e);
        }
    }

    return(
        <>
            <span className="mr-2">
                I do not want to be assigned to any new jobs.
            </span>
            <Checkbox
                size="2"
                tickSize="2" 
                color="#ef172c"
                onChange= {ChangeOnVacation} 
                checked={onVacation}
            />
        </>
    );
}

export default OnVacationBadge;