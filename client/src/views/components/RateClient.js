import React, { useState } from 'react'
import Ratings from 'react-ratings-declarative';
import * as Auth from '../../utils/Auth';

const BASE_URL = "http://localhost:5001/api";
const RateClient = (props) => {
    const [rating, setRating] = useState(props.rating)
   
    const changeRating = async (newRating) => {
        let token = Auth.getToken();
        if (token == null) {
            Auth.forceLogout();
        }

        try {
            const response = await fetch(
                BASE_URL + "/JobHistory/ClientQuality",
                {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        JobId: props.jobId,
                        LabourerId: props.labourerId,
                        ClientQualityRating: newRating,
                    }),
                }
            );
            const data = await response.json();
            if (data) {
                setRating(newRating)
            }
        } catch (err) {
            console.error(err);
        }
    };

    
    return (
        <Ratings
            rating= {rating}
            widgetDimensions="14px"
            name = "rating"
            changeRating = { changeRating }
        >
            <Ratings.Widget widgetHoverColor="#6d7a82"/>
            <Ratings.Widget widgetHoverColor="#6d7a82"/>
            <Ratings.Widget widgetHoverColor="#6d7a82"/>
            <Ratings.Widget widgetHoverColor="#6d7a82"/>
            <Ratings.Widget widgetHoverColor="#6d7a82"/> 
        </Ratings>
    )

}

export default RateClient;