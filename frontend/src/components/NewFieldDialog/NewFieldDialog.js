/*
* File: NewFieldDialog.js
* Version: 1.01
* Date: 2020-03-07
* Description: Cretes a new field dialog for creating an answer set for a new data entry form.
*/

import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Field from '@material-ui/core/Input';
import FieldLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { SCHEMAS, FIELD_TYPES } from '../../util/fieldSchemas-esm';
import { Typography } from '@material-ui/core';
import AnswerSetSelect from '../AnswerSetSelect/AnswerSetSelect';
import RegexSelect from '../RegexSelect/RegexSelect';
import ReliesOnSelect from '../ReliesOnSelect/ReliesOnSelect';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  formControl: {
    marginTop: theme.spacing.unit,
    width: '100%',
  },
  textField: {
    marginTop: theme.spacing.unit,
    width: '100%',
  },
  optionsField: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  errorMessage: {
    color: 'red',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  toolTip: {
    width: '100%',
    whiteSpace: 'pre-line',
  },
});

class NewFieldDialog extends Component {
  state = {
    prompt: '',
    type: '',
    options: '',
    answer_set: null,
    required: false,
    identifying: false,
    unique: false,
    unique_on_false: null,
    relies_on: [],
    regex: '',
    usesAnswerSet: false,
    errors: null,
  };

  componentDidUpdate(prevProps) {
    const { open, field } = this.props;
    if (!prevProps.open && open) {
      if (field) {
        const copy = JSON.parse(JSON.stringify(field));
        copy.options = Array.isArray(field.options) ? field.options.join(', ') : '';
        this.setState({ ...copy, usesAnswerSet: !!copy.answer_set });
      }
    }
  }

  resetState = () => {
    this.setState({
      prompt: '',
      type: '',
      options: '',
      answer_set: null,
      required: false,
      identifying: false,
      unique: false,
      unique_on_false: null,
      relies_on: [],
      regex: '',
      usesAnswerSet: false,
      errors: null,
    });
  };

  hasOptions = () => {
    const { type } = this.state;
    let hasOptions = false;
    Object.keys(SCHEMAS).forEach(schema => {
      if (schema === type && SCHEMAS[schema].options) {
        hasOptions = true;
      }
    });
    return hasOptions;
  };

  handleTypeChange = name => event => {
    this.setState({ [name]: event.target.value, regex: '' });
  };

  handleAnswerSetChange = answer_set => {
    this.setState({ answer_set });
  };

  handleValueChange = name => event => {
    this.setState({ [name]: event.currentTarget.value });
  };

  handleToggleChange = name => () => {
    const toggles = {
      required: this.state.required,
      identifying: this.state.identifying,
      unique: this.state.unique,
      usesAnswerSet: this.state.usesAnswerSet,
      unique_on_false: this.state.unique_on_false,
    };

    toggles[name] = !toggles[name];

    switch (name) {
      case 'identifying':
        if (!toggles.identifying) {
          toggles.unique = false;
        }
        break;
      case 'unique':
        if (toggles.unique) {
          toggles.identifying = true;
        }
        break;
      default:
    }
    this.setState({
      required: toggles.required,
      identifying: toggles.identifying,
      unique: toggles.unique,
      usesAnswerSet: toggles.usesAnswerSet,
      unique_on_false: toggles.unique_on_false,
    });
  };

  handleRegex = regex => {
    if (regex) {
      this.setState({ regex });
    } else {
      this.setState({ regex: '' });
    }
  };

  handleReliesOnChange = relies_on => {
    this.setState({ relies_on });
  };

  handleSubmit = () => {
    const {
      prompt,
      type,
      options,
      answer_set,
      required,
      identifying,
      unique,
      unique_on_false,
      relies_on,
      regex,
      usesAnswerSet,
    } = this.state;
    // copy state
    const newField = JSON.parse(
      JSON.stringify({
        prompt,
        type,
        answer_set: usesAnswerSet ? answer_set : options,
        required,
        identifying,
        unique,
        unique_on_false,
        relies_on,
        regex: regex === '' ? null : regex,
      })
    );
    const errors = this.getFieldErrors(newField);
    if (errors) {
      this.setState({ errors });
    } else {
      this.props.handleAdd(newField);
      this.resetState();
    }
  };

  handleCancel = () => {
    this.props.handleCancel();
    this.resetState();
  };

  getFieldErrors = field => {
    const { getExternalValidationErrors, editing } = this.props;
    const { prompt, type, options, answer_set } = field;
    if (!prompt || prompt.trim() === '') {
      return 'No prompt provided, please give your field a prompt.';
    }
    if (!type || type.trim() === '') {
      return 'No type provided, please choose a field type.';
    }
    if (SCHEMAS[type].options && !((options && options.length) || answer_set)) {
      return `No options or answer set provided, please add either options or an answer set to your ${
        FIELD_TYPES[type]
      }.`;
    }
    const externalError = getExternalValidationErrors(field);
    if (!editing && externalError) {
      return externalError;
    }
    return null;
  };

