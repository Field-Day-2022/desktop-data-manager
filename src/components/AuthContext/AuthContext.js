/*
 * File: AuthContext.js
 * Version: 1.01 US167
 * Date: 2020-03-01
 * Description: User Authentication Handling.
 */
import React from 'react';

import { APIContext } from '../APIContext/APIContext';

export const AuthContext = React.createContext();

class AuthProviderComponent extends React.Component {
    state = {
        isAuth: false,
        username: '',
        access_level: 1,
    };

    authenticate = async ({ username, password }) => {
        const { login } = this.props;

        try {
            const response = await login({
                username,
                password,
            });

            this.setState({
                isAuth: response.data.auth,
                username: username,
                access_level: response.data.access_level,
            });

            if (response.status === 200) {
                sessionStorage.setItem('jwtToken', response.data.token);
            }

            return response.data.auth;
        } catch (err) {
            console.error(err);
            this.signout();
            return false;
        }
    };

    signout = () => {
        sessionStorage.removeItem('jwtToken');
        this.setState({ isAuth: false, username: '', access_level: 1 });
    };

    render() {
        return (
            <AuthContext.Provider
                value={{
                    isAuth: this.state.isAuth,
                    authenticate: this.authenticate,
                    signout: this.signout,
                    username: this.state.username,
                    access_level: this.state.access_level,
                }}
            >
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export const AuthProvider = (props) => {
    return (
        <APIContext.Consumer>
            {({ login }) => <AuthProviderComponent {...props} login={login} />}
        </APIContext.Consumer>
    );
};
