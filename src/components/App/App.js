/*
* File: App.js
* Version: 1.01 US228
* Date: 2020-04-10
* Description: Original app setup, importing necessary frameworks.
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';

import NavigationBar from '../NavigationBar/NavigationBar';
import NavigationDrawer from '../NavigationDrawer/NavigationDrawer';
import AppSwitch from '../AppSwitch/AppSwitch';
import { APIProvider } from '../APIContext/APIContext';
import { AuthProvider } from '../AuthContext/AuthContext';

import {toeCodes} from "../../toeCodes"

// import firebase stuff
import { db } from '../../util/firebase';
import {
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';

const styles = theme => ({
  root: {
    minHeight: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  content: {
    marginTop: 64,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#343030',
    },
    secondary: {
      main: '#8c1b3f',
    },
  },
});

class App extends Component {


  async generateToeClipCodes() {
    // generate an object of all toe clip codes
    // add the object, along with the location, to the ToeClipCodes collection
    // that way, only 1 read is required to get all available toe clip codes
    let iter = 0;
    for (let toeCode in toeCodes) {
      iter++;
    }
    console.log(iter);
    const doc = await addDoc(collection(db, "ToeClipCodes"), toeCodes);
    console.log("doc written: " + doc.id);
  }


  render() {
    // this.generateToeClipCodes();
    const { classes } = this.props;
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <APIProvider>
          <AuthProvider>
            <MuiThemeProvider theme={theme}>
              <div className={classes.root}>
                <NavigationBar />
                <NavigationDrawer />
                <main className={classes.content}>
                  <AppSwitch />
                </main>
              </div>
            </MuiThemeProvider>
          </AuthProvider>
        </APIProvider>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
