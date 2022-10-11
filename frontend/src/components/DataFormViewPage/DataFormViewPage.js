/*
* File: DataFromViewPage.js
* Version: 1.01 US170
* Date: 2020-03-03
* Description: Imports the data from the data table and renders the entire data form view page.
*/
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import DataFormTable from '../DataFormTable/DataFormTable';

import { APIContext } from '../APIContext/APIContext';

const dotenv = require("dotenv")
dotenv.config()

class DataFormViewPage extends Component {
  state = {
    rows: [],
    form: null,
  };

  componentDidMount() {
    this.getRows();
  }

  componentDidUpdate() {
    this.getRows();
  }

  getRows = async (force = false) => {

    const { dataForms, match, getEntries, project_id, getProjectName, getAnswerSet, getSessions } = this.props;
    const { form } = this.state;
    const newForm = dataForms.find(f => '' + f.form_id === match.params.form_id);

    if (force || !form || form.form_id !== newForm.form_id) {
      try {


        const entries = await getEntries(project_id, newForm.form_id);
        const sessions = await getSessions(project_id);

        const hasSpeciesCode = (process.env.REACT_APP_BATEMAN_BUILD === 'true')
          && newForm.template_json
              .fields
              .some(f => {return (f.prompt === "Species Code");});

        const speciesAnswerSet = hasSpeciesCode
           && getAnswerSet(getProjectName(project_id) + newForm.form_name + "Species").answers;

        const rows = entries
          .sort((e1, e2) => e2.entry_id - e1.entry_id)
          .map(entry => {
            const entry_json = entry.entry_json;
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
            //comment
            const session = sessions.find(f => f.session_id === entry.session_id);
            row['Date/Time'] = moment(new Date(session["date_created"] * 1000)).format('YYYY/MM/DD HH:mm');
            row['Year'] = moment(new Date(session["date_created"] * 1000)).format('YYYY');
            row['Session ID'] = entry.session_id;

            if (process.env.REACT_APP_BATEMAN_BUILD === 'true') {


              const site = session.session_json.find(f => Object.keys(f)[0] === 'Site');
              if (site) row['Site'] = site['Site'];
              const array = session.session_json.find(f => Object.keys(f)[0] === 'Array');
              if (array) row['Array'] = array['Array'];
              if(hasSpeciesCode) {
                const species = speciesAnswerSet.find(s => {return (s.primary === row['Species Code']);});
                row.Taxa = newForm.form_name;
                if(species) {
                  row.Genus = species.secondary.Genus;
                  row.Species = species.secondary.Species;
                }else {
                  row.Genus = 'unknown';
                  row.Species = 'unknown';
                }
              }
            }
            row.entry = entry;

            return row;
          });

        this.setState({ rows, form: newForm });
      } catch (err) {
        console.error(err);
      }
    }
  };

  render() {
    const { dataForms, match, history } = this.props;
    const form = dataForms.find(form => '' + form.form_id === match.params.form_id);
    if (form) {
      const { rows } = this.state;
      const template = form.template_json;
      let fields = template.fields.filter(f => f.type !== 'HIST_BUTTON');
      const hasSpeciesCode = (process.env.REACT_APP_BATEMAN_BUILD === 'true')
      &&
      form.template_json
             .fields
             .some(f => {return (f.prompt === "Species Code");});
      process.env.REACT_APP_BATEMAN_BUILD === 'true' &&
        fields.unshift({ prompt: 'Array', readonly: true });
      process.env.REACT_APP_BATEMAN_BUILD === 'true' &&
        fields.unshift({ prompt: 'Site', readonly: true });
      fields.unshift({ prompt: 'Session ID', readonly: true });
	  //Removed "readonly: true" from the end of 'Date/Time' to allow the fields to be editable
      fields.unshift({ prompt: 'Date/Time', readonly: true });
      fields.unshift({ prompt: 'Year', readonly: true });
      if(hasSpeciesCode) {
        let sppIndex = fields.findIndex(f => {return (f.prompt === 'Species Code');});
        fields.splice(sppIndex+1,0,{ prompt: 'Genus', readonly: true },{ prompt: 'Species', readonly: true });
        fields.splice(sppIndex,0, { prompt: 'Taxa', readonly: true });
        sppIndex = fields.findIndex(f => {return (f.prompt === "Fence Trap")});
        let tempIndex = fields[sppIndex];
        fields.splice(sppIndex, 1);
        fields.splice(5,0, tempIndex);
        if(form.form_name === "Lizard") {
          sppIndex = fields.findIndex(f => {
            return (f.prompt === "Toe-clip Code")
          });
          tempIndex = fields[sppIndex];
          fields.splice(sppIndex, 1);
          fields.splice(10, 0, tempIndex)

        }
      }

      return <DataFormTable form={form} fields={fields} rows={rows} refetch={this.getRows} />;
    } else {
      history.push('/not-found');
      return null;
    }
  }
}

export default withRouter(props => (
  <APIContext.Consumer>
    {apiProps => <DataFormViewPage {...props} {...apiProps} />}
  </APIContext.Consumer>
));
