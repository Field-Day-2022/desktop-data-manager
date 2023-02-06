/*
 * File: FormBuilderToolbar.js
 * Version: 1.01 US172
 * Date: 2020-03-04
 * Description: Generates a toolbar that the user can utilize when building their forms.
 */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

const styles = {
    paper: {
        display: 'table',
        margin: 15,
    },
    nameControl: {
        margin: 12,
        width: 300,
    },
};

class FormBuilderToolbar extends Component {
    render() {
        const { classes, name, onName } = this.props;
        return (
            <Paper className={classes.paper}>
                <TextField
                    id="form-name"
                    label="Form Name"
                    value={name}
                    onChange={onName}
                    className={classes.nameControl}
                    margin="normal"
                    variant="outlined"
                />
            </Paper>
        );
    }
}

export default withStyles(styles)(FormBuilderToolbar);
