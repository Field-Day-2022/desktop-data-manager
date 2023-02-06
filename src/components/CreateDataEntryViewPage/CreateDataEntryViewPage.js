/*
 * File: CreateDataEntryViewPage.js
 * Version: 1.01 US169
 * Date: 2020-03-02
 * Description: Initializes the data entry page when user starts data entering process.
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { APIContext } from '../APIContext/APIContext';
import SessionDetailCard from '../SessionDetailCard/SessionDetailCard';

import SelectSession from '../SelectSession/SelectSession';
import moment from 'moment';
import NewDataEntryForm from '../NewDataEntryForm/NewDataEntryForm';

const styles = {
    container: {
        marginBottom: 20,
        padding: `10px 20px`,
    },
    detailHeader: {
        marginTop: 10,
        fontSize: 26,
    },
    detailLine: {
        fontSize: 14,
    },
    detailTitle: {
        fontWeight: 700,
    },
};

class CreateDataEntryViewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataForms: this.props.dataForms,
            sessions: undefined,
            projectId: this.props.project_id,
            selectedSession: undefined,
            entries: undefined,
        };
        this.newEntryAdded = this.newEntryAdded.bind(this);
        this.getSessions = this.getSessions.bind(this);
        this.selectSession = this.selectSession.bind(this);
    }

    componentDidMount() {
        this.getSessions();
    }

    componentDidUpdate() {
        this.getSessions();
    }

    newEntryAdded = (entryId) => {
        this.setState({
            nextEntryId: entryId + 1,
            addDataForm: false,
        });
    };

    getSessions = async () => {
        if (this.state.sessions === undefined) {
            const sessions = await this.props.getSessions(this.state.projectId);
            sessions.sort((s1, s2) => s2.session_id - s1.session_id);
            this.setState({ sessions: sessions });
        }
    };

    selectSession = async (sessionId) => {
        this.setState({ entries: undefined });
        const session = this.state.sessions.find((s) => {
            return s.session_id === sessionId;
        });
        const entries = await this.props.getEntries(this.state.projectId, undefined, sessionId);
        entries.sort((e1, e2) => e1.entry_id - e2.entry_id);
        this.setState({
            selectedSession: session,
            entries: entries,
        });
    };

    getSessionInfoToDisplay = (session) => {
        const sessionJson = session.session_json;
        const newSessionData = sessionJson.reduce(
            (container, obj) => {
                return Object.assign(container, obj);
            },
            { 'Session ID': session.session_id }
        );
        newSessionData['Date and Time'] = moment(new Date(session.date_created * 1000)).format(
            'YYYY/MM/DD HH:mm'
        );
        for (const [key, value] of Object.entries(newSessionData)) {
            if (value === null) {
                newSessionData[key] = 'N/A';
            } else if (value === false) {
                newSessionData[key] = 'false';
            } else if (value === true) {
                newSessionData[key] = 'true';
            }
        }

        return newSessionData;
    };
    render() {
        const { classes } = this.props;
        return (
            <div>
                {this.state.sessions ? (
                    <SelectSession
                        selectSession={this.selectSession}
                        sessions={this.state.sessions}
                        {...this.props}
                    />
                ) : (
                    <h3 className={classes.detailHeader}>Loading session data, please wait...</h3>
                )}

                {this.state.selectedSession !== undefined && (
                    <SessionDetailCard
                        title="Session Selected"
                        row={this.getSessionInfoToDisplay(this.state.selectedSession)}
                    />
                )}
                {this.state.entries !== undefined && (
                    <NewDataEntryForm
                        entries={this.state.entries}
                        sessionId={this.state.selectedSession.session_id}
                        {...this.props}
                    />
                )}
            </div>
        );
    }
}

export default withStyles(styles)(
    withRouter((props) => (
        <APIContext.Consumer>
            {(apiProps) => <CreateDataEntryViewPage {...props} {...apiProps} />}
        </APIContext.Consumer>
    ))
);
