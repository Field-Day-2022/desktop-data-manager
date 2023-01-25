import Button from "../components/Button";
import Logo from "../components/Logo";

import { auth } from "../main";
import {
    GoogleAuthProvider,
    signInWithRedirect,
} from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from "react";

export default function Home() {
    const [user, loading, error] = useAuthState(auth);
    const [message, setMessage] = useState('Sign in with your asurite.')
    return (
        <div className="text-center">
            <div className="flex items-center space-x-5">
                <Logo className="text-asu-maroon h-28" />
                <h1 className="text-7xl py-10">Field Day</h1>
            </div>

            <div className="my-5 p-10 rounded-lg shadow-md bg-white">
                <div className="flex flex-col space-y-5">
                    <p>
                        {message}
                    </p>
                    <Button
                        text='Login'
                        onClick={() => {
                            if (user && (user.email.slice(-7) === 'asu.edu')) {
                                return
                            }
                            if (loading) {
                                console.log('Loading...')
                                setMessage('Loading... Try again.')
                            } else if (error) {
                                console.log('Error')
                                setMessage('Error... Try again.')
                            } else {
                                setMessage('Trying to log in with Google...')
                                signInWithRedirect(auth, new GoogleAuthProvider())
                            }

                        }
                        }
                    />
                </div>
            </div>
        </div>
    );
}

