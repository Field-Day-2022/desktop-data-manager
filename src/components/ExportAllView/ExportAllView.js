/*
* File: ExportAllView.js
* Version: 1.01 US171
* Date: 2020-03-04
* Description: Allows user to export all data form types.
*/
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import CircularProgress from '@material-ui/core/CircularProgress';

import { APIContext } from '../APIContext/APIContext';
import ExportAllCSV from '../ExportAllCSV/ExportAllCSV';
//test
const styles = theme => ({
  container: {
    marginBottom: 20,
    padding: `10px 20px`,
  },
  detailHeader: {
    marginTop: 10,
    fontSize: 26,
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    margin: theme.spacing.unit * 3,
  },
});
const DataFormType = 'DataForm';
const SessionFormType = 'SessionForm';


class ExportAllView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataForms: this.props.dataForms,
      sessionForms: this.props.sessionForms,
      formType: DataFormType,
      entryRows: undefined,
      sessionRows: undefined,
      dataCalled: false,
    }

    this.state[DataFormType] = this.props.dataForms.reduce((obj, f) => {
      obj[f.form_id] = true;
      return obj;
    }, {});

    this.state[SessionFormType] = this.props.sessionForms.reduce((obj, f) => {
      obj[f.form_id] = true;
      return obj;
    }, {});

    this.handleFormTypeChange = this.handleFormTypeChange.bind(this);
  };

  handleFormTypeChange = event => {
    this.setState({ formType: event.target.value });
  };

  handleFormSelectionChange = id => event => {
    const formStates = { ...this.state[this.state.formType], [id]: event.target.checked };
    this.setState({ [this.state.formType]: formStates });
  };

  getFormNames = (forms) => {
    return Object.values(forms).map((form) => {
      return { id: form.form_id, name: form.form_name };
    });
  };

  componentDidMount() {
    if (!this.state.dataCalled) {
      this.getData();
      this.getSessions()
      this.setState({ dataCalled: true });
    }
  }

  componentDidUpdate() {
    if (!this.state.dataCalled) {
      this.getData();
      this.getSessions()
      this.setState({ dataCalled: true });
    }
  }

  getData = async () => {
    const [sessionRows, entryRows] = await Promise.all([
      this.props.getSessions(this.props.project_id),
      this.props.getEntries(this.props.project_id)
    ]);
    let allSessions = sessionRows
    const sortedEntries = entryRows.sort((e1, e2) => e2.entry_id - e1.entry_id);
    const sortedSession = sessionRows.sort((s1, s2) => s2.session_id - s1.session_id);
    for(let x = 0; x < sortedEntries.length; x++){
      sortedEntries[x]["session_json"] = sortedSession.find(s => s.session_id === sortedEntries[x].session_id).session_json
    }
    console.log("sorted entries ", sortedEntries)


    this.setState({ entryRows: sortedEntries, sessionRows: sortedSession});
  };

  getSelectedForms = () => {
    const allForms = (this.state.formType === DataFormType) ? this.state.dataForms : this.state.sessionForms;
    const selectedFormStates = this.state[this.state.formType];

    return allForms.filter(form => selectedFormStates[form.form_id]);
  };

  getEntries = () => {
    const allRows = (this.state.formType === DataFormType) ? this.state.entryRows : this.state.sessionRows;
    const selectedRows = this.state[this.state.formType];
    return allRows.filter(row => selectedRows[row.form_id]);
  };

  getSessions = async () => {

    const sessions =  await this.props.getSessions(this.props.project_id)
    this.setState({ allSessions: sessions});
  };



  render() {
    const { classes, dataForms, sessionForms } = this.props;

    const forms = this.state.formType === DataFormType ? dataForms : sessionForms;

    const checkboxes = this.getFormNames(forms).map((f) => {
      return <FormControlLabel key={f.id}
        control={
          <Checkbox
            checked={this.state[this.state.formType][f.id]}
            onChange={this.handleFormSelectionChange(f.id)}
            value={f.name} />
        }
        label={f.name} />
    });

    return (
      <Paper className={classes.container}>
        <h3 className={classes.detailHeader}>Export Data From Multiple Forms Into One CSV File</h3>
        <p>The exported file will contain the column headers and values in each of the selected forms.</p>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Select Form Type</FormLabel>
          <RadioGroup
            aria-label="Form Type"
            name="formType"
            className={classes.group}
            value={this.state.formType}
            onChange={this.handleFormTypeChange} >
            <FormControlLabel value={SessionFormType} control={<Radio />} label="Session Forms" />
            <FormControlLabel value={DataFormType} control={<Radio />} label="Data Forms" />
          </RadioGroup>
        </FormControl>
        <Divider />
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Please select the forms to include in the file.</FormLabel>
          <FormGroup>
            {checkboxes}
          </FormGroup>
        </FormControl>
        <Divider />
        {(this.state.entryRows === undefined || this.state.sessionRows === undefined)
          ? <div className={classes.progressContainer}>
              <CircularProgress color="primary" />
              <p className={classes.detailHeader}>Loading Data</p>
            </div>
          : <ExportAllCSV {...this.props}
                selectedRows={this.getEntries()}
                selectedForms={this.getSelectedForms()}

              />}
      </Paper>
    );
  }
};

export default withStyles(styles)(props => (
  <APIContext.Consumer>
    {apiProps => <ExportAllView {...props} {...apiProps} />}
  </APIContext.Consumer>
));
