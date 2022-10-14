/*
* File: NavigationDrawer.js
* Version: 1.01
* Date: 2020-03-07
* Description: This class contains static methods which set and navigate the
* left menu. 
*/

import React, { Component, Fragment } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BuilderIcon from '@material-ui/icons/Build';
import InfoIcon from '@material-ui/icons/Info';
import FormIcon from '@material-ui/icons/Description';
import Typography from '@material-ui/core/Typography';
import { APIContext } from '../APIContext/APIContext';

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: 240,
  },
  toolbar: theme.mixins.toolbar,
});

class NavigationDrawer extends Component {
  state = {
    redirect: null,
  };

  push = route => {
    this.setState({ redirect: route });
  };

  render() {
    const { push } = this;
    const { isAuth, access_level, classes, dataForms, sessionForms } = this.props;
    const { redirect } = this.state;

    if (redirect) {
      this.setState({ redirect: null });
      return <Redirect to={redirect} />;
    }

    return isAuth ? (
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        {access_level === 2 ? (
          <Fragment>
            <List>
			<Typography variant="caption" className="App-drawer-section-title">
            DOCUMENTATION
          </Typography>
          <ListItem button onClick={() => push('/about')}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
        </List>
		<Divider />
       </Fragment>
      ) : null}
	  <List>
          <Typography variant="caption" className="App-drawer-section-title">
            EXPORT DATA
          </Typography>
          <ListItem button onClick={() => push('/export/all')} >
            <ListItemIcon>
              <FormIcon />
            </ListItemIcon>
            <ListItemText primary='Export To CSV' />
          </ListItem>
        </List>
        <Divider />
        <List>
		<Typography variant="caption" className="App-drawer-section-title">
            CRITTER DATA
          </Typography>
          {dataForms.length ? (
            dataForms.map(form => (
              <ListItem
                key={form.form_id}
                button
                onClick={() => push('/form/data/' + form.form_id)}
              >
                <ListItemIcon>
                  <FormIcon />
                </ListItemIcon>
                <ListItemText primary={form.form_name} />
              </ListItem>
            ))
          ) : (
              <Typography variant="caption" className="App-drawer-section-title">
                No Data Forms found. Create one in the Form Builder above.
            </Typography>
            )}
        </List>
        <Divider />
        <List>
          <Typography variant="caption" className="App-drawer-section-title">
            SESSION ENTIRES
          </Typography>
          {sessionForms.length ? (
            sessionForms.map(form => (
              <ListItem
                key={form.form_id}
                button
                onClick={() => push('/form/session/' + form.form_id)}
              >
                <ListItemIcon>
                  <FormIcon />
                </ListItemIcon>
                <ListItemText primary={form.form_name} />
              </ListItem>
            ))
          ) : (
              <Typography variant="caption" className="App-drawer-section-title">
                No Session Forms found. Create one in the Form Builder above.
            </Typography>
            )}
        </List>
        {access_level === 2 ? (
          <Fragment>
            <Divider />
            <List>
              <Typography variant="caption" className="App-drawer-section-title">
                ENTER DATA
            </Typography>
              <ListItem button onClick={() => push('/add/session')}>
                <ListItemIcon>
                  <FormIcon />
                </ListItemIcon>
                <ListItemText primary="New Session" />
              </ListItem>
              <ListItem button onClick={() => push('/add/data')}>
                <ListItemIcon>
                  <FormIcon />
                </ListItemIcon>
                <ListItemText primary="New Data Entry" />
              </ListItem>
            </List>
          </Fragment>
        ) : null}
        <Divider />
		<List> 
              <Typography variant="caption" className="App-drawer-section-title">
                MANAGE FORMS
              </Typography>
              <ListItem button onClick={() => push('/builder')}>
                <ListItemIcon>
                  <BuilderIcon />
                </ListItemIcon>
                <ListItemText primary="Form Builder" />
              </ListItem>
            </List>
            <Divider />
			</Drawer>
    ) : null;
  }
}

export default withStyles(styles)(props => (
  <AuthContext.Consumer>
    {({ isAuth, access_level }) => (
      <APIContext.Consumer>
        {apiProps => (
          <NavigationDrawer {...props} {...apiProps} isAuth={isAuth} access_level={access_level} />
        )}
      </APIContext.Consumer>
    )}
  </AuthContext.Consumer>
));
