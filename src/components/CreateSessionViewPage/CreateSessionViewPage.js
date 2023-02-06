/*
 * File: CreateSessionViewPage.js
 * Version: 1.01 US169
 * Date: 2020-03-02
 * Description: Handles rendering of a new user session view page.
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { APIContext } from '../APIContext/APIContext';
import NewSessionEntryForm from '../NewSessionEntryForm/NewSessionEntryForm';
import SessionDetailCard from '../SessionDetailCard/SessionDetailCard';

import moment from 'moment';
import { Paper } from '@material-ui/core';

const styles = {
    container: {
        marginBottom: 20,
        padding: `10px 20px`,
    },
    detailHeader: {
        marginTop: 10,
        fontSize: 26,
    },
};
class CreateSessionViewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionForms: this.props.sessionForms,
            dataForms: this.props.dataForms,
            newSession: undefined,
            sessionAdded: false,
        };
        this.newSessionAdded = this.newSessionAdded.bind(this);
    }

    newSessionAdded = (session) => {
        this.setState({
            newSession: session,
            sessionAdded: true,
        });
    };
    reset = () => {
        this.setState({
            newSession: undefined,
            sessionAdded: false,
        });
    };

    render() {
        const { sessionForms, classes } = this.props;
        const selectedSessionForm = this.state.sessionAdded
            ? sessionForms.find((sf) => {
                  return sf.form_id === this.state.newSession.form_id;
              })
            : undefined;

        const newSessionData = this.state.sessionAdded
            ? this.state.newSession.session_json.reduce(
                  (container, obj) => {
                      return Object.assign(container, obj);
                  },
                  { 'Session ID': this.state.newSession.session_id }
              )
            : undefined;

        if (newSessionData) {
            newSessionData['Date and Time'] = moment(
                new Date(newSessionData['Session ID'] * 1000)
            ).format('YYYY/MM/DD HH:mm');
            for (const [key, value] of Object.entries(newSessionData)) {
                if (value === null) {
                    newSessionData[key] = 'N/A';
                } else if (value === false) {
                    newSessionData[key] = 'false';
                } else if (value === true) {
                    newSessionData[key] = 'true';
                }
            }
        }
        return (
            <div>
                {this.state.sessionAdded && (
                    <Paper className={classes.container}>
                        <h3 className={classes.detailHeader}>Session Has Been Added</h3>
                    </Paper>
                )}
                {this.state.sessionAdded && (
                    <SessionDetailCard title={selectedSessionForm.form_name} row={newSessionData} />
                )}
                <NewSessionEntryForm {...this.props} addSessionHandler={this.newSessionAdded} />
            </div>
        );
    }
}

export default withStyles(styles)(
    withRouter((props) => (
        <APIContext.Consumer>
            {(apiProps) => <CreateSessionViewPage {...props} {...apiProps} />}
        </APIContext.Consumer>
    ))
);
