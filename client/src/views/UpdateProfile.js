import React from 'react';
import { Redirect } from 'react-router-dom';

import * as Auth from '../utils/Auth';

import Layout from './components/Layout';
import ClientUpdateProfile from './client/ClientUpdateProfile';
import LabourerUpdateProfile from './labourer/LabourerUpdateProfile';

const UpdateProfile = (props) => {

    const role = Auth.getRole();
    const view = (
        role === "Client" ? <ClientUpdateProfile {...props} /> :
        role === "Labourer" ? <LabourerUpdateProfile {...props} /> :
        null
    );

    return !view ? <Redirect to="/dashboard" /> : <Layout content={view} />;
}

export default UpdateProfile;