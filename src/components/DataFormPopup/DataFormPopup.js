/*
 * File: DataFormPopup.js
 * Version: 1.01 US170
 * Date: 2020-03-03
 * Description: Handles form errors and renders user data form popups.
 */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import FormBuilderToolbar from '../FormBuilderToolbar/FormBuilderToolbar';
import FieldListBuilder from '../FieldListBuilder/FieldListBuilder';

const styles = (theme) => ({
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    paper: {
        margin: 15,
    },
    sectionTitle: {
        margin: '15px auto 0px 15px',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    errorText: {
        color: '#FFFFFF',
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DataFormPopup extends Component {
    state = {
        form_id: null,
        form_name: '',
        fields: [],
        showConfirmation: true,
        next: [
            {
                predicate: true,
                nextPage: 'FieldDayFormSelectionForm',
            },
        ],
        is_session_form: false,
        errors: null,
    };

    componentDidUpdate(prevProps) {
        const { open, form } = this.props;
        if (!prevProps.open && open) {
            if (form) {
                const { form_id, form_name, template_json, is_session_form } = form;
                const template = template_json;
                const { fields, showConfirmation, next } = template;

                this.setState({
                    form_id,
                    form_name,
                    fields,
                    showConfirmation,
                    next,
                    is_session_form,
                    errors: null,
                });
            }
        }
    }

    resetState = () => {
        this.setState({
            form_id: 0,
            form_name: '',
            fields: [],
            showConfirmation: true,
            next: [
                {
                    predicate: true,
                    nextPage: 'FieldDayFormSelectionForm',
                },
            ],
            is_session_form: 0,
            errors: null,
        });
    };

    handleNameInput = (event) => {
        this.setState({
            form_name: event.currentTarget.value,
        });
    };

    handleCancel = () => {
        this.props.onClose();
        this.resetState();
    };

    handleCreate = () => {
        const { form_id, form_name, fields, showConfirmation, next, is_session_form } = this.state;

        const newForm = JSON.parse(
            JSON.stringify({
                form_id: Math.round(Date.now() / 1000),
                form_name,
                template_json: {
                    fields,
                    showConfirmation,
                    next,
                },
                is_session_form,
            })
        );

        const errors = this.getFormErrors(newForm);
        if (errors) {
            this.setState({ errors });
        } else {
            newForm.date_modified = Math.round(Date.now() / 1000);
            this.props.onClose(newForm);
            this.resetState();
        }
    };

    handleFieldAdd = (fields) => {
        this.setState({ fields });
    };

    getFormErrors = (form) => {
        const { form_name, template_json } = form;
        const template = template_json;
        const { fields } = template;

        if (!form_name || form_name.trim() === '') {
            return 'No form name provided, please name your form.';
        }
        if (!fields || !fields.length) {
            return 'No fields provided, please add a field to your form.';
        }
        return null;
    };

    getExternalValidationErrors = (field) => {
        const { fields } = this.state;
        if (fields.map((f) => f.prompt).includes(field.prompt)) {
            return `Field with prompt \`${field.prompt}\` already exists`;
        }
        return null;
    };

    render() {
        const { form_name, errors, fields } = this.state;
        const { open, classes } = this.props;

        return (
            <div>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={this.handleCancel}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                onClick={this.handleCancel}
                                aria-label="Close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="title" color="inherit" className={classes.flex}>
                                Data Form Builder
                            </Typography>
                            {errors ? (
                                <Typography variant="body1" className={classes.errorText}>
                                    {errors}
                                </Typography>
                            ) : null}
                            <Button color="inherit" onClick={this.handleCreate}>
                                Done
                            </Button>
                        </Toolbar>
                    </AppBar>

                    <FormBuilderToolbar name={form_name} onName={this.handleNameInput} />

                    <FieldListBuilder
                        title="Data Form Fields"
                        fields={fields}
                        onFieldAdd={this.handleFieldAdd}
                        getExternalValidationErrors={this.getExternalValidationErrors}
                    />
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(DataFormPopup);
