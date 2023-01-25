import { auth } from "../main";
import {
    GoogleAuthProvider,
    signInWithRedirect,
} from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import LoginPage from "./LoginPage";

export default function LoginWrapper({ children }) {

    const [user, loading, error] = useAuthState(auth);

    if (user && (user.email.slice(-7) === 'asu.edu')) {
        // There is already a valid user signed in.
        return children;
    }
    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error.</div>
    }
    console.log('Ready for login')
    return (
        <LoginPage loginEvent={signInWithRedirect(auth, new GoogleAuthProvider())} />
    );


}