/*
 * File: index.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Index for the NavigationUser
 */

import React from 'react';
import NavigationUser from './NavigationUser';
import { AuthContext } from '../AuthContext/AuthContext';

export default (props) => (
    <AuthContext.Consumer>
        {({ isAuth, authenticate, signout, username }) => (
            <NavigationUser
                {...props}
                isAuth={isAuth}
                authenticate={authenticate}
                signout={signout}
                username={username}
            />
        )}
    </AuthContext.Consumer>
);
