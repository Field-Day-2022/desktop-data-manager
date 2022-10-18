/*
 * File: index.js
 * Version: 1.01 US174
 * Date: 2020-03-07
 * Description: Authentication index file for handling the login form methods.
 */
import React from 'react';
import LoginForm from './LoginForm';
import { AuthContext } from '../AuthContext/AuthContext';

export default (props) => (
    <AuthContext.Consumer>
        {({ isAuth, authenticate, signout, username }) => (
            <LoginForm
                {...props}
                isAuth={isAuth}
                authenticate={authenticate}
                signout={signout}
                username={username}
            />
        )}
    </AuthContext.Consumer>
);
