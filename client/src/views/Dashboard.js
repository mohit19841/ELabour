import React from 'react';

import * as Auth from '../utils/Auth';

import Layout from './components/Layout';
import ClientDashboard from './client/ClientDashboard';
import LabourerDashboard from './labourer/LabourerDashboard';
import AdminDashboard from './admin/AdminDashboard';

const Dashboard = (props) => {

    const role = Auth.getRole();
    const name = Auth.getName();
    const dashboard = (
        role === "Client" ? <ClientDashboard name={name} {...props} /> :
        role === "Labourer" ? <LabourerDashboard name={name} {...props} /> :
        role === "Admin" ? <AdminDashboard name={name} {...props} /> :
        null
    );

    return !dashboard ? Auth.forceLogout() : <Layout content={dashboard} />;
}

export default Dashboard;