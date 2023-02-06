/*
 * File: DataFromTable.js
 * Version: 1.01 US170
 * Date: 2020-03-03
 * Description: Handles and renders data when user decides to view all data in table data forms.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import APIService from '../APIService/APIService';

import { AuthContext } from '../AuthContext/AuthContext';
import { APIContext } from '../APIContext/APIContext';

const styles = (theme) => ({
    root: {
        marginBottom: 20,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

class DataFormTable extends React.Component {
    apiService = new APIService();

    onRowUpdate = (newData, oldData) => {
        console.log('oldData', oldData);
        const { putEntry, refetch, moveEntry } = this.props;

        return new Promise(async (resolve, reject) => {
            const answers = newData.entry.entry_json;

            answers.forEach((f, i) => {
                const key = Object.keys(f)[0];

                let value = newData[key];
                if (value === 'true') value = true;
                if (value === 'false') value = false;
                if (value === 'N/A') value = null;
                answers[i] = { [key]: value };
            });

            const entryCopy = JSON.parse(JSON.stringify(newData.entry));
            entryCopy.date_modified = Math.round(Date.now() / 1000);
            entryCopy.entry_json = answers;
            console.log('ENTRY COPY ', entryCopy);
            try {
                await putEntry(entryCopy);
                refetch(true);
                resolve();
            } catch (err) {
                console.error(err);
                reject();
            }
        });
    };

    onRowDelete = (oldData) => {
        const { deleteEntry, refetch } = this.props;

        return new Promise(async (resolve, reject) => {
            try {
                await deleteEntry(oldData.entry.session_id, oldData.entry.entry_id);
                refetch(true);
                resolve();
            } catch (err) {
                console.error(err);
                reject();
            }
        });
    };

    render() {
        // This section determines that the access_level is regarded in the column setup.
        const { classes, form, fields, rows, access_level } = this.props;

        rows.forEach((row) => {
            fields.forEach((field) => {
                if (typeof row[field.prompt] === 'object') {
                    row[field.prompt] = 'N/A';
                }
            });
        });

        return (
            <Paper className={classes.root}>
                <MaterialTable
                    // This section determines that the access_level parameter is set to readonly regardless
                    // of the admin privilages under the editable section of this table.
                    columns={fields.map((f) => ({
                        title: f.prompt,
                        field: f.prompt,
                        readonly: !!f.readonly,
                    }))}
                    data={rows}
                    title={form.form_name + ' - Entries'}
                    options={{
                        columnsButton: true,
                        emptyRowsWhenPaging: false,
                        exportButton: true,
                        filtering: true,
                        paging: true,
                        pageSize: 15,
                        pageSizeOptions: [15, 50, 100, rows.length],
                    }}
                    // This section defines the ability to edit the table to access_level === 2.
                    // This means the admin is the only use to be able to edit this section of
                    // the table.
                    editable={
                        access_level === 2
                            ? {
                                  onRowUpdate: this.onRowUpdate,
                                  onRowDelete: this.onRowDelete,
                              }
                            : undefined
                    }
                    color="primary"
                />
            </Paper>
        );
    }
}

DataFormTable.propTypes = {
    classes: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    rows: PropTypes.array.isRequired,
};

export default withStyles(styles)((props) => (
    <AuthContext.Consumer>
        {({ access_level }) => (
            <APIContext.Consumer>
                {({ putEntry, deleteEntry, moveEntry }) => (
                    <DataFormTable
                        {...props}
                        putEntry={putEntry}
                        deleteEntry={deleteEntry}
                        moveEntry={moveEntry}
                        access_level={access_level}
                    />
                )}
            </APIContext.Consumer>
        )}
    </AuthContext.Consumer>
));
