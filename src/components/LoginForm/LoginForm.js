/*
 * File: LoginForm.js
 * Version: 1.01 US174
 * Date: 2020-03-06
 * Description: Renders the user login page form.
 */
import React from 'react';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import { APIContext } from '../APIContext/APIContext';
import ProjectSelect from '../ProjectSelect/ProjectSelect';
import { APP_NAME } from '../../constants.js';

const styles = (theme) => ({
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginPaper: {
        padding: '20px 40px',
        width: 500,
        margin: '20px auto',
    },
    logo: {
        height: 100,
        marginRight: 35,
        display: 'inline-block',
    },
    title: {
        display: 'inline-block',
        fontWeight: '400',
    },
    loginField: {
        margin: '10px 0px',
        width: 500,
    },
    errorText: {
        marginTop: 15,
        fontWeight: '500',
    },
});

/**
 * Displays a sign in form
 * Validate form for email and password > 6 chars
 */
class LoginForm extends React.Component {
    state = {
        email: process.env.NODE_ENV === 'development' ? 'tech' : '',
        password: process.env.NODE_ENV === 'development' ? 'tech' : '',
        errors: null,
        redirect: false,
    };

    /**
     *
     * Regex check on email input
     * Password must be greater than 8
     * Email AND Password checks must be true
     * returns formErrors
     */

    isFormValid() {
        const { project_id } = this.props;
        const { email, password } = this.state;
        let formErrors;
        //user names are now a name, instead of an email
        // let regex = new RegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$', 'ig');

        // if (!regex.test(email)) {
        //   formErrors = 'Please enter a valid email address. \n';
        //   this.setState({ errors: formErrors });
        // } else

        if (!password.length > 7) {
            formErrors = 'Password must be at least 8 characters.';
            this.setState({ errors: formErrors });
        } else if (!project_id || typeof project_id === 'string') {
            formErrors = 'A project must be selected.';
            this.setState({ errors: formErrors });
        }
        return formErrors;
    }

    resetState = () => {
        this.setState({
            email: '',
            password: '',
            errors: null,
        });
    };

    /**
     * Update state properties on change
     */
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    /**
     * On submit log form submission to console.
     * Suppress query string and reset form.
     */
    onSubmit = async (e) => {
        const { email, password } = this.state;
        e.preventDefault();
        const errors = this.isFormValid();
        if (errors) {
            this.setState({ errors });
        } else {
            const loggedin = await this.props.authenticate({ username: email, password });
            this.setState({ redirect: loggedin, errors: loggedin ? '' : 'Invalid login.' });
        }
    };

    /**
     * Render component and disable Login button until
     * form is valid.
     */
    render() {
        const { errors, redirect } = this.state;
        const { classes } = this.props;
        let message = null;

        if (redirect) {
            return <Redirect to="/" />;
        }

        // conditional messages displayed on errors/sign in at bottom of component
        if (errors) {
            message = (
                <Typography color="primary" className={classes.errorText} variant="body1">
                    {errors}
                </Typography>
            );
        } else if (this.props.isAuth) {
            message = (
                <Typography color="primary" className={classes.errorText} variant="body1">
                    Signed In
                </Typography>
            );
        } else {
            //do nothing
        }
        return (
            <div>
                <div className={classes.logoContainer}>
                    <img
                        src="/assets/logo-maroon-onlylizard.png"
                        alt={`${APP_NAME} logo`}
                        className={classes.logo}
                        onClick={this.clickHome}
                    />
                    <Typography variant="h1" color="primary" className={classes.title}>
                        {APP_NAME}
                    </Typography>
                </div>
                <Paper className={classes.loginPaper}>
                    <form className={classes.form}>
                        <TextField
                            autoFocus
                            className={classes.loginField}
                            name="email"
                            placeholder="Username"
                            value={this.state.email}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <br />
                        <TextField
                            className={classes.loginField}
                            name="password"
                            placeholder="Password"
                            type="password"
                            value={this.state.password}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <br />
                        <ProjectSelect loginContext />
                        <br />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => this.onSubmit(e)}
                        >
                            Sign in
                        </Button>
                        {message}
                    </form>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)((props) => (
    <APIContext.Consumer>
        {({ project_id }) => <LoginForm {...props} project_id={project_id} />}
    </APIContext.Consumer>
));
