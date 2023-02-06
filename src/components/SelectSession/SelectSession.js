/*
 * File: SelectSession.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Allows user actors to select a session and change theme.
 * Note: Handles date component as well.
 */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
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
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    spacing: {
        margin: theme.spacing.unit,
    },
    group: {
        margin: theme.spacing.unit,
    },
});

export default withStyles(styles)(
    class SelectSession extends Component {
        constructor(props) {
            super(props);

            this.state = {
                selectedSession: '',
                sessionsByYear: undefined,
                selectedYear: '',
            };
            if (this.props.sessions.length) {
                this.state.selectedSession = this.props.sessions[0].session_id;
                this.state.selectedYear = moment(
                    new Date(this.state.selectedSession * 1000)
                ).format('YYYY');
            }
            this.handleFormChange = this.handleFormChange.bind(this);
        }

        handleFormChange = (event) => {
            this.setState({ [event.target.name]: event.target.value });
        };

        handleYearChange = (event) => {
            const session = this.state.sessionsByYear[event.target.value][0].session_id;
            this.setState({
                selectedYear: event.target.value,
                selectedSession: session,
            });
        };

        submitSessionSelection = () => {
            this.props.selectSession(this.state.selectedSession);
        };

        organizeSessionsByYear = (sessions) => {
            if (sessions === undefined || sessions.length === 0) {
                return;
            }
            const organized = sessions.reduce((obj, session) => {
                const year = moment(new Date(session.session_id * 1000)).format('YYYY');
                if (obj[year] === undefined) {
                    obj[year] = [];
                }
                obj[year].push(session);

                return obj;
            }, {});

            this.setState({
                sessionsByYear: organized,
                selectedSession: sessions[0].session_id,
            });
            return organized;
        };

        render() {
            const { classes, sessions } = this.props;
            const sessionsByYear =
                this.state.sessionsByYear === undefined
                    ? this.organizeSessionsByYear(sessions)
                    : this.state.sessionsByYear;
            const yearOptions = Object.keys(sessionsByYear)
                .sort((y1, y2) => y2 - y1)
                .map((year) => {
                    return (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    );
                });
            const sessionOptions = sessionsByYear[this.state.selectedYear].map((session) => {
                const title = moment(new Date(session.date_created * 1000)).format(
                    'MM/DD HH:mm:ss'
                );
                return (
                    <MenuItem key={session.session_id} value={session.session_id}>
                        {title}
                    </MenuItem>
                );
            });
            return (
                <Paper className={classes.container}>
                    <h3 className={classes.detailHeader}>Select Session For New Entry</h3>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="selectedYear">Year</InputLabel>
                        <Select
                            value={this.state.selectedYear}
                            onChange={this.handleYearChange}
                            inputProps={{
                                name: 'selectedYear',
                                id: 'selectedYear',
                            }}
                            autoWidth
                        >
                            {yearOptions}
                        </Select>
                        <FormHelperText>Select the session's year</FormHelperText>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="selectedSession">Session</InputLabel>
                        <Select
                            value={this.state.selectedSession}
                            onChange={this.handleFormChange}
                            inputProps={{
                                name: 'selectedSession',
                                id: 'selectedSession',
                            }}
                            autoWidth
                        >
                            {sessionOptions}
                        </Select>
                        <FormHelperText>Select the session form to use</FormHelperText>
                    </FormControl>
                    <div>
                        <Button
                            onClick={this.submitSessionSelection}
                            className={classes.spacing}
                            variant="contained"
                            color="primary"
                        >
                            Select Session
                        </Button>
                    </div>
                </Paper>
            );
        }
    }
);
