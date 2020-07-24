import React, { useState, useEffect } from "react";
import {Link, Redirect, Router} from 'react-router-dom';
import * as Auth from '../../utils/Auth';
import PageHeader from "../components/PageHeader";
import Layout from "../components/Layout";
import FormErrors from "../components/FormErrors";
import * as FormValidator from "../../utils/FormValidator";
import UnauthorizedMessage from "../components/UnauthorizedMessage";

const BASE_URL = "http://localhost:5001/api";

const AdminAddSkill = ({history}) => {
    
    // Authorization
    const [authorized] = useState(Auth.authenticateAdmin());
    
    const [formErrors, setFormErrors] = useState([]);
    const [skillName, setSkillName] = useState();
    const [labourerRate, setLabourerRate] = useState();
    const [adminRate, setAdminRate] = useState();

    const onChangeSkill = (e) => {
        setSkillName(e.target.value);
    }

    const onChangeLabourerRate = (e) => {
        setLabourerRate(e.target.value);
        let aRate = Number(e.target.value);
        let rate = aRate.toFixed(2);
        let adRate = (rate * 1.2).toFixed(2);
        setAdminRate(adRate);
    }

    
    const validateForm = (e) => {
        e.preventDefault();
        let errors = [];

        if(!skillName || !FormValidator.name(skillName)){
            errors.push("Invalid skill name.");
        }

        if(!labourerRate || isNaN(Number(labourerRate))){
            errors.push("Please enter labourer rate in numbers.");
        } 

        if(errors.length){
            setFormErrors(errors);
        } else {
            submitForm();
        }
    }

    const submitForm = async() => {
        let token = Auth.getToken();

        let newSkill = {
            SkillName: skillName,
            AdminReceives: adminRate,
            LabourerReceives: labourerRate,
        };

        try{
            let response = await fetch(BASE_URL + "/Skills/PostSkill", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newSkill)
            });

            if (response.status !== 201){
                throw response;
            }

            let data = await response.json();     
            
            if(data){
                history.push('/admin/payrates/');
            }else {
                setFormErrors(["Failed to create skill. Please try again later."]);
            }
        }catch (e){
            console.error(e)
        }
    };
        

    const content = (
        <>
         <PageHeader
                title={"Add Skill"}
                breadcrumbs={[
                    { name: "Home", path: "/dashboard" },
                    { name: "Skills", path: "/admin/payrates" },
                    { name: "Add Skill" },
                ]}
            />

    <div className="card">
    <div className="card-body">
    <form className="admin-add-skill-form">
        <div>
        {formErrors.length > 0 && (
            <FormErrors errors={formErrors} />
        )}
        </div>

        <div className="form-row mb-4">

        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">
            <label htmlFor="skillName">
            New Skill Name
            </label>
            <span className="text-danger">*</span>
            <input
                required
                name="skillName"
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter new skill name"
                onChange={(e) => onChangeSkill(e)}
            />
        </div>

        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">
            <label htmlFor="labourerRate">
                Labourer Rate ($/Hr)
            </label>
            <span className="text-danger">*</span>
            <input
                required
                name="labourerRate"
                className="form-control form-control-lg"
                type="number"
                placeholder="Enter labourer rate"
                onChange={(e) => onChangeLabourerRate(e)}
            />
        </div>

        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">
            <label htmlFor="adminRate">
            Admin Rate ($/Hr)
            </label>
            <input
                disabled
                name="adminRate"
                className="form-control form-control-lg"
                value={adminRate}
            />
        </div>

        </div>

        <div className="col col-lg-12">
            <Link
                to="/admin/payrates"
                className="btn btn-space btn-light btn-lg"
            >
                Cancel
            </Link>
            <button
                onClick={validateForm}
                className="btn btn-space btn-primary btn-lg"
            >
                Create New Skill
            </button>
        </div>
    </form>
    </div>
    </div>
    </>
    );

return !authorized ? <UnauthorizedMessage /> : <Layout content={content} />;
}

export default AdminAddSkill;