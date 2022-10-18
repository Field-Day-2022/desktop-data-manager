/*
 * File: SessionFormViewPage.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Creates a constructor for creating and viewing a new form.
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import SessionFormTable from '../SessionFormTable/SessionFormTable';

import { APIContext } from '../APIContext/APIContext';

class SessionFormViewPage extends Component {
    state = {
        rows: [],
        form: null,
    };

    componentDidMount() {
        this.getRows();
    }

    componentDidUpdate() {
        this.getRows();
    }

    getRows = async (force = false) => {
        const { sessionForms, match, getSessions, project_id } = this.props;
        const { form } = this.state;
        const newForm = sessionForms.find((f) => '' + f.form_id === match.params.form_id);

        if (force || !form || form.form_id !== newForm.form_id) {
            try {
                const sessions = await getSessions(project_id, newForm.form_id);

                const rows = sessions
                    .sort((s1, s2) => s2.session_id - s1.session_id)
                    .map((session) => {
                        const session_json = session.session_json;
                        const row = session_json.reduce((a, c) => ({ ...a, ...c }), {});
                        for (const property in row) {
                            if (row.hasOwnProperty(property)) {
                                if (typeof row[property] === 'boolean') {
                                    row[property] = row[property].toString();
                                } else if (row[property] === null) {
                                    row[property] = 'N/A';
                                }
                            }
                        }
                        row['Session ID'] = session.session_id;
                        console.log();
                        row['Date/Time'] = moment(new Date(session.date_created * 1000)).format(
                            'YYYY/MM/DD HH:mm'
                        );
                        row['Year'] = moment(new Date(session.date_created * 1000)).format('YYYY');
                        row.session = session;
                        return row;
                    });

                this.setState({ rows, form: newForm });
            } catch (err) {
                console.error(err);
            }
        }
    };

    render() {
        const { sessionForms, match, history } = this.props;
        const form = sessionForms.find((form) => '' + form.form_id === match.params.form_id);
        if (form) {
            const { rows } = this.state;
            var template = {};
            try {
                template = form.template_json;
            } catch (err) {
                console.log(err);
                console.log('err for form.template_json');
                console.log('form name: ' + form.form_name);
                console.log(form.template_json);
                throw err;
            }
            const fields = [
                { prompt: 'Year', readonly: true },
                { prompt: 'Date/Time', readonly: false },
                { prompt: 'Session ID', readonly: true },
                ...template.start.fields.filter((f) => f.type !== 'HIST_BUTTON'),
                ...template.end.fields.filter((f) => f.type !== 'HIST_BUTTON'),
            ];

            return (
                <SessionFormTable form={form} fields={fields} rows={rows} refetch={this.getRows} />
            );
        } else {
            history.push('/not-found');
            return null;
        }
    }
}

export default withRouter((props) => (
    <APIContext.Consumer>
        {(apiProps) => <SessionFormViewPage {...props} {...apiProps} />}
    </APIContext.Consumer>
));
