import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import * as Auth from '../../utils/Auth';

const BASE_URL = "http://localhost:5001/api";
const NotificationTabs = (props) => {

    const [incidents, setIncidents] = useState();

    const fetchAllIncidentsNotNotified = async() => {
        try {
            const response = await fetch(BASE_URL + '/Incidents/GetIncidentsNotNotified',  {
                method : 'GET',
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

            if(data) {
                setIncidents(data.reverse());
            }
        } catch (err) {
            console.error(err);
        }
    }
    
    const DirectToDetail = (id) => {
        fetch(BASE_URL + '/Incidents/ChangeAdminNotified/' + id , {
            method : 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ Auth.getToken()}`
            }
        })
        .then(response =>response.json())
        .then(data => console.log(data))
    }

    useEffect(() => {
        fetchAllIncidentsNotNotified();
    }, [])
    
    return (
    <>
    { !incidents ?
    <li>You do not have any new notifications.</li>
    :
    <li className="nav-item dropdown notification">
        <a className="nav-link nav-icons" href="/dashboard" id="navbarDropdownMenuLink1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{marginTop:'5px'}}>
            {incidents.length == 0 ? 
            <>
                <i className="material-icons">notifications</i>
                <span className="ml-2 d-inline-block d-lg-none">New Notifications</span>
            </>:
            <>
                <i className="material-icons">notifications</i><span className="indicator d-none d-lg-block"></span>
                <span className="ml-2 d-inline-block d-lg-none">New Notifications</span>
            </>
            }
         </a>
        <ul className="dropdown-menu dropdown-menu-right notification-dropdown">
        {incidents.length == 0 ? 
        <li>
           <div className="notification-title">No New Notifications</div> 
        </li> :
        <li>
            <div className="notification-title">Notifications</div>
            <div className="notification-list">
            <div className="list-group">
                { incidents.map(( incident, i) => (
                    <Link onClick={() => DirectToDetail(incident.incidentReport.incidentReportId) } 
                       className="list-group-item list-group-item-action"
                       to={`/incident/${incident.incidentReport.incidentReportId}`} key={i}>
                    <div className="notification-info">
                    <div className="notification-list-user-block" style={{paddingLeft:'0px'}}>
                        <span className="notification-list-user-name" style={{marginRight:'0px'}}>{incident.client.clientName}</span> created an Incident Report
                    </div>
                    </div>
                    </Link>
                ))
                }
            </div>
            </div>
        </li>
        }
        </ul>
    </li>
    }
    </>    
    )
}

export default NotificationTabs;