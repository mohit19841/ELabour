import React, { useState } from 'react'
import Ratings from 'react-ratings-declarative';

import * as Auth from '../../utils/Auth';

const RateWorkers = (props) => {

    const [rating, setRating] = useState(props.rating);

    const changeRating = async(newRating) => {
        props.changeRating(newRating, props.labourerId, props.jobId);
        setRating(newRating);
    }
    
    return (
        <Ratings
            rating= {rating}
            widgetDimensions="14px"
            name="rating"
            changeRating = { 
                Auth.authenticateAdmin() || props.clientId == Auth.getID() ?
                changeRating : null
            }
        >
            <Ratings.Widget widgetHoverColor="#6d7a82"/>
            <Ratings.Widget widgetHoverColor="#6d7a82"/>
            <Ratings.Widget widgetHoverColor="#6d7a82"/>
            <Ratings.Widget widgetHoverColor="#6d7a82"/>
            <Ratings.Widget widgetHoverColor="#6d7a82"/> 
        </Ratings>
    )
}

export default RateWorkers;