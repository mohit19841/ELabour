import React, { useState, useEffect } from 'react';

import * as Auth from '../utils/Auth';
import * as DataSanitizer from '../utils/DataSanitizer';
import { isValidDate } from '../utils/ValidateDate';
import { isWholeNumber } from '../utils/IsWholeNumber';

import Loader from './components/Loader';
import Layout from './components/Layout';
import PageHeader from './components/PageHeader';
import Table from './components/Table';
import ErrorMessage from './components/ErrorMessage';
import UnauthorizedMessage from './components/UnauthorizedMessage';

const BASE_URL = "http://localhost:5001/api";

const PayrollDetail = (props) => {

    // Authorization
    const [authorized, setAuthorized] = useState(
        Auth.authenticateAdmin() || Auth.authenticateClient()
    );

    const [params] = useState(props.match.params && {
        JobId: props.match.params.id && isWholeNumber(props.match.params.id) ? props.match.params.id : null,
        StartDay: isValidDate(props.match.params.startdate) ? props.match.params.startdate : null,
        EndDay: isValidDate(props.match.params.enddate) ? props.match.params.enddate : null
    });

    // Component
    const [loaded, setLoaded] = useState(false);

    // Data
    const [job, setJob] = useState();
    const [labourers, setLabourers] = useState();
    const [payrollTableColumns, setPayrollTableColumns] = useState();


    const fetchReport = async() => {
      
        // Fetch job data
        try {
            const URI = BASE_URL + `/Job/GetJob/${params.JobId}`;
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
            console.log(data)

            if(data) {
               let formattedData = {
                    title: data.title,
                    startdate: DataSanitizer.formatDateString(data.startDate),
                    enddate: DataSanitizer.formatDateString(data.endDate),
                }
                setJob(formattedData)
            }
        } catch(e) {
            console.error(e)
        }

        // Fetch labourer data
        try {
            const URI = BASE_URL + `/ClientInvoice`;
            let response = await fetch(URI, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify(params)
            });

            if(response.status !== 200) {
                throw response;
            }

            let data = await response.json();

            if(data.length) {
                let formattedData = data.map(d => ({
                    id: d.labourer.labourerId,
                    name: d.labourer.labourerFirstName + " " +d.labourer.labourerLastName,
                    skill: d.skill.skillName,
                    days: d.workedDays,
                    hours: d.totalHours
                }));

                setPayrollTableColumns([
                    {Header: 'Name', accessor: 'name'},
                    {Header: 'Skill', accessor: 'skill'},
                    {Header: '# Days', accessor: 'days'},
                    {Header: '# Hours', accessor: 'hours'},
                ]);

                 setLabourers(formattedData)                  
            }
        } catch(e) {
            console.error(e)
        }
        
        // Set loading state
        setLoaded(true);
    }

    const content = (
        <>
        <PageHeader
            title={`Payroll Details`}
            breadcrumbs={[
                { name: "Home", path: "/dashboard" },
                { 
                    name: "Payroll",
                    path: "/admin/payrolls"
                },
                { name: "Payroll Details" }
            ]}
        />

        <div className="row">
            <div className="col">
            <div className="card">
                {job && 
                <div className="card-header">
                    <h4 className="card-header-title">{job.title}</h4>
                    <h6 className="card-header-title">{job.startdate} - {job.enddate}</h6>
                </div>
                }
                <div className="card-body">
                    <Loader loaded={loaded}>
                    { !labourers ? <ErrorMessage message={"No labourers to display."} /> :
                    <Table
                        data={labourers}
                        columns={payrollTableColumns}
                        path="/profile/labourer"
                        searchable={true}
                        striped={true}
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
        fetchReport()
    }, [])

    return <Layout content={!authorized ? <UnauthorizedMessage /> : content} />;
}

export default PayrollDetail;