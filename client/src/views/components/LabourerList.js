import React, {useState, useEffect} from 'react'
import Select from 'react-select'


const LabourerList = (props) => {
   
   
    const onChangeLabourer = (labourers) => {
        if (labourers) {
            labourers.forEach(labourer => props.setselectedLabourers([...props.selectedLabourers,{ labourerId : labourer.value}]))
        }
    } 

    useEffect(() => {
        props.fetchLabourers(props.selectedJob)
    }, [])

    return (
        <Select
        required
        name="injuredLabourers"
        options={ props.labourerList &&
            props.labourerList.map(l => {return {value: l.labourerId, label: l.labourerFirstName + ' ' + l.labourerLastName}}) 
        } 
        onChange={onChangeLabourer}
        isMulti
        />
    )
}

export default LabourerList;