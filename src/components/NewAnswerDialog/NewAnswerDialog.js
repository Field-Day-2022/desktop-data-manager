/*
 * File: NewAnswerDialog.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Handles creating, submitting and changing NewAnswers.
 */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Typography } from '@material-ui/core';

const styles = (theme) => ({
    formControl: {
        margin: theme.spacing.unit,
        width: 250,
    },
    textField: {
        margin: theme.spacing.unit,
        width: 250,
    },
    optionsInput: {
        width: 500,
        margin: theme.spacing.unit,
    },
    errorMessage: {
        color: 'red',
    },
});

class NewInputDialog extends Component {
    state = {
        answer: {
            primary: '',
            secondary: null,
        },
        errors: null,
    };

    static defaultProps = {
        answer: {
            primary: '',
            secondary: null,
        },
    };

    componentDidUpdate(prevProps) {
        const { open, answer } = this.props;
        if (!prevProps.open && open) {
            if (answer) {
                const copy = JSON.parse(JSON.stringify(answer));
                //copy.options = Array.isArray(answer.options) ? answer.options.join(', ') : '';
                this.setState({ answer: copy });
            }
        }
    }

    resetState = () => {
        this.setState({
            answer: {
                primary: '',
                secondary: this.props.secondaryFields,
            },
            errors: null,
        });
    };

    handleValueChange = (event) => {
        const { answer } = { ...this.state };
        const currentAnswer = answer;
        const { value } = event.target;
        currentAnswer.primary = value;
        this.setState({ answer: currentAnswer });
    };

    handleValueChangeSec = (entry) => (event) => {
        const { answer } = { ...this.state };
        const currentAnswer = answer;
        const { value } = event.target;
        if (currentAnswer.secondary) {
            currentAnswer.secondary[entry] = value;
        } else {
            currentAnswer.secondary = {};
            currentAnswer.secondary[entry] = value;
        }
        this.setState({ answer: currentAnswer });
    };

    handleSubmit = () => {
        const { answer } = this.state;
        const errors = this.getInputErrors(answer);
        if (errors) {
            this.setState({ errors });
        } else {
            this.props.handleAdd(answer);
            this.resetState();
        }
    };

    handleCancel = () => {
        this.props.handleCancel(() => this.resetState());
    };

    getInputErrors = (answer) => {
        if (!answer || answer.primary.trim() === '') {
            return 'No answer provided, please name your answer.';
        }
        return null;
    };

    render() {
        const { open, classes, globalSecondaryFields } = this.props;
        const { answer, errors } = this.state;

        return (
            <Dialog open={open} onClose={this.handleCancel} aria-labelledby="answer-dialog-title">
                <DialogTitle id="answer-dialog-title">New Answer</DialogTitle>
                <DialogContent>
                    <DialogContentText>Add a new answer to your set.</DialogContentText>

                    <TextField
                        key="primary"
                        id="answer"
                        label="Primary"
                        className={classes.textField}
                        value={answer.primary}
                        onChange={this.handleValueChange}
                        margin="normal"
                    />
                    {answer.secondary && globalSecondaryFields ? (
                        <div>
                            <DialogContentText>Secondary</DialogContentText>
                            {Object.entries(answer.secondary)
                                .filter((s) => globalSecondaryFields.includes(s[0]))
                                .map((entry, i) => (
                                    <TextField
                                        key={entry[0]}
                                        id={entry[0]}
                                        label={entry[0]}
                                        className={classes.textField}
                                        value={entry[1]}
                                        onChange={this.handleValueChangeSec(entry[0])}
                                        margin="normal"
                                    />
                                ))}
                            {globalSecondaryFields
                                .filter((s) => !answer.secondary.hasOwnProperty(s))
                                .map((entry, i) => (
                                    <TextField
                                        key={entry}
                                        id={entry}
                                        label={entry}
                                        className={classes.textField}
                                        value=""
                                        autoFocus
                                        onChange={this.handleValueChangeSec(entry)}
                                        margin="normal"
                                    />
                                ))}
                        </div>
                    ) : globalSecondaryFields != null &&
                      Array.isArray(globalSecondaryFields) &&
                      globalSecondaryFields.length > 0 ? (
                        <div>
                            <DialogContentText>Secondary</DialogContentText>
                            {globalSecondaryFields.map((entry, i) => (
                                <TextField
                                    key={entry}
                                    id={entry}
                                    label={entry}
                                    className={classes.textField}
                                    value=""
                                    autoFocus
                                    onChange={this.handleValueChangeSec(entry)}
                                    margin="normal"
                                />
                            ))}
                        </div>
                    ) : null}
                    {errors ? (
                        <Typography variant="body1" className={classes.errorMessage}>
                            Error: {errors}
                        </Typography>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.resetState} color="primary">
                        Clear
                    </Button>
                    <Button variant="contained" onClick={this.handleSubmit} color="primary">
                        Add Answer
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(NewInputDialog);
