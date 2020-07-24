import React, { useEffect, useState } from 'react';

import ErrorMessage from './ErrorMessage';

const Skill = ({data}) => {

    const [skillData, setSkillData] = useState({
        name:"",
        adminReceives:"",
        labourerReceives:""
    });

    const { name, adminReceives, labourerReceives} = skillData

    useEffect(() => {
        if(data){
            setSkillData(data);
            console.log(data)
        }
    }, []);

    return !skillData ? <ErrorMessage message={"Skill does not exist."} /> : (
        <div className="row">
        <div className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="card">
        <div className="card-header p-4">
            <div>
                <p className="mb-0">Skill Name:</p>
                <h3 className="mb-0">{name}</h3>
               </div>
        </div>
        <div className="card-body">
            <div className="row">
            <div className="col-sm-6">
                <p className="mb-0">Admin Recieves:</p>
                <h3 className="mb-0">${adminReceives}/hr</h3>
            </div>   
            <div className="col-sm-6">
                <p className="mb-0">Labourer Recieves:</p>
                <h3 className="mb-0">${labourerReceives}/hr</h3>
            </div>             
            </div>
        </div>
        </div>            
        </div>  
        </div>
    );   
}

export default Skill;