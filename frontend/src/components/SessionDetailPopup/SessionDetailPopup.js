/*
* File: SessionDetailPopup.js
* Version: 1.01
* Date: 2020-03-07
* Description: Contains the information for a popup which contructs: dataForms,
* getEntries, project_id, row, getProjectName, getAnswerSet, date and returns
* a dataform with the information that has been input by the user actor.
*/

import React, { Component } from 'react';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import { APIContext } from '../APIContext/APIContext';
import SessionDetailCard from '../SessionDetailCard/SessionDetailCard';
import DataFormTable from '../DataFormTable/DataFormTable';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  paddingContainer: {
    padding: 20,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SessionDetailPopup extends Component {
  state = {
    entries: [],
  };

  getRows = async () => {
    const { dataForms, getEntries, project_id, row, getProjectName, getAnswerSet } = this.props;
    try {
      const data = await getEntries(project_id, null, row.session.session_id);
      let formSpp = [];
      //Check if the forms have a Species Code prompt and an associated species answer set
      (process.env.REACT_APP_BATEMAN_BUILD === 'true')  && dataForms.forEach(f => {
        const hasSpeciesCode = JSON.parse(f.template_json)
          .fields
          .some(f => {return (f.prompt === "Species Code");});
          
        if (hasSpeciesCode) {
          const speciesAnswerSet = hasSpeciesCode 
              && JSON.parse(getAnswerSet(getProjectName(project_id) + f.form_name + "Species").answers);
          formSpp[f.form_id] = {hasSpeciesCode: true, speciesAnswerSet: speciesAnswerSet, form_name: f.form_name};
        }else {
          formSpp[f.form_id] = {hasSpeciesCode: false};
        }
      });
    
      const entries = data
        .sort((e1, e2) => e2.entry_id - e1.entry_id)
        .map(entry => {
          const entry_json = JSON.parse(entry.entry_json);
          const row = entry_json.reduce((a, c) => ({ ...a, ...c }), {});
          for (const property in row) {
            if (row.hasOwnProperty(property)) {
              if (typeof row[property] === 'boolean') {
                row[property] = row[property].toString();
              } else if (row[property] === null) {
                row[property] = 'N/A';
              }
            }
          }
          row['Year'] = moment(new Date(entry.date_created * 1000)).format('YYYY');
          row['Date/Time'] = moment(new Date(entry.date_created * 1000)).format('YYYY/MM/DD HH:mm');
          row['Session ID'] = entry.session_id;
          if (process.env.REACT_APP_BATEMAN_BUILD === 'true') {
            const session = JSON.parse(entry.session_json);
            const site = session.find(f => Object.keys(f)[0] === 'Site');
            if (site) row['Site'] = site['Site'];
            const array = session.find(f => Object.keys(f)[0] === 'Array');
            if (array) row['Array'] = array['Array'];

            const formSpecies = formSpp[entry.form_id];
            if(formSpecies.hasSpeciesCode) {
              const species = formSpecies.speciesAnswerSet.find(s => {return (s.primary === row['Species Code']);});
              row.Taxa = formSpecies.form_name;
              row.Genus = species.secondary.Genus;
              row.Species = species.secondary.Species;
            }
          }
          row.form_id = entry.form_id;
          row.entry = entry;
          return row;
        });
      this.setState({ entries });
    } catch (err) {
      console.error(err);
    }
  };

  async componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this.getRows();
    }
  }

  render() {
    const { open, classes, form, row, dataForms, onClose } = this.props;
    const { entries } = this.state;

    const entryTableData = {};

    entries.forEach(entry => {
      if (!entryTableData[entry.form_id]) {
        entryTableData[entry.form_id] = {
          form: dataForms.find(f => f.form_id === entry.form_id),
          entries: [entry],
        };
      } else {
        entryTableData[entry.form_id].entries.push(entry);
      }
    });

    return open ? (
      <div>
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={onClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                Session Viewer
              </Typography>
              <Button color="inherit" onClick={onClose}>
                Done
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.paddingContainer}>
            <SessionDetailCard title={form.form_name} row={row} />
            {Object.values(entryTableData).map(data => {
              const template = JSON.parse(data.form.template_json);
              const fields = template.fields.filter(f => f.type !== 'HIST_BUTTON');
              process.env.REACT_APP_BATEMAN_BUILD === 'true' &&
                fields.unshift({ prompt: 'Array', readonly: true });
              process.env.REACT_APP_BATEMAN_BUILD === 'true' &&
                fields.unshift({ prompt: 'Site', readonly: true });
              fields.unshift({ prompt: 'Session ID' });
			  //Removed "readonly: true" from the end of 'Date/Time' to allow the fields to be editable
              fields.unshift({ prompt: 'Date/Time' });
			  //Removed "readonly: true" from the end of 'Year' to allow the fields to be editable
              fields.unshift({ prompt: 'Year' });

              const hasSpeciesCode = (process.env.REACT_APP_BATEMAN_BUILD === 'true') 
                && fields.some(f => {return (f.prompt === "Species Code");});

              if(hasSpeciesCode) {
                const sppIndex = fields.findIndex(f => {return (f.prompt === 'Species Code');});
                fields.splice(sppIndex+1,0,{ prompt: 'Genus', readonly: true },{ prompt: 'Species', readonly: true });
                fields.splice(sppIndex,0, { prompt: 'Taxa', readonly: true });
              }
              return (
                <DataFormTable
                  key={data.form.form_id}
                  form={data.form}
                  fields={fields}
                  rows={data.entries}
                  refetch={this.getRows}
                />
              );
            })}
          </div>
        </Dialog>
      </div>
    ) : null;
  }
}

export default withStyles(styles)(props => (
  <APIContext.Consumer>
    {apiProps => <SessionDetailPopup {...props} {...apiProps} />}
  </APIContext.Consumer>
));
