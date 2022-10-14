/*
* File: ReliesOnSelect.js
* Version: 1.01
* Date: 2020-03-07
* Description: Allows users to select a field that the field being interacted with relies on.
*/

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  formControl: {
    marginTop: theme.spacing.unit,
    width: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(prompt, that) {
  return {
    fontWeight:
      that.props.relies_on.indexOf(prompt) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium,
  };
}

class ReliesOnSelect extends React.Component {
  handleChange = event => {
    const { onSelectChange } = this.props;
    onSelectChange(event.target.value);
  };

  render() {
    const { classes, fieldsBefore, relies_on } = this.props;

    if (!fieldsBefore.length) {
      return null;
    }

    return (
      <FormControl className={classes.formControl}>
        <Tooltip title="Select another field that this field relies on">
          <InputLabel htmlFor="select-multiple-chip">Relies On</InputLabel>
        </Tooltip>
        <Select
          multiple
          value={relies_on}
          onChange={this.handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {selected.map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {fieldsBefore.map(prompt => (
            <MenuItem key={prompt} value={prompt} style={getStyles(prompt, this)}>
              {prompt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ReliesOnSelect);
