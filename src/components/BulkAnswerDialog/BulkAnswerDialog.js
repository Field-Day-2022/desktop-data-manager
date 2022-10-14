/*
* File: BulkAnswerDialog.js
* Version: 1.01 US168
* Date: 2020-03-02
* Description: Render's a final bulk answer set for the user.
*/
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({});

class BulkAnswerDialog extends Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.props.onClose();
  };

  handleBulkList = () => {
    const { answers } = this.props;
    return answers.map((answer, index) => {
      return <li key={index}>{answer.primary}</li>;
    });
  };

  render() {
    const { open } = this.props;
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Bulk Answers'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            To Modify this data, please re-import CSV
          </DialogContentText>
          <DialogContentText id="alert-dialog-content">{this.handleBulkList()}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(BulkAnswerDialog);
