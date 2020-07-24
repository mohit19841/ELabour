import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";

import * as Auth from "./utils/Auth";

import Home from "./views/Home";
import Login from "./views/Login";
import RegisterStart from "./views/RegisterStart";
import PageNotFound from "./views/PageNotFound";

import Dashboard from "./views/Dashboard";
import Incidents from "./views/Indicents";
import JobDetail from "./views/JobDetail";
import SafetyMeetingsDetail from './views/SafetyMeetingsDetail';
import IncidentDetail from "./views/IncidentDetail";
import InvoiceDetail from "./views/InvoiceDetail";
import PayrollDetail from "./views/PayrollDetail";
import UpdateProfile from "./views/UpdateProfile";

import ClientRegister from "./views/client/ClientRegister";
import ClientProfile from "./views/client/ClientProfile";
import ClientAddJob from "./views/client/ClientAddJob";
import ClientUpdateJobDetails from "./views/client/ClientUpdateJobDetails";
import ClientLabourerAttendance from "./views/client/ClientLabourerAttendance";
import ClientInvoices from "./views/client/ClientInvoices";
import ClientAddIncident from "./views/client/ClientAddIncident";

import LabourerRegister from "./views/labourer/LabourerRegister";
import LabourerProfile from "./views/labourer/LabourerProfile";

import AdminJobs from "./views/admin/AdminJobs";
import AdminClients from "./views/admin/AdminClients";
import AdminLabourers from "./views/admin/AdminLabourers";
import AdminIncidents from "./views/admin/AdminIncidents";
import AdminInvoices from "./views/admin/AdminInvoices";
import AdminPayroll from "./views/admin/AdminPayroll";
import AdminPayrates from "./views/admin/AdminPayrates";
import AdminSkillDetails from "./views/admin/AdminSkillDetails";
import AdminNewSkill from "./views/admin/AdminNewSkill";


const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
	return (
		<Route
			path={path}
			{...rest}
			render={(props) => {
				if(Auth.authenticateUser()) {
					if(Auth.validateToken()) {
						return <Comp {...props} />;
					} else {
						localStorage.clear();
						alert("Your session has expired. Please login again.");
						return <Redirect to={{ pathname: "/login" }} />;
					}
				} else {
					return <Redirect to={{ pathname: "/login" }} />;
				}
			}}
		/>
	);
};

class App extends Component {
	render() {
	return (
	<>
	<Router>
	<Switch>
		{/* Public Views */}
		<Route exact path="/" render={(props) => <Home {...props} />} />
		<Route exact path='/login' render={props => <Login {...props} />} />
		<Route exact path='/register' render={props => <RegisterStart {...props} />} />
		<Route exact path='/register/client' render={props => <ClientRegister {...props} />} />
        <Route exact path='/register/labourer' render={props => <LabourerRegister {...props} />} />

		{/* Private Views */}
		<ProtectedRoute exact path='/dashboard' component={Dashboard} />
        <ProtectedRoute exact path='/incidents' component={Incidents} />
        <ProtectedRoute exact path='/job/:id' component={JobDetail} />
		<ProtectedRoute exact path='/job/:id/safetymeetings' component={SafetyMeetingsDetail} />
        <ProtectedRoute exact path='/incident/:id' component={IncidentDetail} />
		<ProtectedRoute exact path='/profile/edit' component={UpdateProfile} />
		<ProtectedRoute exact path='/invoice/:id/:startdate/:enddate' component={InvoiceDetail} />
		<ProtectedRoute exact path='/payroll/:id/:startdate/:enddate' component={PayrollDetail} />


		{/* Client Only Views */}
		<ProtectedRoute exact path='/profile/client/:id' component={ClientProfile} />
        <ProtectedRoute exact path='/addjob' component={ClientAddJob} />
		<ProtectedRoute exact path='/editjob/:id' component={ClientUpdateJobDetails} />
		<ProtectedRoute exact path='/job/:id/attendance/:date' act component={ClientLabourerAttendance} />
        <ProtectedRoute exact path='/addincident' component={ClientAddIncident} />
		<ProtectedRoute exact path='/invoices' component={ClientInvoices} />

		{/* Labourer Views */}
		<ProtectedRoute exact path='/profile/labourer/:id' component={LabourerProfile} />

		{/* Admin Views */}
		<ProtectedRoute exact path='/admin/jobs' component={AdminJobs} />
		<ProtectedRoute exact path='/admin/clients' component={AdminClients} />
		<ProtectedRoute exact path='/admin/labourers' component={AdminLabourers} />
		<ProtectedRoute exact path='/admin/incidents' component={AdminIncidents} />
		<ProtectedRoute exact path='/admin/invoices' component={AdminInvoices} />
		<ProtectedRoute exact path='/admin/payrolls' component={AdminPayroll} />
		<ProtectedRoute exact path='/admin/payrates' component={AdminPayrates} />
		<ProtectedRoute exact path='/admin/skill/:id' component={AdminSkillDetails} />
		<ProtectedRoute exact path='/admin/addskill' component={AdminNewSkill} />


		<Route component={PageNotFound} />
	</Switch>
	</Router>
	</>
	);
	}
}

export default App;
