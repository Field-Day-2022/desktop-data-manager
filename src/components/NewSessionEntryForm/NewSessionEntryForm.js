/*
 * File: NewSessionEntryForm.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Creates a new session entry form for the user actor to interact with in conjunction with the new data entry form.
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import moment from 'moment';

const styles = (theme) => ({
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
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    errors: {
        color: 'red',
        fontWeight: 'bold',
    },
});

export default withStyles(styles)(
    class NewSessionEntryForm extends Component {
        constructor(props) {
            super(props);
            this.state = {
                addSessionHandler: this.props.addSessionHandler,
                sessionForms: this.props.sessionForms,
                sessionError: '',
                sessionDate: '00/00/0000',
                sessionTime: '00:00:00',
                projectId: this.props.project_id,
                sessionAdded: false,
                sessionData: undefined,
                session: undefined,
                fields: undefined,
            };

            if (this.state.sessionForms.length) {
                this.state.selectedForm = this.state.sessionForms[0].form_id;
            } else {
                this.state.selectedForm = '';
            }
            this.handleChange = this.handleChange.bind(this);
            this.handleFormChange = this.handleFormChange.bind(this);
            this.handleSessionDataChange = this.handleSessionDataChange.bind(this);
            this.setupSessionDataState = this.setupSessionDataState.bind(this);
            this.handleSubmitSession = this.handleSubmitSession.bind(this);
            this.getFields = this.getFields.bind(this);
            this.resetForm = this.resetForm.bind(this);
        }

        handleChange = (name) => (event) => {
            this.setState({ [name]: event.target.value });
        };
        handleFormChange = (event) => {
            this.setState({ [event.target.name]: event.target.value });
            this.setState({ sessionData: undefined });
        };

        setupSessionDataState = (fields) => {
            const newState = {};
            fields.forEach((f) => {
                newState[f.prompt] = '';
            });
            this.setState({ sessionData: newState });
        };
        handleSessionDataChange = (name) => (event) => {
            const sessionData = { ...this.state.sessionData };
            sessionData[name] = event.target.value;
            this.setState({ sessionData: sessionData });
        };

        handleSubmitSession = async () => {
            const date = this.state.sessionDate;
            const time = this.state.sessionTime;

            const parsedDate = moment(date + ' ' + time, 'MM/DD/YYYY HH:mm:ss');
            const sessionId = Math.round(parsedDate.valueOf() / 1000);

            if (isNaN(sessionId)) {
                this.setState({
                    sessionError:
                        'The date and time fields are required and must match the specified format.',
                });
                return;
            } else {
                const sessionData = this.state.sessionData;
                const newSession = {
                    project_id: this.state.projectId,
                    form_id: this.state.selectedForm,
                    date_modified: Math.round(Date.now() / 1000),
                    date_created: Math.round(Date.now() / 1000),
                    session_id: sessionId,
                };

                const session_json = this.state.fields.map((f) => {
                    if (sessionData[f.prompt] === undefined) {
                        return { [f.prompt]: null };
                    } else if (sessionData[f.prompt].length === 0) {
                        return { [f.prompt]: null };
                    } else if (!isNaN(sessionData[f.prompt])) {
                        return { [f.prompt]: Number(sessionData[f.prompt]) };
                    } else if (sessionData[f.prompt].toLowerCase() === 'false') {
                        return { [f.prompt]: false };
                    } else if (sessionData[f.prompt].toLowerCase() === 'true') {
                        return { [f.prompt]: true };
                    } else {
                        return { [f.prompt]: sessionData[f.prompt] };
                    }
                });
                newSession.session_json = session_json;
                const idExists = await this.props.getSession(sessionId);
                if (!idExists) {
                    await this.props.addSession(newSession);
                    this.setState({
                        session: newSession,
                        sessionAdded: true,
                    });
                    this.setState({ sessionError: '' });
                } else {
                    this.setState({
                        sessionError:
                            'That date and time has already been used for a session. Please modify the date/time to make it unique.',
                    });
                }
            }
        };

        getFields = (sessionForms) => {
            const form = sessionForms.find((f) => {
                return this.state.selectedForm === f.form_id;
            });
            const template = form.template_json;
            const fields = [
                ...template.start.fields.filter((f) => f.type !== 'HIST_BUTTON'),
                ...template.end.fields.filter((f) => f.type !== 'HIST_BUTTON'),
            ];
            this.setState({ fields: fields });
        };

        resetForm = () => {
            this.setState({
                sessionError: '',
                sessionDate: '00/00/0000',
                sessionTime: '00:00:00',
                sessionAdded: false,
                sessionData: undefined,
                session: undefined,
                fields: undefined,
            });
        };
        render() {
            if (this.state.sessionAdded) {
                this.state.addSessionHandler(this.state.session);
                this.resetForm();
                return <h3>Session Added Successfully.</h3>;
            }
            const { classes, sessionForms } = this.props;

            const options = this.state.sessionForms.map((form) => {
                return (
                    <MenuItem key={form.form_id} value={form.form_id}>
                        {form.form_name}
                    </MenuItem>
                );
            });
            if (!this.state.fields) {
                this.getFields(sessionForms);
            }
            const showSessionForm =
                this.state.selectedForm !== '' && this.state.fields !== undefined;
            let textFields = undefined;

            if (showSessionForm) {
                if (this.state.sessionData === undefined) {
                    this.setupSessionDataState(this.state.fields);
                } else {
                    textFields = this.state.fields.map((f) => {
                        return (
                            <TextField
                                key={f.prompt}
                                id={f.prompt}
                                label={f.prompt}
                                className={classes.textField}
                                value={this.state.sessionData[f.prompt]}
                                onChange={this.handleSessionDataChange(f.prompt)}
                                margin="normal"
                            />
                        );
                    });
                }
            }

            return (
                <Paper className={classes.container}>
                    <h3 className={classes.detailHeader}>Add New Session</h3>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="selectedForm">Session Form</InputLabel>
                        <Select
                            value={this.state.selectedForm}
                            onChange={this.handleFormChange}
                            inputProps={{
                                name: 'selectedForm',
                                id: 'selectedForm',
                            }}
                            autoWidth
                        >
                            {options}
                        </Select>
                        <FormHelperText>Select the session form to use</FormHelperText>
                    </FormControl>
                    {showSessionForm && <h4>Enter Session Information</h4>}
                    {this.state.sessionError.length > 0 && (
                        <p className={classes.errors}>{this.state.sessionError}</p>
                    )}
                    {textFields !== undefined && (
                        <div>
                            <form>
                                <h5>
                                    Enter the data and time of the session (Note: the date and time
                                    entered must be unique and not used for any other session)
                                </h5>
                                <TextField
                                    id="sessionDate"
                                    label="Date (mm/dd/yyyy)"
                                    className={classes.textField}
                                    value={this.state.sessionDate}
                                    onChange={this.handleChange('sessionDate')}
                                    margin="normal"
                                />
                                <TextField
                                    id="sessionTime"
                                    label="Time (hh:mm:ss)"
                                    className={classes.textField}
                                    value={this.state.sessionTime}
                                    onChange={this.handleChange('sessionTime')}
                                    margin="normal"
                                />
                                <h5>Enter the values for the prompts in the session form</h5>
                                {textFields}
                            </form>
                            <Button
                                onClick={this.handleSubmitSession}
                                variant="contained"
                                color="primary"
                            >
                                Submit
                            </Button>
                        </div>
                    )}
                </Paper>
            );
        }
    }
);
