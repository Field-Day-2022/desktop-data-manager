/*
* File: AppSwitch.js
* Version: 1.01 US167
* Date: 2020-03-01
* Description: Utilizes React to keep track and route user's through the app.
*/
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from '../Home/Home';
import FormBuilderPage from '../FormBuilderPage/FormBuilderPage';
import DataFormViewPage from '../DataFormViewPage/DataFormViewPage';
import SessionFormViewPage from '../SessionFormViewPage/SessionFormViewPage';
import NotFound from '../NotFound/NotFound';
import LoginForm from '../LoginForm';
import { AuthContext } from '../AuthContext/AuthContext';
import About from '../About/About';
import CreateSessionViewPage from '../CreateSessionViewPage/CreateSessionViewPage';
import CreateDataEntryViewPage from '../CreateDataEntryViewPage/CreateDataEntryViewPage';
import ExportAllView from '../ExportAllView/ExportAllView';
import { db } from '../../util/firebase';
import { collection, getDocs } from 'firebase/firestore';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <AuthContext.Consumer>
    {({ isAuth }) => (
      <Route
        {...rest}
        render={props => (isAuth === true ? <Component {...props} /> : <Redirect to="/login" />)}
      />
    )}
  </AuthContext.Consumer>
);

class App extends Component {

  // this is a test to see if data transfer was successful
  async test() {
    const querySnapshot = await getDocs(collection(db, "VirginRiverData"));
    console.log(querySnapshot.size);
  }


  render() {

    // uncomment this to get the size of the collection
    // this.test();

    // console.log("hello world");

    return (
      <Switch>
        <Route exact path="/login" component={LoginForm} />
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/builder" component={FormBuilderPage} />
        <PrivateRoute exact path="/form/data/:form_id" component={DataFormViewPage} />
        <PrivateRoute exact path="/form/session/:form_id" component={SessionFormViewPage} />
        <PrivateRoute exact path="/about" component={About} />
        <PrivateRoute exact path="/add/session" component={CreateSessionViewPage} />
        <PrivateRoute exact path="/add/data" component={CreateDataEntryViewPage} />
        <PrivateRoute exact path="/export/all" component={ExportAllView} />
        <PrivateRoute component={NotFound} />
      </Switch>
    );
  }
}

export default App;
