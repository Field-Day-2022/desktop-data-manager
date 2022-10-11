/*
* File: FormList.js
* Version: 1.01 US172
* Date: 2020-03-04
* Description: Extends the forms and adds style to the selected form list.
*/
import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import FormIcon from '@material-ui/icons/Description';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class FormList extends Component {
  state = {
    checked: [...this.props.selectedForms],
  };

  static defaultProps = {
    onSelectChange: () => {},
    selectedForms: [],
    //selectedForms: ['fish','frog','spider'],
    //selectedForms: [0,2,4],
  };

  handleToggle = value => () => {
    const { dataForms } = this.props;
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });

    this.props.onSelectChange(
      newChecked.map(fixId => Object.values(dataForms).find(x => x.id === fixId))
    );
    //this.props.onSelectChange(newChecked.map(index => Object.values(dataForms)[index]));
  };

  render() {
    const { classes, dataForms } = this.props;

    return (
      <div className={classes.root}>
        <List dense>
          {Object.values(dataForms).map((fixture, i, arr) => (
            <Fragment key={fixture.id}>
              <ListItem button key={i} onClick={this.handleToggle(fixture.id)}>
                <FormIcon />
                <ListItemText primary={fixture.screenName} />
                <ListItemSecondaryAction>
                  <Checkbox
                    onChange={this.handleToggle(fixture.id)}
                    checked={this.state.checked.indexOf(fixture.id) !== -1}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {i < arr.length - 1 ? <Divider /> : null}
            </Fragment>
          ))}
        </List>
      </div>
    );
  }
}

FormList.propTypes = {
  classes: PropTypes.object.isRequired,
  dataForms: PropTypes.object.isRequired,
  onSelectChange: PropTypes.func,
};

export default withStyles(styles)(FormList);
