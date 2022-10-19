/*
 * File: DeleteSessionDialog.js
 * Version: 1.01 US170
 * Date: 2020-03-03
 * Description: If user wants to delete their session or past sessions, this allows them to do so.
 */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export class DeleteSessionDialog extends Component {
    render() {
        const { open = false, count = 0, onCancel = () => {}, onSubmit = () => {} } = this.props;

        return (
            <Dialog open={open} onClose={onCancel} aria-labelledby="answer-dialog-title">
                <DialogTitle id="answer-dialog-title">New Answer</DialogTitle>
                <DialogContent>
                    <DialogContentText>{`This will delete the session and all ${count} entries.`}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={onSubmit} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
