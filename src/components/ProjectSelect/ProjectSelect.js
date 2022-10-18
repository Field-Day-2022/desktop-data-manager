/*
* File: ProjectSelect.js
* Version: 1.01
* Date: 2020-03-07
* Description: Allows users to select a project on the web app while logging in and sets the theme.
*/

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import { APIContext } from '../APIContext/APIContext';

const styles = theme => ({
  projectSelectContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  projectSelectContainerFull: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  formHelperText: {
    color: theme.palette.secondary.main,
    fontWeight: 500,
    marginTop: 0,
  },
  formControl: {
    width: 150,
    display: 'flex',
    alignItems: 'center',
  },
  formControlFull: {
    width: '100%',
  },
  select: {
    fontWeight: 400,
    width: '100%',
  },
  selectNav: {
    color: theme.palette.background.paper,
    fontWeight: 400,
    width: '100%',
  },
  menuItem: {
    color: theme.palette.primary.main,
  },
});

class ProjectSelect extends Component {
  handleChange = event => {
    const { setProject, loginContext } = this.props;

    setProject(event.target.value, !loginContext);
  };

  render() {
    const { classes, projects, project_id, loginContext } = this.props;

    return (
      <div
        className={
          loginContext ? classes.projectSelectContainerFull : classes.projectSelectContainer
        }
      >
        <FormControl
          variant="outlined"
          className={loginContext ? classes.formControlFull : classes.formControl}
        >
          <Select
            value={project_id || 'none'}
            onChange={this.handleChange}
            className={loginContext ? classes.select : classes.selectNav}
          >
            {loginContext ? (
              <MenuItem value="none" className={classes.menuItem} key="none">
                {'Choose a project...'}
              </MenuItem>
            ) : null}
            {projects.map(p => (
              <MenuItem value={p.project_id} className={classes.menuItem} key={p.project_id}>
                {p.project_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(props => (
  <APIContext.Consumer>
    {({ projects, project_id, setProject }) => (
      <ProjectSelect
        {...props}
        projects={projects}
        setProject={setProject}
        project_id={project_id}
      />
    )}
  </APIContext.Consumer>
));
