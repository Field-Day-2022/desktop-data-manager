/*
* File: FieldListBuilder.js
* Version: 1.01 US172
* Date: 2020-03-04
* Description: Allows user to build a field list and handle the state of that list.
*/
import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import NewFieldDialog from '../NewFieldDialog/NewFieldDialog';

import { FIELD_TYPES } from '../../util/fieldSchemas-esm';

const styles = theme => ({
  sectionTitle: {
    margin: 15,
  },
  paper: {
    margin: 15,
  },
});

class FieldListBuilder extends Component {
  state = {
    fieldDialogOpen: false,
    selectedFieldIndex: null,
  };

  resetState = () => {
    this.setState({
      fieldDialogOpen: false,
      selectedFieldIndex: null,
    });
  };

  handleOpenFieldDialog = () => {
    this.setState({ fieldDialogOpen: true, selectedFieldIndex: null });
  };

  handleFieldCancel = () => {
    this.setState({ fieldDialogOpen: false, selectedFieldIndex: null });
  };

  handleFieldAdd = field => {
    const { selectedFieldIndex } = this.state;
    const { fields, onFieldAdd } = this.props;
    if (selectedFieldIndex !== null) {
      fields[selectedFieldIndex] = field;
    } else {
      fields.push(field);
    }
    onFieldAdd(fields);
    this.setState({ fieldDialogOpen: false, selectedFieldIndex: null });
  };

  handleFieldClick = index => () => {
    this.setState({ fieldDialogOpen: true, selectedFieldIndex: index });
  };

  buildSecondaryString = field => {
    return FIELD_TYPES[field.type];
  };

  renderFieldList = () => {
    const { classes, fields } = this.props;
    return fields.length ? (
      fields.map((field, index) => {
        return (
          <div key={index}>
            {index > 0 ? <Divider /> : null}
            <ListItem button onClick={this.handleFieldClick(index)}>
              <ListItemText primary={field.prompt} secondary={this.buildSecondaryString(field)} />
            </ListItem>
          </div>
        );
      })
    ) : (
      <ListItem>
        <ListItemText className={classes.noFields} primary="No fields added." />
      </ListItem>
    );
  };

  render() {
    const { fieldDialogOpen, selectedFieldIndex } = this.state;
    const { classes, title, fields, getExternalValidationErrors } = this.props;

    const selectedField = selectedFieldIndex !== null ? fields[selectedFieldIndex] : null;

    const fieldsBefore = selectedField
      ? fields.slice(0, selectedFieldIndex).map(f => f.prompt)
      : [];

    return (
      <Fragment>
        <Paper className={classes.paper}>
          <Typography variant="h6" className={classes.sectionTitle}>
            {title || 'Form Fields'}
          </Typography>
          <Divider />
          <List>{this.renderFieldList()}</List>

          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.addButton}
              onClick={this.handleOpenFieldDialog}
              fullWidth
            >
              Add Field
            </Button>
          </div>
        </Paper>
        <NewFieldDialog
          open={fieldDialogOpen}
          fieldsBefore={fieldsBefore}
          handleCancel={this.handleFieldCancel}
          handleAdd={this.handleFieldAdd}
          field={selectedField}
          getExternalValidationErrors={getExternalValidationErrors}
          editing={selectedFieldIndex !== null}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(FieldListBuilder);