  isRegexEnabled = () => {
    return this.state.type === 'SHORT_TEXT' || this.state.type === 'NUMBER';
  };

  renderOptionsSection = () => {
    const { classes } = this.props;
    const { options, answer_set, usesAnswerSet } = this.state;
    return this.hasOptions() ? (
      <Fragment>
        <Tooltip title="Populate field options with an answer set">
          <FormControlLabel
            control={
              <Checkbox
                checked={usesAnswerSet}
                onChange={this.handleToggleChange('usesAnswerSet')}
                value="usesAnswerSet"
                color="primary"
              />
            }
            label="Use Answer Set"
          />
        </Tooltip>
        <br />
        {usesAnswerSet ? (
          <AnswerSetSelect answer_set={answer_set} onChangeAnswerSet={this.handleAnswerSetChange} />
        ) : (
          <TextField
            id="options-multiline"
            label="Options"
            multiline
            rowsMax="4"
            value={options}
            onChange={this.handleValueChange('options')}
            className={classes.optionsField}
            margin="normal"
          />
        )}
      </Fragment>
    ) : null;
  };
  getTooltip = () => {
    return (
      <div>
        <li>Text Field: A single line text input</li>
        <li>Text Area: A multiline text input</li>
        <li>Number: A field for entering numbers</li>
        <li>Check Box: An interactive box to check off</li>
        <li>Combo Box: Make a list for users to select from</li>
        <li>Counter: A counter component to keep track of a number a quantity of something</li>
        <li>History Button: A button to display the history of a recaptured item</li>
      </div>
    );
  };

  render() {
    const { open, classes, fieldsBefore, editing } = this.props;
    const {
      prompt,
      type,
      required,
      identifying,
      unique,
      unique_on_false,
      relies_on,
      regex,
      errors,
    } = this.state;

    return (
      <Dialog open={open} onClose={this.handleCancel} aria-labelledby="field-dialog-title">
        <DialogTitle id="field-dialog-title">{editing ? 'Edit' : 'New'} Field</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a new field to your form. Choose the field type, options, and attributes.
          </DialogContentText>
          <Tooltip title="The name of the field" className={classes.toolTip}>
            <TextField
              id="prompt"
              label="Prompt"
              className={classes.textField}
              value={prompt}
              onChange={this.handleValueChange('prompt')}
              margin="normal"
            />
          </Tooltip>

          <FormControl className={classes.formControl}>
            <Tooltip title={<React.Fragment>{this.getTooltip()}</React.Fragment>}>
              <FieldLabel htmlFor="field-type">Field Type</FieldLabel>
            </Tooltip>
            <Select
              value={type}
              onChange={this.handleTypeChange('type')}
              field={<Field name="field-type" id="field-type" />}
            >
              <MenuItem value="" key="none">
                None
              </MenuItem>
              {Object.keys(FIELD_TYPES).map(type => {
                return (
                  <MenuItem value={type} key={type}>
                    {FIELD_TYPES[type]}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {this.renderOptionsSection()}

          {this.isRegexEnabled() ? (
            <RegexSelect
              regex={regex || ''}
              onChangeRegex={this.handleRegex}
              className={classes.RegexSelect}
            />
          ) : null}

          <FormControlLabel
            control={
              <Tooltip title="Field is required for data entry">
                <Checkbox
                  checked={required}
                  onChange={this.handleToggleChange('required')}
                  value="required"
                  color="primary"
                />
              </Tooltip>
            }
            label="Required"
          />
          <FormControlLabel
            control={
              <Tooltip title="Field is an identifying field and therefore required">
                <Checkbox
                  checked={identifying}
                  onChange={this.handleToggleChange('identifying')}
                  value="identifying"
                  color="primary"
                />
              </Tooltip>
            }
            label="Identifying"
          />
          <FormControlLabel
            control={
              <Tooltip title="Field is a unique value and therefore required and identifying">
                <Checkbox
                  checked={unique}
                  onChange={this.handleToggleChange('unique')}
                  value="unique"
                  color="primary"
                />
              </Tooltip>
            }
            label="Unique"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={unique_on_false}
                onChange={this.handleToggleChange('unique_on_false')}
                value="unique_on_false"
                color="primary"
              />
            }
            label="Unique on false"
          />

          <ReliesOnSelect
            relies_on={relies_on}
            fieldsBefore={fieldsBefore}
            onSelectChange={this.handleReliesOnChange}
          />

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
            {editing ? 'Save Field' : 'Add Field'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(NewFieldDialog);
