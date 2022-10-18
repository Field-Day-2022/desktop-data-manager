/*
 * File: APIService.js
 * Version: 1.01 US167
 * Date: 2020-03-01
 * Description: Takes session data and/or user's data and is an API to handle the API service.
 */
import axios from 'axios';

const dotenv = require('dotenv');
dotenv.config();

const SERVER_ADDRESS_KEY = process.env.REACT_APP_DB_SERVER_ADDRESS;
export default class APIService {
    BASE_URL =
        process.env.REACT_APP_DB_SERVER_ADDRESS !== undefined
            ? SERVER_ADDRESS_KEY
            : 'http://localhost:3000';

    getJwtConfig = () => {
        return {
            headers: {
                authorization: 'Bearer ' + sessionStorage.getItem('jwtToken'),
            },
        };
    };

    // DataForm

    getDataForms = async (project_id) => {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/data_form${project_id ? `?project_id=${project_id}` : ''}`
            );

            return response.data;
        } catch (err) {
            console.error(err);
        }
    };

    getDataForm = async (form_id) => {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/data_form/${form_id}`,
                this.getJwtConfig()
            );

            return response.data;
        } catch (err) {
            console.error(err);
        }
    };

    postDataForm = async (form, project_id) => {
        form['project_id'] = project_id;
        try {
            await axios({
                method: 'post',
                url: `${this.BASE_URL}/data_form`,
                headers: {},
                data: form,
            });
        } catch (err) {
            console.error(err);
        }
    };

    putDataForm = async (form) => {
        try {
            await axios.put(
                `${this.BASE_URL}/data_form/${form.form_id}`,
                form,
                this.getJwtConfig()
            );
        } catch (err) {
            console.error(err);
        }
    };

    deleteDataForm = async (form_id) => {
        try {
            await axios.delete(`${this.BASE_URL}/data_form/${form_id}`, this.getJwtConfig());
        } catch (err) {
            console.error(err);
        }
    };

    // AnswerSet

    getAnswerSets = async () => {
        try {
            const response = await axios.get(`${this.BASE_URL}/answer_set`);

            return response.data;
        } catch (err) {
            console.error(err);
        }
    };

    getAnswerSet = async (set_name) => {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/answer_set/${set_name}`,
                this.getJwtConfig()
            );

            return response.data;
        } catch (err) {
            console.error(err);
        }
    };

    postAnswerSet = async (set) => {
        try {
            await axios.post(`${this.BASE_URL}/answer_set`, set, this.getJwtConfig());
        } catch (err) {
            console.error(err);
        }
    };

    putAnswerSet = async (set) => {
        try {
            await axios.put(
                `${this.BASE_URL}/answer_set/${set.set_name}`,
                set,
                this.getJwtConfig()
            );
        } catch (err) {
            console.error(err);
        }
    };

    deleteAnswerSet = async (set_name) => {
        try {
            await axios.delete(`${this.BASE_URL}/answer_set/${set_name}`, this.getJwtConfig());
        } catch (err) {
            console.error(err);
        }
    };

    // Project

    getProjects = async () => {
        try {
            const response = await axios.get(`${this.BASE_URL}/project`);

            return response.data;
        } catch (err) {
            console.error(err);
        }
    };

    getProjectNames = async () => {
        try {
            const response = await axios.get(`${this.BASE_URL}/project/name`);

            return response.data;
        } catch (err) {
            console.error(err);
        }
    };

    getProject = async (project_id) => {
        try {
            const response = await axios.get(`${this.BASE_URL}/project/${project_id}`);

            return response.data;
        } catch (err) {
            console.error(err);
        }
    };

    postProject = async (project) => {
        try {
            await axios.post(`${this.BASE_URL}/project`, project, this.getJwtConfig());
        } catch (err) {
            console.error(err);
        }
    };

    putProject = async (project) => {
        try {
            await axios.put(
                `${this.BASE_URL}/project/${project.project_id}`,
                project,
                this.getJwtConfig()
            );
        } catch (err) {
            console.error(err);
        }
    };

    deleteProject = async (project_id) => {
        try {
            await axios.delete(`${this.BASE_URL}/project/${project_id}`, this.getJwtConfig());
        } catch (err) {
            console.error(err);
        }
    };

    // DataEntry

    getEntries = async (project_id, form_id, session_id) => {
        var data = {};

        if (project_id || form_id || session_id) {
            data['project_id'] = project_id;
            data['form_id'] = form_id;
            data['session_id'] = session_id;
            if (project_id) {
                data['project_id'] = project_id;
            }

            if (form_id) {
                data['form_id'] = form_id;
            }

            if (session_id) {
                data['session_id'] = session_id;
            }
        }

        try {
            const response = await axios({
                method: 'post',
                url: `${this.BASE_URL}/data_entry/query`,
                headers: {},
                data: data,
            });
            return response.data;
        } catch (err) {
            console.error(err);
        }
    };

    getEntry = async (entry_id) => {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/data_entry/${entry_id}`,
                this.getJwtConfig()
            );

            return response.data;
        } catch (err) {
            console.error(err);
        }
    };

    postEntry = async (entry) => {
        try {
            await axios({
                method: 'post',
                url: `${this.BASE_URL}/data_entry`,
                headers: {},
                data: entry,
            });
        } catch (err) {
            console.error(err);
        }
    };

    putEntry = async (entry) => {
        try {
            await axios({
                method: 'put',
                url: `${this.BASE_URL}/data_entry`,
                headers: {},
                data: entry,
            });
        } catch (err) {
            console.error(err);
        }
    };

    deleteEntry = async (session_id, entry_id) => {
        try {
            await axios.delete(`${this.BASE_URL}/data_entry/${entry_id}`, this.getJwtConfig());
        } catch (err) {
            console.error(err);
        }
    };

    // Session

    getSessions = async (project_id, form_id) => {
        var data = {};
        if (project_id || form_id) {
            data['project_id'] = project_id;
            data['form_id'] = form_id;

            if (project_id) {
                data['project_id'] = project_id;
            }

            if (form_id) {
                data['form_id'] = form_id;
            }
        }

        try {
            const response = await axios({
                method: 'post',
                url: `${this.BASE_URL}/session/query`,
                headers: {},
                data: data,
            });

            return await response.data;
        } catch (err) {
            console.error(err);
        }
    };

    sessionExists = async (session_id) => {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/session/${session_id}`,
                this.getJwtConfig()
            );

            return response.data;
        } catch (err) {
            console.error(err);
        }
    };

    getSession = async (session_id) => {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/session/${session_id}`,
                this.getJwtConfig()
            );
            return response.data;
        } catch (err) {
            return undefined;
        }
    };

    postSession = async (session) => {
        try {
            await axios.post(`${this.BASE_URL}/session`, session, this.getJwtConfig());
        } catch (err) {
            console.error(err);
        }
    };

    putSession = async (session) => {
        try {
            await axios.put(`${this.BASE_URL}/session`, session, this.getJwtConfig());
        } catch (err) {
            console.error(err);
        }
    };

    deleteSession = async (session_id) => {
        try {
            await axios.delete(`${this.BASE_URL}/session/${session_id}`, this.getJwtConfig());
        } catch (err) {
            console.error(err);
        }
    };

    moveEntry = async (session_id, entry_id, new_id) => {
        try {
            const response = await axios.put(
                `${this.BASE_URL}/data_entry/${session_id}/${entry_id}/move?new_id=${new_id}`,
                {},
                this.getJwtConfig()
            );
            return response;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    login = async (credentials) => {
        try {
            const response = await axios.post(`${this.BASE_URL}/login`, credentials);
            return response;
        } catch (err) {
            console.error(err);
            return false;
        }
    };
}
