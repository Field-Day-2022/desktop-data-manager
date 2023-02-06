/*
 * File: ExportAllCSV.js
 * Version: 1.01 US171
 * Date: 2020-03-04
 * Description: Takes all data and creates a CSV file that the user can download for record.
 */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { APIContext } from '../APIContext/APIContext';
import { CSVLink } from 'react-csv';

const styles = (theme) => ({
    container: {
        marginBottom: 20,
        padding: `10px 20px`,
    },
    detailHeader: {
        marginTop: 10,
        fontSize: 26,
    },
    group: {
        margin: `${theme.spacing.unit * 3}px 0`,
    },
});

class ExportAllCSV extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: this.props.forms,
            rows: this.props.rows,
        };
    }

    getRows = (headers) => {
        const {
            sessionForms,
            dataForms,
            selectedRows,
            answerSets,
            projects,
            project_id,
            allSessions,
        } = this.props;
        console.log('all sessions ', allSessions);
        const project = projects.find((p) => p.project_id === project_id);
        const forms = [...sessionForms, ...dataForms];
        let formSpp = [];
        //Check if the forms have a Species Code prompt and an associated species answer set
        process.env.REACT_APP_BATEMAN_BUILD === 'true' &&
            forms.forEach((f) => {
                const template = f.template_json;
                const hasSpeciesCode = !f.is_session_form
                    ? template.fields
                          .filter((f) => f.type !== 'HIST_BUTTON')
                          .some((f) => {
                              return f.prompt === 'Species Code';
                          })
                    : [
                          ...template.start.fields.filter((f) => f.type !== 'HIST_BUTTON'),
                          ...template.end.fields.filter((f) => f.type !== 'HIST_BUTTON'),
                      ].some((f) => {
                          return f.prompt === 'Species Code';
                      });

                if (hasSpeciesCode) {
                    const answerSet = answerSets.find((s) => {
                        return s.set_name === project.project_name + f.form_name + 'Species';
                    });
                    const speciesAnswerSet = answerSet && answerSet.answers;
                    formSpp[f.form_id] = {
                        hasSpeciesCode: true,
                        speciesAnswerSet: speciesAnswerSet,
                        form_name: f.form_name,
                    };
                } else {
                    formSpp[f.form_id] = { hasSpeciesCode: false };
                }
            });
        const rows = selectedRows.map((entry) => {
            const json = entry.entry_json ? entry.entry_json : entry.session_json;
            const row = json.reduce((a, c) => ({ ...a, ...c }), {});

            headers.forEach((header) => {
                if (row.hasOwnProperty(header.key) && typeof row[header.key] === 'boolean') {
                    row[header.key] = row[header.key].toString();
                } else if (row.hasOwnProperty(header.key) && row[header.key] === null) {
                    row[header.key] = 'N/A';
                } else if (!row.hasOwnProperty(header.key)) {
                    row[header.key] = 'N/A';
                }
            });

            if (entry.hasOwnProperty('entry_id')) {
                row['Year'] = moment(new Date(entry.entry_id * 1000)).format('YYYY');
                row['Date/Time'] = moment(new Date(entry.entry_id * 1000)).format(
                    'YYYY/MM/DD HH:mm:ss'
                );
                row['Session Date/Time'] = moment(new Date(entry.session_id * 1000)).format(
                    'YYYY/MM/DD HH:mm:ss'
                );
            } else {
                row['Year'] = moment(new Date(entry.session_id * 1000)).format('YYYY');
                row['Date/Time'] = moment(new Date(entry.session_id * 1000)).format(
                    'YYYY/MM/DD HH:mm:ss'
                );
            }
            row['Session ID'] = entry.session_id;

            if (process.env.REACT_APP_BATEMAN_BUILD === 'true') {
                const session = entry.session_json;
                console.log('session');
                const site = session.find((f) => Object.keys(f)[0] === 'Site');
                if (site) row['Site'] = site['Site'];
                const array = session.find((f) => Object.keys(f)[0] === 'Array');
                if (array) row['Array'] = array['Array'];

                const formSpecies = formSpp[entry.form_id];
                if (formSpecies.hasSpeciesCode) {
                    const species =
                        formSpecies.speciesAnswerSet &&
                        formSpecies.speciesAnswerSet.find((s) => {
                            return s.primary === row['Species Code'];
                        });
                    row.Taxa = formSpecies.form_name;
                    if (species) {
                        row.Genus = species.secondary.Genus;
                        row.Species = species.secondary.Species;
                    } else {
                        row.Genus = 'Unknown';
                        row.Species = 'Unknown';
                    }
                }
            }

            return row;
        });
        return rows;
    };

    getHeaders = (forms) => {
        let headers = [];
        forms.forEach((form) => {
            const template = form.template_json;
            const fields = !form.is_session_form
                ? template.fields.filter((f) => f.type !== 'HIST_BUTTON')
                : [
                      { prompt: 'Year', readonly: true },
                      { prompt: 'Date/Time', readonly: true },
                      ...template.start.fields.filter((f) => f.type !== 'HIST_BUTTON'),
                      ...template.end.fields.filter((f) => f.type !== 'HIST_BUTTON'),
                  ];

            if (!form.is_session_form) {
                process.env.REACT_APP_BATEMAN_BUILD === 'true' &&
                    fields.unshift({ prompt: 'Array', readonly: true });
                process.env.REACT_APP_BATEMAN_BUILD === 'true' &&
                    fields.unshift({ prompt: 'Site', readonly: true });
                fields.unshift({ prompt: 'Date/Time', readonly: true });
                fields.unshift({ prompt: 'Year', readonly: true });

                const hasSpeciesCode =
                    process.env.REACT_APP_BATEMAN_BUILD === 'true' &&
                    fields.some((f) => {
                        return f.prompt === 'Species Code';
                    });

                const yearIndex = fields.findIndex((f) => {
                    return f.prompt === 'Year';
                });
                fields.splice(yearIndex + 1, 0, { prompt: 'Session Date/Time', readonly: true });

                if (hasSpeciesCode) {
                    let sppIndex = fields.findIndex((f) => {
                        return f.prompt === 'Species Code';
                    });
                    fields.splice(
                        sppIndex + 1,
                        0,
                        { prompt: 'Genus', readonly: true },
                        { prompt: 'Species', readonly: true }
                    );
                    fields.splice(sppIndex, 0, { prompt: 'Taxa', readonly: true });
                    sppIndex = fields.findIndex((f) => {
                        return f.prompt === 'Fence Trap';
                    });
                    let tempIndex = fields[sppIndex];
                    fields.splice(sppIndex, 1);
                    fields.splice(5, 0, tempIndex);
                    if (form.form_name === 'Lizard') {
                        sppIndex = fields.findIndex((f) => {
                            return f.prompt === 'Toe-clip Code';
                        });
                        tempIndex = fields[sppIndex];
                        fields.splice(sppIndex, 1);
                        fields.splice(10, 0, tempIndex);
                    }
                }
            }

            fields.forEach((f) => {
                const exists = headers.some((h) => {
                    return f.prompt === h.key;
                });

                if (!exists) {
                    headers.push({ key: f.prompt, label: f.prompt });
                }
            });
        });

        return headers;
    };

    render() {
        const { classes, selectedForms } = this.props;
        const headers = this.getHeaders(selectedForms);
        const rows = this.getRows(headers);
        return (
            <div>
                {selectedForms.length === 0 ? (
                    <h3>No form selected. Please select at least one form to export data.</h3>
                ) : (
                    <CSVLink
                        filename={
                            'exported-data_' + moment(new Date()).format('YYYYMMDD-HHmmss') + '.csv'
                        }
                        headers={headers}
                        data={rows}
                    >
                        <Button className={classes.group} variant="contained" color="primary">
                            Download CSV
                        </Button>
                    </CSVLink>
                )}
            </div>
        );
    }
}

export default withStyles(styles)((props) => (
    <APIContext.Consumer>
        {(apiProps) => <ExportAllCSV {...props} {...apiProps} />}
    </APIContext.Consumer>
));
