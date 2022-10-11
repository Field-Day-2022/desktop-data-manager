/*
* File: AnswerSetPopup.js
* Version: 1.01 US167
* Date: 2020-03-01
* Description: Builds the answer response and displays it to the user as a popup.
*/
import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import FormBuilderToolbar from '../FormBuilderToolbar/FormBuilderToolbar';
import AnswerSetBuilder from '../AnswerSetBuilder/AnswerSetBuilder';
import TextField from '@material-ui/core/TextField';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CSVImport from '../CSVImport/CSVImport';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  paper: {
    marginLeft: 15,
    marginBottom: 0,
  },
  sectionTitle: {
    margin: 15,
    paddingTop: 15,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  errorText: {
    color: '#FFFFFF',
  },
  answerHead: { display: 'flex', alignItems: 'center' },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AnswerSetPopup extends Component {
  state = {
    set_name: '',
    secondary_keys: [],
    answers: [],
    errors: null,
    id: null,
    secondaryOpen: false,
    deleteDialog: false,
    newField: '',
    deleteIndex: null,
  };

  componentDidUpdate(prevProps) {
    const { open, set } = this.props;
    if (!prevProps.open && open) {
      if (set) {
        this.setState({
          ...set,
          secondary_keys: set.secondary_keys,
          answers: set.answers,
        });
      }
    }
  }

  resetState = () => {
    this.setState({
      set_name: '',
      answers: [],
      secondary_keys: [],
      errors: null,
      id: null,
      newField: '',
    });
  };

  handleNameInput = event => {
    this.setState({
      set_name: event.currentTarget.value,
    });
  };

  handleCancel = () => {
    this.props.onClose();
    this.resetState();
  };

  handleCreate = () => {
    const { set_name, secondary_keys, answers, id } = this.state;
    const newSet = JSON.parse(
      JSON.stringify({
        set_name,
        secondary_keys: JSON.stringify(secondary_keys),
        answers: JSON.stringify(answers),
        id: id || Math.round(Date.now() / 1000),
      })
    );
    const errors = this.getInputErrors(newSet);
    if (errors) {
      this.setState({ errors });
    } else {
      newSet.date_modified = Math.round(Date.now() / 1000);
      this.props.onClose(newSet);
      this.resetState();
    }
  };

  handleAnswerAdd = answers => {
    this.setState({ answers });
  };

  getInputErrors = form => {
    const { set_name, answers } = form;
    if (!set_name || set_name.trim() === '') {
      return 'No name provided, please name your answer set.';
    }
    if (!answers || !answers.length) {
      return 'No answers provided, please add at least one answer.';
    }
    return null;
  };

  handleSecondaryOpen = () => {
    this.setState({ secondaryOpen: true });
  };

  handleSecondaryClose = () => {
    this.setState({ secondaryOpen: false, newField: '' });
  };

  handleSecondaryCancel = () => {
    this.setState({ secondaryOpen: false });
  };

  handleSecClick = index => {
    this.setState({ deleteDialog: true, deleteIndex: index });
  };

  handleNewField = () => {
    const { secondary_keys, newField } = this.state;
    let newSecFields = [];

    if (secondary_keys != null) {
      if (secondary_keys.includes(newField)) {
        this.setState({ errors: 'Error: Field already exists', secondaryOpen: false });
      } else {
        newSecFields = [...this.state.secondary_keys];
        newSecFields.push(newField);
        this.setState({
          secondary_keys: newSecFields,
          secondaryOpen: false,
          newField: '',
          errors: null,
        });
      }
    } else {
      newSecFields.push(newField);
      this.setState({
        secondary_keys: newSecFields,
        secondaryOpen: false,
        newField: '',
        errors: null,
      });
    }
  };

  handleChange = event => {
    this.setState({ newField: event.currentTarget.value });
  };

  handleDeleteCancel = () => {
    const newSecFields = [...this.state.secondary_keys];
    newSecFields.push(this.state.newField);
    this.setState({ deleteDialog: false });
  };

  handleDelete = () => {
    const { deleteIndex, secondary_keys } = this.state;
    const newSecFields = secondary_keys;
    this.setState({
      secondary_keys: [
        ...newSecFields.slice(0, deleteIndex),
        ...newSecFields.slice(deleteIndex + 1),
      ],
      deleteIndex: null,
      deleteDialog: false,
    });
  };

  handleImport = answers => {
    this.setState({ set: answers });
  };

  render() {
    const { set_name, errors, answers, secondary_keys, newField } = this.state;
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
                Answer Set Builder
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

          <div>
            <div className={classes.answerHead}>
              <FormBuilderToolbar name={set_name} onName={this.handleNameInput} />
              {!secondary_keys || secondary_keys.length === 0 ? (
                <CSVImport onImport={this.handleImport} />
              ) : null}
            </div>
            {answers.length <= 50 ? (
              <Fragment>
                <Paper className={classes.paper}>
                  <Typography variant="h6" className={classes.sectionTitle}>
                    Secondary Fields
                  </Typography>
                  <Divider />
                  {secondary_keys
                    ? secondary_keys.map((entry, index) => (
                        <div key={entry}>
                          <List>
                            <ListItem
                              button
                              id={index}
                              onClick={() => this.handleSecClick(index)}
                              key={entry}
                              className={classes.secondary_keys}
                            >
                              <ListItemText primary={entry} />
                            </ListItem>
                            <Divider />
                          </List>
                        </div>
                      ))
                    : null}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSecondaryOpen}
                    className={classes.secondaryAddButton}
                    fullWidth
                  >
                    Add Secondary Field
                  </Button>
                </Paper>
              </Fragment>
            ) : null}

            <Dialog
              open={this.state.secondaryOpen}
              onClose={this.handleSecondaryClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{'New Secondary Field'}</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label={'Field Name'}
                  type="text"
                  onChange={this.handleChange}
                  value={newField}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleSecondaryCancel} color="primary">
                  Cancel
                </Button>
                <Button onClick={this.handleNewField} color="primary">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={this.state.deleteDialog}
              onClose={this.handleDeleteCancel}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{'Secondary Fields'}</DialogTitle>
              <DialogContent>Do you really want to delete this field?</DialogContent>
              <DialogActions>
                <Button onClick={this.handleDeleteCancel} color="primary">
                  Cancel
                </Button>
                <Button onClick={this.handleDelete} color="primary">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>

          <AnswerSetBuilder
            answers={answers}
            onAnswerAdd={this.handleAnswerAdd}
            globalSecondaryFields={secondary_keys}
          />
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AnswerSetPopup);
