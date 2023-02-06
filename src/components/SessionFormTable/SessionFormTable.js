/*
 * File: SessionFormTable.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Creates a data table for adding new data into a session.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';

import { APIContext } from '../APIContext/APIContext';
import { AuthContext } from '../AuthContext/AuthContext';
import SessionDetailPopup from '../SessionDetailPopup/SessionDetailPopup';
import { DeleteSessionDialog } from '../DeleteSessionDialog/DeleteSessionDialog';
import APIService from '../APIService/APIService';

const styles = (theme) => ({
    root: {
        width: '100%',
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

class SessionFormTable extends React.Component {
    apiService = new APIService();

    state = {
        detailDialogOpen: false,
        deleteDialogOpen: false,
        sessionToDelete: null,
        clickedRow: null,
        count: 0,
    };

    onSessionClick = (event, data) => {
        this.setState({ detailDialogOpen: true, clickedRow: data });
    };

    onSessionDetailClose = () => {
        this.setState({ detailDialogOpen: false, clickedRow: null });
    };

    onRowUpdate = (newData) => {
        const { putSession, refetch } = this.props;

        return new Promise(async (resolve, reject) => {
            const answers = newData.session.session_json;

            answers.forEach((f, i) => {
                const key = Object.keys(f)[0];
                let value = newData[key];
                if (value === 'true') value = true;
                if (value === 'false') value = false;
                if (value === 'N/A') value = null;
                answers[i] = { [key]: value };
            });

            const sessionCopy = newData.session;
            sessionCopy.session_json = answers;
            sessionCopy.date_created = Math.round(Date.parse(newData['Date/Time']) / 1000);
            sessionCopy.date_modified = Math.round(Date.now() / 1000);

            try {
                await putSession(sessionCopy);
                refetch(true);
                resolve();
            } catch (err) {
                console.error(err);
                reject();
            }
        });
    };

    onRowDelete = async (oldData) => {
        const { project_id, getEntries } = this.props;
        const data = await getEntries(project_id, null, oldData.session.session_id);
        this.setState({
            deleteDialogOpen: true,
            sessionToDelete: oldData.session.session_id,
            count: data.length,
        });
    };

    onDelete = async () => {
        const { deleteSession, refetch } = this.props;
        const { sessionToDelete } = this.state;
        try {
            await deleteSession(sessionToDelete);
            refetch(true);
        } catch (err) {
            console.error(err);
        } finally {
            this.setState({ deleteDialogOpen: false, sessionToDelete: null, count: 0 });
        }
    };

    render() {
        const { classes, form, fields, rows, access_level } = this.props;

        return (
            <Fragment>
                <Paper className={classes.root}>
                    <MaterialTable
                        columns={fields.map((f) => ({
                            title: f.prompt,
                            field: f.prompt,
                            readonly: !!f.readonly,
                        }))}
                        data={rows}
                        title={form.form_name + ' - Entries'}
                        onRowClick={this.onSessionClick}
                        options={{
                            columnsButton: true,
                            emptyRowsWhenPaging: false,
                            exportButton: true,
                            filtering: true,
                            paging: true,
                            pageSize: 15,
                            pageSizeOptions: [15, 50, 100, rows.length],
                        }}
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
                <SessionDetailPopup
                    open={this.state.detailDialogOpen}
                    onClose={this.onSessionDetailClose}
                    form={form}
                    row={this.state.clickedRow}
                />
                <DeleteSessionDialog
                    open={this.state.deleteDialogOpen}
                    count={this.state.count}
                    onCancel={() =>
                        this.setState({ deleteDialogOpen: false, sessionToDelete: null, count: 0 })
                    }
                    onSubmit={this.onDelete}
                />
            </Fragment>
        );
    }
}

SessionFormTable.propTypes = {
    classes: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    rows: PropTypes.array.isRequired,
};

export default withStyles(styles)((props) => (
    <AuthContext.Consumer>
        {({ access_level }) => (
            <APIContext.Consumer>
                {({ putSession, deleteSession, getEntries, project_id }) => (
                    <SessionFormTable
                        {...props}
                        putSession={putSession}
                        deleteSession={deleteSession}
                        getEntries={getEntries}
                        project_id={project_id}
                        access_level={access_level}
                    />
                )}
            </APIContext.Consumer>
        )}
    </AuthContext.Consumer>
));
