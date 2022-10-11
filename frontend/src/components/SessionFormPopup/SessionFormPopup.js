/*
* File: SessionFormPopup.js
* Version: 1.01
* Date: 2020-03-07
* Description: Contains the information for a popup for inputting captured critter information
* and returns a dataform with the information that has been input by the user actor.
*/

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import FormBuilderToolbar from '../FormBuilderToolbar/FormBuilderToolbar';
import FormList from '../FormList/FormList';
import FieldListBuilder from '../FieldListBuilder/FieldListBuilder';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  sectionTitle: {
    margin: 15,
  },
  flex: {
    flex: 1,
  },
  paper: {
    margin: 15,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  errorText: {
    color: '#FFFFFF',
  },
  dataFormContainer: {
    margin: 15,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SessionFormPopup extends Component {
  state = {
    form_id: null,
    form_name: '',
    start: {
      title: '',
      showConfirmation: true,
      fields: [],
      next: [
        {
          predicate: 'No Captures == "true"',
          nextPage: 'FieldDayEndSessionForm',
        },
        {
          predicate: 'true',
          nextPage: 'FieldDayFormSelectionForm',
        },
      ],
    },
    end: {
      title: '',
      showConfirmation: true,
      fields: [],
      next: [
        {
          predicate: 'true',
          nextPage: 'FieldDayHome',
        },
      ],
    },
    is_session_form: true,
    errors: null,
    selectedFieldIndex: null,
  };

  componentDidUpdate(prevProps) {
    const { open, form } = this.props;
    if (!prevProps.open && open) {
      if (form) {
        const { form_id, form_name, template_json, is_session_form } = form;
        const template = JSON.parse(template_json);
        const { start, end } = template;

        this.setState({
          form_id,
          form_name,
          start,
          end,
          is_session_form,
          errors: null,
        });
      }
    }
  }

  resetState = () => {
    this.setState({
      form_id: null,
      form_name: '',
      start: {
        title: '',
        showConfirmation: true,
        fields: [],
        next: [
          {
            predicate: 'No Captures == "true"',
            nextPage: 'FieldDayEndSessionForm',
          },
          {
            predicate: 'true',
            nextPage: 'FieldDayFormSelectionForm',
          },
        ],
      },
      end: {
        title: '',
        showConfirmation: true,
        fields: [],
        next: [
          {
            predicate: 'true',
            nextPage: 'FieldDayHome',
          },
        ],
      },
      is_session_form: true,
      errors: null,
      selectedFieldIndex: null,
    });
  };

  handleNameInput = event => {
    this.setState({
      name: event.currentTarget.value,
    });
  };

  handleAddStartField = fields => {
    const { start } = this.state;
    this.setState({
      start: {
        ...start,
        fields,
      },
    });
  };

  handleAddEndField = fields => {
    const { end } = this.state;
    this.setState({
      end: {
        ...end,
        fields,
      },
    });
  };

  handleCancel = () => {
    this.props.onClose(null, true);
    this.resetState();
  };

  handleCreate = () => {
    const { form_id, form_name, start, end, is_session_form } = this.state;

    const newForm = JSON.parse(
      JSON.stringify({
        form_id: Math.round(Date.now() / 1000),
        form_name,
        template_json: JSON.stringify({
          start,
          end,
        }),
        is_session_form,
      })
    );

    const errors = this.getFormErrors(newForm);
    if (errors) {
      this.setState({ errors });
    } else {
      newForm.date_modified = Math.round(Date.now() / 1000);
      this.props.onClose(newForm, true);
      this.resetState();
    }
  };

  getFormErrors = form => {
    const { form_name, template_json } = form;
    const template = JSON.parse(template_json);
    const { start } = template;
    if (!form_name || form_name.trim() === '') {
      return 'No name provided, please name your form.';
    }
    if (!start || !start.fields || !start.fields.length) {
      return 'No starting fields provided, please add a starting field to your form.';
    }
    return null;
  };

  getExternalValidationErrors = field => {
    const { start, end } = this.state;
    if (
      [...start.fields.map(f => f.prompt), ...end.fields.map(f => f.prompt)].includes(field.prompt)
    ) {
      return `Field with name \`${field.prompt}\` already exists`;
    }
    return null;
  };

  render() {
    const { form_name, start, end, errors } = this.state;
    const { open, classes } = this.props;

    return (
      <div>
        <Dialog fullScreen open={open} onClose={this.handleCancel} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleCancel} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Session Form Builder
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
            title="Starting Form Fields"
            fields={start.fields}
            onFieldAdd={this.handleAddStartField}
            getExternalValidationErrors={this.getExternalValidationErrors}
            isSessionForm
          />

          <FieldListBuilder
            title="Ending Form Fields"
            fields={end.fields}
            onFieldAdd={this.handleAddEndField}
            getExternalValidationErrors={this.getExternalValidationErrors}
            isSessionForm
          />
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(SessionFormPopup);
