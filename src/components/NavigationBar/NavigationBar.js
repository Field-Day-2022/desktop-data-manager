/*
 * File: NavigationBar.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Sets and displays a UI bar at the top of the webpage, which is used to pointer
 * users to information.
 */
import React, { Component, Fragment } from 'react';
import { APP_NAME } from '../../constants.js';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router-dom';
import NavigaionUser from '../NavigationUser';
import ProjectSelect from '../ProjectSelect/ProjectSelect';
import { AuthContext } from '../AuthContext/AuthContext';

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        zIndex: theme.zIndex.drawer + 1,
    },
    grow: {
        flexGrow: 1,
        cursor: 'pointer',
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    logo: {
        height: 40,
        marginRight: 15,
        cursor: 'pointer',
    },
    projectSelectForm: {
        marginRight: 25,
        marginBottom: 15,
    },
});

class NavigationBar extends Component {
    state = {
        redirect: null,
    };

    clickHome = () => {
        this.setState({ redirect: '/' });
    };

    render() {
        const { classes, isAuth } = this.props;
        const { redirect } = this.state;

        if (redirect) {
            this.setState({ redirect: null });
            return <Redirect to={redirect} />;
        }

        return (
            <AppBar position="absolute" className={classes.root}>
                <Toolbar>
                    <img
                        src="/assets/logo-maroon-onlylizard.png"
                        alt={`${APP_NAME} logo`}
                        className={classes.logo}
                        onClick={this.clickHome}
                    />
                    <Typography
                        variant="h6"
                        color="inherit"
                        className={classes.grow}
                        onClick={this.clickHome}
                    >
                        {APP_NAME}
                    </Typography>

                    {isAuth && (
                        <Fragment>
                            <ProjectSelect />
                            <NavigaionUser />
                        </Fragment>
                    )}
                </Toolbar>
            </AppBar>
        );
    }
}

NavigationBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)((props) => (
    <AuthContext.Consumer>
        {({ isAuth }) => <NavigationBar {...props} isAuth={isAuth} />}
    </AuthContext.Consumer>
));
