/*
* File: NotFound.js
* Version: 1.01
* Date: 2020-03-07
* Description: Handles error for 'lost' webpage.
*/

import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

export default class NotFound extends Component {
  render() {
    return (
      <Paper className="App-page-paper">
        <Typography variant="h5" component="h3">
          Page Not Found
        </Typography>
        <Typography component="p">
          The page you are trying to reach does not exist.
        </Typography>
      </Paper>
    );
  }
}
