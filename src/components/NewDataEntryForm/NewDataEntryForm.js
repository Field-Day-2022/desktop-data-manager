/*
 * File: NewDataEntryForm.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Creates a new data entry form for the user actor to interact with.
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
    class NewDataEntryForm extends Component {
        constructor(props) {
            super(props);
            this.state = {
                sessionId: this.props.sessionId,
                projectId: this.props.project_id,
                selectedForm: undefined,
                entryError: '',
                entryId: undefined,
                entryDate: '00/00/0000',
                entryTime: '00:00:00',
                fields: undefined,
                entryAdded: false,
                entryData: undefined,
                entries: this.props.entries,
            };

            if (this.props.dataForms.length) {
                this.state.selectedForm = this.props.dataForms[0].form_id;
            } else {
                this.state.selectedForm = '';
            }
            this.handleChange = this.handleChange.bind(this);
            this.handleFormChange = this.handleFormChange.bind(this);
            this.handleFormDataChange = this.handleFormDataChange.bind(this);
            this.setupFormDataState = this.setupFormDataState.bind(this);
            this.handleSubmitEntry = this.handleSubmitEntry.bind(this);
            this.getFields = this.getFields.bind(this);
            this.resetForm = this.resetForm.bind(this);
        }

        handleChange = (name) => (event) => {
            this.setState({ [name]: event.target.value });
        };
        handleFormChange = (event) => {
            this.setState({
                [event.target.name]: event.target.value,
                entryData: undefined,
                fields: undefined,
            });
        };

        loadNextEntryId = (sessionId) => {
            let entryId = sessionId + 1;
            //check that the entry id is unique for this session
            this.state.entries.forEach((e) => {
                if (e.entry_id === entryId) {
                    entryId++;
                }
            });
            this.setState({
                entryId: entryId,
                entryDate: moment(new Date(entryId * 1000)).format('MM/DD/YYYY'),
                entryTime: moment(new Date(entryId * 1000)).format('HH:mm:ss'),
            });
        };

        setupFormDataState = (fields) => {
            const newState = {};
            fields.forEach((f) => {
                newState[f.prompt] = '';
            });
            this.setState({ entryData: newState });
        };
        handleFormDataChange = (name) => (event) => {
            const entryData = { ...this.state.entryData };
            entryData[name] = event.target.value;
            this.setState({ entryData: entryData });
        };

        handleSubmitEntry = async () => {
            const date = this.state.entryDate;
            const time = this.state.entryTime;

            const parsedDate = moment(date + ' ' + time, 'MM/DD/YYYY HH:mm:ss');
            const entryId = Math.round(parsedDate.valueOf() / 1000);

            if (isNaN(entryId)) {
                this.setState({
                    entryError:
                        'The date and time fields are required and must match the specified format.',
                });
                return;
            } else {
                const entryData = this.state.entryData;
                const newEntry = {
                    project_id: this.state.projectId,
                    form_id: this.state.selectedForm,
                    date_modified: Math.round(Date.now() / 1000),
                    entry_id: entryId,
                    session_id: this.state.sessionId,
                };

                const entry_json = this.state.fields.map((f) => {
                    if (entryData[f.prompt] === undefined) {
                        return { [f.prompt]: null };
                    } else if (entryData[f.prompt].length === 0) {
                        return { [f.prompt]: null };
                    } else if (!isNaN(entryData[f.prompt])) {
                        return { [f.prompt]: Number(entryData[f.prompt]) };
                    } else if (entryData[f.prompt].toLowerCase() === 'false') {
                        return { [f.prompt]: false };
                    } else if (entryData[f.prompt].toLowerCase() === 'true') {
                        return { [f.prompt]: true };
                    } else {
                        return { [f.prompt]: entryData[f.prompt] };
                    }
                });
                newEntry.entry_json = entry_json;
                const idUsed = this.state.entries.some((e) => {
                    return e.entry_id === entryId;
                });
                if (!idUsed) {
                    await this.props.addEntry(newEntry);
                    this.setState((prevState) => {
                        newEntry.entry_json = newEntry.entry_json;
                        return {
                            entryAdded: true,
                            entries: [...prevState.entries, newEntry],
                        };
                    });
                    this.setState({ entryError: '' });
                } else {
                    this.setState({
                        entryError:
                            'That date and time has already been used for an entry in this session. Please modify the date/time to make it unique.',
                    });
                }
            }
        };

        getFields = (dataForms) => {
            const form = dataForms.find((f) => {
                return this.state.selectedForm === f.form_id;
            });
            console.log('NEW FORM TEMPLATE ', form);
            const template = form.template_json;
            const fields = [...template.fields.filter((f) => f.type !== 'HIST_BUTTON')];
            this.setState({ fields: fields });
        };

        resetForm = () => {
            this.setState({
                sessionId: this.props.sessionId,
                projectId: this.props.project_id,
                selectedForm: undefined,
                entryError: '',
                entryId: undefined,
                entryDate: '00/00/0000',
                entryTime: '00:00:00',
                fields: undefined,
                entryAdded: false,
                entryData: undefined,
            });

            if (this.props.dataForms.length) {
                this.setState({ selectedForm: this.props.dataForms[0].form_id });
            } else {
                this.setState({ selectedForm: '' });
            }
        };
        render() {
            const { classes, dataForms, entries, sessionId } = this.props;

            if (this.state.entryAdded) {
                //TODO this.state.addSessionHandler(this.state.session);
                return (
                    <Paper className={classes.container}>
                        <h3 className={classes.detailHeader}>Entry Added</h3>
                        <Button onClick={this.resetForm} variant="contained" color="primary">
                            Add Another Entry
                        </Button>
                    </Paper>
                );
            }

            const options = dataForms.map((form) => {
                return (
                    <MenuItem key={form.form_id} value={form.form_id}>
                        {form.form_name}
                    </MenuItem>
                );
            });
            if (!this.state.fields) {
                this.getFields(dataForms);
            }
            const showForm = this.state.selectedForm !== '' && this.state.fields !== undefined;
            let textFields = undefined;

            if (showForm) {
                if (this.state.entryData === undefined) {
                    this.setupFormDataState(this.state.fields);
                } else {
                    if (this.state.entryId === undefined) {
                        this.loadNextEntryId(sessionId);
                    }
                    textFields = this.state.fields.map((f) => {
                        return (
                            <TextField
                                key={f.prompt}
                                id={f.prompt}
                                label={f.prompt}
                                className={classes.textField}
                                value={this.state.entryData[f.prompt]}
                                onChange={this.handleFormDataChange(f.prompt)}
                                margin="normal"
                            />
                        );
                    });
                }
            }

            return (
                <Paper className={classes.container}>
                    <h3 className={classes.detailHeader}>Add New Data Entry</h3>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="selectedForm">Data Form</InputLabel>
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
                        <FormHelperText>
                            Select the data form to use for the new entry
                        </FormHelperText>
                    </FormControl>
                    {showForm && <h4>Enter Data Entry Information</h4>}
                    {this.state.entryError.length > 0 && (
                        <p className={classes.errors}>{this.state.entryError}</p>
                    )}
                    {textFields !== undefined && (
                        <div>
                            <form>
                                <h5>
                                    Use the provided data/time, or enter a different data and time
                                    for this entry (Note: the date and time entered must be unique
                                    and not used for any other entry in this session)
                                </h5>
                                <TextField
                                    id="sessionDate"
                                    label="Date (mm/dd/yyyy)"
                                    className={classes.textField}
                                    value={this.state.entryDate}
                                    onChange={this.handleChange('entryDate')}
                                    margin="normal"
                                />
                                <TextField
                                    id="sessionTime"
                                    label="Time (hh:mm:ss)"
                                    className={classes.textField}
                                    value={this.state.entryTime}
                                    onChange={this.handleChange('entryTime')}
                                    margin="normal"
                                />
                                <h5>Enter the values for the prompts in the data entry form</h5>
                                {textFields}
                            </form>
                            <Button
                                onClick={this.handleSubmitEntry}
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
