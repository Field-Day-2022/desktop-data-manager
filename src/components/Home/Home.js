/*
* File: Home.js
* Version: 1.01 US173
* Date: 2020-03-05
* Description: This lays out the home page, imports various themes, and generates/renders the home page.
*/
import React, { Component, Fragment } from 'react';
import Paper from '@material-ui/core/Paper';
import { Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FormIcon from '@material-ui/icons/Description';
import Divider from '@material-ui/core/Divider';
import { APIContext } from '../APIContext/APIContext';

const styles = theme => ({
  homeContainer: {
    display: 'inline',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    paddingTop: 40,
    paddingLeft: 15,
    display: 'flex',
    justifyContent: 'center',
    fontWeight: '600',
    color: '#ffffff',
    textShadow: '0 2px 0 grey',
  },
  homeIcon: {
    paddingRight: 10,
    color: '#ffffff',
    width: 60,
    height: 60,
  },
  headlineText: {
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 35,
    paddingTop: 120,
    color: '#ffffff',
    textShadow: '0px 2px 0px black',
    maxWidth: 750,
    height: 100,
    fontWeight: 600,
  },
  bodyPaper: {
    backgroundImage: `linear-gradient(
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.5)
    ), url('assets/ecology-home.jpg')`,
    backgroundSize: 'cover',
    height: 300,
    padding: 20,
  },

  homeButtons: {
    marginTop: 80,
  },
  homeListRoot: {
    paddingTop: theme.spacing.unit * 3,
  },
  sessionText: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    height: 45,
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    borderRadius: '4px 4px 0 0',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), ' +
      '0px 2px 2px 0px rgba(0, 0, 0, 0.14),' +
      '0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
  },
  listText: {
    fontSize: '1rem',
  },
});

class Home extends Component {
  state = {
    redirect: null,
  };

  push = route => {
    this.setState({ redirect: route });
  };

  render() {
    const { push } = this;
    const { redirect } = this.state;
    const { classes, sessionForms } = this.props;

    if (redirect) {
      this.setState({ redirect: null });
      return <Redirect to={redirect} />;
    }

    return (
      <Fragment>
        <div className={classes.homeContainer}>
          <Paper square={false} className={classes.bodyPaper}>
            <Typography variant="h2" component="h2" className={classes.title}>
              <HomeIcon className={classes.homeIcon} />
              FieldDay
            </Typography>
            <Typography variant="h6" className={classes.headlineText}>
              FieldDay builds rich, dynamic forms for mobile data collection and query.
            </Typography>
          </Paper>
          <div className={classes.homeListRoot}>
            <Paper square={false} className={classes.listPaper}>
              <Typography bgcolor="primary" variant="h6" className={classes.sessionText}>
                Session Forms
              </Typography>
              <Divider />
              <List dense>
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
            </Paper>
          </div>
        </div>
      </Fragment>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  sessionForms: PropTypes.object.isRequired,
};

export default withStyles(styles)(props => (
  <APIContext.Consumer>
    {({ sessionForms }) => <Home {...props} sessionForms={sessionForms} />}
  </APIContext.Consumer>
));
