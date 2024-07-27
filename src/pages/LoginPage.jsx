import React, { useEffect, useState } from 'react';
import Button from "../components/Button";
import { GoogleIcon, LizardIcon } from "../assets/icons";
import PageWrapper from "./PageWrapper";
import { Authenticator } from '../utils/authenticator';

export default function LoginPage() {
    const authenticator = new Authenticator();
    const [authState, setAuthState] = useState({
        loading: true,
        user: null,
        error: null
    });

    useEffect(() => {
        const handleAuthStateChange = async () => {
            console.log("Handling auth state change...");
            await authenticator.handleRedirectResult();
            setAuthState({
                loading: authenticator.loading,
                user: authenticator.user,
                error: authenticator.error
            });
            console.log("Auth state updated:", {
                loading: authenticator.loading,
                user: authenticator.user,
                error: authenticator.error
            });

            if (authenticator.user) {
                // Redirect to the main app or dashboard
                console.log('Redirecting to dashboard...');
                window.location.href = '/dashboard';
            }
        };

        handleAuthStateChange();
    }, []);

    const handleLogin = () => {
        console.log("Login button clicked");
        authenticator.login();
    };

    const LOADING_MESSAGE = 'Loading Google\'s authentication.';
    const LOGIN_MESSAGE = 'Click login to sign in with your ASURITE ID.';

    return (
        <PageWrapper>
            <div className="pt-10">
                <h1 className="title">Field Day</h1>
                <h2 className="subtitle">Data Management Tool</h2>
            </div>
            <div className='m-5 p-10 rounded-lg shadow-md bg-white dark:bg-neutral-950 mx-auto w-full md:w-96'>
                <div className="flex flex-col space-y-5">
                    <p>
                        {(authState.loading ? LOADING_MESSAGE : LOGIN_MESSAGE)}
                    </p>
                    <Button
                        disabled={authState.loading}
                        text={(!authState.loading ? 'Login' : 'Please wait.')}
                        onClick={handleLogin}
                        icon={<GoogleIcon className="w-6 mx-auto bg-white p-0.5 rounded-full" />}
                    />
                </div>
            </div>
            <LizardIcon className="text-asu-maroon h-48 mx-auto rotate-45" />
        </PageWrapper>
    );
}

