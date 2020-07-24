import React, { useState, useEffect } from 'react';

import * as Auth from '../utils/Auth';
import { isValidDate } from '../utils/ValidateDate';
import { isWholeNumber } from '../utils/IsWholeNumber';

import Loader from './components/Loader';
import Layout from './components/Layout';
import PageHeader from './components/PageHeader';
import Invoice from './components/Invoice';
import ErrorMessage from './components/ErrorMessage';
import UnauthorizedMessage from './components/UnauthorizedMessage';

const BASE_URL = "http://localhost:5001/api";

const InvoiceDetails = (props) => {

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
    const [invoice, setInvoice] = useState();

    const getDuration = (s, e) => {
        let start = new Date(s);
        let end = new Date(e);
        if(start.getTime() === end.getTime()) {
            return 1;
        }
        const day = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((start - end) / day));
    }

    const fetchInvoice = async() => {
        let generatedInvoice;

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

            if(data) {
                generatedInvoice = {
                    job: data.title,
                    complete: data.isComplete,
                    duration: getDuration(data.startDate, data.endDate),
                    isComplete: data.isComplete,
                    client: {
                        name: data.client.clientName,
                        address: `${data.client.clientCity}, ${data.client.clientState}`,
                        phone: data.client.clientPhoneNumber
                    }
                }
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
                let labourers = [];

                data.forEach(l => {
                    let skill = l.skill.skillName;
                    if(labourers.some(e => e.type === skill)) {
                        let index = labourers.map(e => e.type).indexOf(skill);
                        let newQuantity = labourers[index].quantity + 1;
                        labourers[index] = {
                            ...labourers[index],
                            quantity: newQuantity
                        }
                    } else {
                        labourers.push({
                            type: skill,
                            quantity: 1,
                            rate: l.skill.labourerReceives
                        });
                    }
                });

                generatedInvoice = {
                    ...generatedInvoice,
                    labourers: labourers
                }
            }
        } catch(e) {
            console.error(e)
        }
        
        // Set invoice
        if(generatedInvoice && generatedInvoice.labourers) {
            setInvoice(generatedInvoice);
        }

        // Set loading state
        setLoaded(true);
    }

    const checkInvoiceBelongsToOwner = async(id) => {
        try {
            const URI = BASE_URL + `/Job/GetClientIDByJobID/${id}`;
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
            
            if(data.length && data[0].toString() !== Auth.getID()) {
                setAuthorized(false);
            }
        } catch(e) {
            console.error(e)
        }
    }

    const content = (
    <Loader loaded={loaded}>
        <PageHeader
            title={`Invoice Details`}
            breadcrumbs={[
                { name: "Home", path: "/dashboard" },
                { 
                    name: "Invoices",
                    path: Auth.authenticateAdmin()
                        ? "/admin/invoices"
                        : "/invoices"
                },
                { name: "Invoice Details" }
            ]}
        />

        {invoice ? <Invoice data={invoice} /> : <ErrorMessage message={"Invoice does not exist."} />}
    </Loader>
    );

    useEffect(() => {
        if(params) {
            if(Auth.authenticateClient()) {
                checkInvoiceBelongsToOwner(params.JobId);
            }
            fetchInvoice();
        }
    }, [])

    return <Layout content={!authorized ? <UnauthorizedMessage /> : content} />;
}

export default InvoiceDetails;