/*
* File: RegexSelect.js
* Version: 1.01
* Date: 2020-03-07
* Description: Sets the answer_set Regex.
*/

import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { REGEX } from '../../util/fieldSchemas-esm';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  formControl: {
    minWidth: 200,
    display: 'flex',
    marginBottom: 10,
  },
});

class RegexSelect extends Component {
  static defaultProps = {
    regex: '',
  };

  render() {
    const { classes, regex, onChangeRegex } = this.props;

    return (
      <Fragment>
        <Tooltip title="Select a common pattern that inputs must match">
          <TextField
            id="answer_set"
            label="Regex"
            className={classes.formControl}
            value={regex}
            onChange={event => onChangeRegex(event.target.value)}
            margin="normal"
          />
        </Tooltip>
        <Select
          value="_"
          onChange={event => onChangeRegex(event.target.value === '_' ? '' : event.target.value)}
          className={classes.formControl}
        >
          <MenuItem value="_" key="none">
            Choose a common regex...
          </MenuItem>
          {Object.values(REGEX).map(option => {
            return (
              <MenuItem value={option.regex} key={option.regex}>
                {option.title}
              </MenuItem>
            );
          })}
        </Select>
      </Fragment>
    );
  }
}

export default withStyles(styles)(RegexSelect);
