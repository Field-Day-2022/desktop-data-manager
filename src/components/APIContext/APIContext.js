/*
 * File: APIContext.js
 * Version: 1.01 US167
 * Date: 2020-03-01
 * Description: API to handle the user's session data.
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router';

import APIService from '../APIService/APIService';

export const APIContext = React.createContext();

class APIProviderClass extends Component {
    apiService = new APIService();

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.project_id !== this.state.project_id) {
            this.fetchData();
        }
    }

    state = {
        dataForms: [],
        sessionForms: [],
        answerSets: [],
        projects: [],
        project_id: null,
    };

    setProject = (project_id, reload) => {
        const { history } = this.props;
        this.setState({ project_id });
        reload && history.push('/');
    };

    fetchData = async () => {
        const { project_id } = this.state;

        try {
            const projects = await this.apiService.getProjects();
            const allForms = await this.apiService.getDataForms(project_id);
            const answerSets = await this.apiService.getAnswerSets();

            const dataForms = allForms.filter((f) => !f.is_session_form);
            const sessionForms = allForms.filter((f) => f.is_session_form);

            this.setState({ dataForms, sessionForms, answerSets, projects });
        } catch (err) {
            console.error(err);
        }
    };

    addDataForm = (form) => {
        const { dataForms, project_id } = this.state;
        const formExists = dataForms.find((df) => df.form_id === form.form_id);
        if (formExists) {
            return this.apiService.putDataForm(form);
        } else {
            return this.apiService.postDataForm(form, project_id);
        }
    };

    getProjectName = (id) => {
        const proj = this.state.projects.find((p) => {
            return p.project_id === id;
        });
        if (proj) {
            return proj.project_name;
        } else {
            return null;
        }
    };

    getAnswerSet = (setName) => {
        return this.state.answerSets.find((f) => f.set_name === setName);
    };

    addSessionForm = (form) => {
        const { sessionForms, project_id } = this.state;
        const formExists = sessionForms.find((sf) => sf.form_id === form.form_id);
        if (formExists) {
            return this.apiService.putDataForm(form);
        } else {
            return this.apiService.postDataForm(form, project_id);
        }
    };

    addAnswerSet = (set) => {
        const { answerSets } = this.state;
        const setExists = answerSets.find((s) => s.set_name === set.set_name);
        if (setExists) {
            return this.apiService.putAnswerSet(set);
        } else {
            return this.apiService.postAnswerSet(set);
        }
    };

    addEntry = async (entry) => {
        try {
            await this.apiService.postEntry(entry);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    getEntries = async (project_id, form_id, session_id) => {
        try {
            const response = await this.apiService.getEntries(project_id, form_id, session_id);
            return response;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    putEntry = async (entry) => {
        try {
            await this.apiService.putEntry(entry);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    deleteEntry = async (session_id, entry_id) => {
        try {
            await this.apiService.deleteEntry(session_id, entry_id);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    addSession = async (session) => {
        try {
            await this.apiService.postSession(session);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    getSession = async (session_id) => {
        try {
            const response = await this.apiService.getSession(session_id);
            return response;
        } catch (err) {
            return [];
        }
    };

    getSessions = async (project_id, form_id) => {
        try {
            const response = await this.apiService.getSessions(project_id, form_id);
            return response;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    putSession = async (session) => {
        try {
            await this.apiService.putSession(session);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    deleteSession = async (session_id) => {
        try {
            await this.apiService.deleteSession(session_id);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    render() {
        const {
            fetchData,
            addDataForm,
            addSessionForm,
            addAnswerSet,
            setProject,
            addEntry,
            getEntries,
            putEntry,
            deleteEntry,
            addSession,
            getSession,
            getSessions,
            putSession,
            deleteSession,
            getProjectName,
            getAnswerSet,
        } = this;
        const { dataForms, sessionForms, answerSets, projects, project_id } = this.state;
        const { login, moveEntry } = this.apiService;
        return (
            <APIContext.Provider
                value={{
                    dataForms,
                    sessionForms,
                    answerSets,
                    addDataForm,
                    addSessionForm,
                    addAnswerSet,
                    projects,
                    project_id,
                    setProject,
                    fetchData,
                    addEntry,
                    getEntries,
                    putEntry,
                    deleteEntry,
                    addSession,
                    getSession,
                    getSessions,
                    putSession,
                    deleteSession,
                    login,
                    moveEntry,
                    getProjectName,
                    getAnswerSet,
                }}
            >
                {this.props.children}
            </APIContext.Provider>
        );
    }
}

export const APIProvider = withRouter(APIProviderClass);
