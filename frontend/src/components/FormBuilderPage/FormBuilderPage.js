/*
* File: FormBuilderPage.js
* Version: 1.01 US172
* Date: 2020-03-04
* Description: This page handles and builds new user data forms.
*/
import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import DataFormPopup from '../DataFormPopup/DataFormPopup';
import SessionFormPopup from '../SessionFormPopup/SessionFormPopup';
import AnswerSetPopup from '../AnswerSetPopup/AnswerSetPopup';
import { APIContext } from '../APIContext/APIContext';

const styles = {
  createButton: {},
  formList: {
    marginTop: 20,
  },
  formListTitle: {
    padding: 10,
  },
  listContainer: {
    padding: 0,
  },
};

class FormBuilderPage extends Component {
  state = {
    openPopup: null,
    dataForms: [],
    sessionForms: [],
    selectedFormID: null,
    selectedAnswerSet: null,
  };

  handleNewDataFormClick = event => {
    this.setState({ openPopup: 'data' });
  };

  handleNewSessionFormClick = event => {
    this.setState({ openPopup: 'session' });
  };

  handleNewAnswerSetClick = event => {
    this.setState({ openPopup: 'answerSet' });
  };

  handleFormOpen = (form_id, is_session_form = false) => event => {
    event.preventDefault();
    this.setState({
      openPopup: is_session_form ? 'session' : 'data',
      selectedFormID: form_id,
    });
  };

  handleAnswerSetOpen = set_name => event => {
    event.preventDefault();
    this.setState({
      openPopup: 'answerSet',
      selectedAnswerSet: set_name,
    });
  };

  handleFormPopupClose = async (form, is_session_form = false) => {
    const { addDataForm, addSessionForm, fetchData } = this.props;
    if (form) {
      await (is_session_form ? addSessionForm(form) : addDataForm(form));
      fetchData();
    }
    this.setState({ openPopup: null, selectedFormID: null });
  };

  handleAnswerSetClose = async set => {
    const { addAnswerSet, fetchData } = this.props;
    if (set) {
      await addAnswerSet(set);
      fetchData();
    }
    this.setState({ openPopup: null, selectedAnswerSet: null });
  };

  renderDataFormList = () => {
    const { dataForms } = this.props;
    return dataForms.length ? (
      dataForms.map((form, index) => {
        return (
          <div key={form.form_id}>
            {index > 0 ? <Divider /> : null}
            <ListItem button>
              <ListItemText primary={form.form_name} onClick={this.handleFormOpen(form.form_id)} />
            </ListItem>
          </div>
        );
      })
    ) : (
      <ListItem>
        <ListItemText primary="No forms added." />
      </ListItem>
    );
  };

  renderSessionFormList = () => {
    const { sessionForms } = this.props;
    return sessionForms.length ? (
      sessionForms.map((form, index) => {
        return (
          <div key={form.form_id}>
            {index > 0 ? <Divider /> : null}
            <ListItem button>
              <ListItemText
                primary={form.form_name}
                onClick={this.handleFormOpen(form.form_id, true)}
              />
            </ListItem>
          </div>
        );
      })
    ) : (
      <ListItem>
        <ListItemText primary="No forms added." />
      </ListItem>
    );
  };

  renderAnswerSetList = () => {
    const { answerSets } = this.props;
    return answerSets.length ? (
      answerSets.map((set, index) => {
        return (
          <div key={set.set_name}>
            {index > 0 ? <Divider /> : null}
            <ListItem button>
              <ListItemText
                primary={set.set_name}
                onClick={this.handleAnswerSetOpen(set.set_name)}
              />
            </ListItem>
          </div>
        );
      })
    ) : (
      <ListItem>
        <ListItemText primary="No answer sets added." />
      </ListItem>
    );
  };

  render() {
    const { classes, dataForms, sessionForms, answerSets } = this.props;
    const { openPopup, selectedFormID, selectedAnswerSet } = this.state;
    const selectedForm = (openPopup === 'data' ? dataForms : sessionForms).find(
      form => form.form_id === selectedFormID
    );

    const selectedSet = answerSets.find(set => set.set_name === selectedAnswerSet);

    return (
      <Fragment>
        <Paper className="App-page-paper">
          <Typography variant="h5" component="h3">
            Form Builder
          </Typography>
          <Typography component="p">
            View, create, and modify forms for data collection. Data Forms describe individual
            observations of a single entity type. Session Forms describe a collection of data
            entries across multiple different Data Forms.
          </Typography>
        </Paper>
        <Paper className={classes.formList}>
          <Typography variant="h5" className={classes.formListTitle}>
            Data Forms
          </Typography>
          <Divider />
          <List className={classes.listContainer}>{this.renderDataFormList()}</List>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={this.handleNewDataFormClick}
            fullWidth
          >
            New Data Form
          </Button>
        </Paper>
        <Paper className={classes.formList}>
          <Typography variant="h5" className={classes.formListTitle}>
            Session Forms
          </Typography>
          <Divider />
          <List className={classes.listContainer}>{this.renderSessionFormList()}</List>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={this.handleNewSessionFormClick}
            fullWidth
          >
            New Session Form
          </Button>
        </Paper>
        <Paper className={classes.formList}>
          <Typography variant="h5" className={classes.formListTitle}>
            Answer Sets
          </Typography>
          <Divider />
          <List className={classes.listContainer}>{this.renderAnswerSetList()}</List>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={this.handleNewAnswerSetClick}
            fullWidth
          >
            New Answer Set
          </Button>
        </Paper>
        <DataFormPopup
          open={openPopup === 'data'}
          onClose={this.handleFormPopupClose}
          form={selectedForm}
        />
        <SessionFormPopup
          open={openPopup === 'session'}
          onClose={this.handleFormPopupClose}
          form={selectedForm}
        />
        <AnswerSetPopup
          open={openPopup === 'answerSet'}
          onClose={this.handleAnswerSetClose}
          set={selectedSet}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(props => (
  <APIContext.Consumer>
    {apiProps => <FormBuilderPage {...props} {...apiProps} />}
  </APIContext.Consumer>
));
