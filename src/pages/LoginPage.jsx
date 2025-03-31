import React from 'react';
import Button from '../components/Button'; // Ensure path is correct
import PageWrapper from './PageWrapper';
import { GoogleIcon, LizardIcon } from '../assets/icons';

export default function LoginPage({ auth, onLogin }) {
    const LOADING_MESSAGE = "Loading Google's authentication.";
    const LOGIN_MESSAGE = 'Click login to sign in with your ASURITE ID.';

    return (
        <PageWrapper>
            {/* Header Section */}
            <div className="pt-10 text-center">
                <h1 className="title">Field Day</h1>
                <h2 className="subtitle">Data Management Tool</h2>
            </div>

            {/* Login Card Section */}
            <div className="m-5 p-10 rounded-lg shadow-md bg-white dark:bg-neutral-950 mx-auto w-full md:w-96">
                <p className="text-center mb-5">{auth.loading ? LOADING_MESSAGE : LOGIN_MESSAGE}</p>

                {/* Google Login Button */}
                <Button
                    onClick={onLogin}
                    text="Login with Google"
                    className="flex items-center justify-center space-x-2 w-full p-2 rounded-lg border border-gray-300 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-900 transition"
                    icon={
                        <div className="bg-white rounded-full p-1 dark:bg-black">
                            <GoogleIcon className="w-6 h-6" />
                        </div>
                    }
                />
            </div>

            {/* Decorative Icon */}
            <LizardIcon className="text-asu-maroon h-48 mx-auto rotate-45 mt-10" />
        </PageWrapper>
    );
}
