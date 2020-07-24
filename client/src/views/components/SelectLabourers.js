import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const BASE_URL = "http://localhost:5001/api";

const SelectLabourers = ({requiredLabourers, setRequiredLabourers}) => {

    const [skills, setSkills] = useState([])
    const [selectedSkill, setSelectedSkill] = useState();
    const [selectedNumLabourers, setSelectedNumLabourers] = useState('');

    useEffect(() => {
        const fetchSkills = async() => {
            try {
                const URI = BASE_URL + '/Skills/GetAllSkills';
                const response = await fetch(URI);

                if(response.status !== 200) {
                    throw response;
                }

                let data = await response.json();

                if(data.length) {
                    setSkills(data);
                }
            } catch (e) {
                console.error(e);
            }
        }

        fetchSkills();
    }, [])

    const addLabourers = () => {
        if(selectedSkill && selectedNumLabourers > 0) {
            if(requiredLabourers.length && (requiredLabourers.findIndex(i => i.SkillName === selectedSkill)) != -1) {
                let indexOfExistingSkill = requiredLabourers.findIndex(i => i.SkillName === selectedSkill);
                if(indexOfExistingSkill > -1) {
                    let skillUpdated = [...requiredLabourers];
                    skillUpdated[indexOfExistingSkill].NumberNeeded = selectedNumLabourers;
                    setRequiredLabourers(skillUpdated)
                } else {
                    setRequiredLabourers(requiredLabourers => [ ...requiredLabourers, {SkillName: selectedSkill, SkillId: getSkillIdByName(selectedSkill), NumberNeeded : selectedNumLabourers}])
                }            
            } else {
                setRequiredLabourers(requiredLabourers => [ ...requiredLabourers, {SkillName: selectedSkill, SkillId: getSkillIdByName(selectedSkill), NumberNeeded : selectedNumLabourers}])
            }
            setSelectedNumLabourers('');
        }

    }

    const deleteLabourers = (index) => {
        if(requiredLabourers.length <= 1) {
            setRequiredLabourers([]);
        } else {
            let updated = requiredLabourers.filter((worker, i) => i !== index);
            setRequiredLabourers(updated);
        }
    }

    const getSkillIdByName = (name) => {
        let id = null;
        skills.forEach((i) => {
            if(name === i.skillName) {
                id = i.skillId;
                return;
            }
        })
        return id;
    }

    const preventSubmit = e => {
        if(e.keyCode || e.which === 13) e.preventDefault();
    }

    return (
    <div className="form-group">
        <label htmlFor="labourers">Select labourers <span className="text-danger">*</span></label>
            
        { requiredLabourers.length ?
        <div className="row m-2">
        <table className="table col col-md-6 select-workers-widget">
        <tbody>
        {requiredLabourers.map((item, i) => (
            <tr key={i}>
                <td>{item.SkillName}</td>
                <td>{item.NumberNeeded} required</td>
                <td><span onClick={() => deleteLabourers(i)} className="p-2 badge badge-danger" style={{cursor:'pointer'}}>Remove</span></td>
            </tr>
        ))}
        </tbody>
        </table>
        </div>
        : <p className="pt-1 font-12 text-secondary">No labourers added yet.</p>}

        <div className="form-row">
            <div className="col col-md-5 col-lg-4 col-xl-4">
            <Select
                options={
                    skills.map((skill, i) => {
                    return { value: skill.skillId, label: skill.skillName } 
                    }) 
                } 
                onChange={e => setSelectedSkill(e.label)}
            />
            </div>
            <div className="col col-md-5 col-lg-3 col-xl-2">
            <input
                value={selectedNumLabourers}
                onKeyPress={e => preventSubmit(e)}
                onChange={e => setSelectedNumLabourers(e.target.value)}
                type="number"
                min="0"
                max="999"
                name="labourersrequired"
                placeholder="# required"
                className="form-control form-control-lg"
            />
            </div>
            <div className="col col-md-2 col-lg-1">
            <span
                onClick={addLabourers}
                className="btn btn-light btn-lg"
            >
                Add
            </span>
            </div>
        </div>
    </div>
    )
}

export default SelectLabourers;
