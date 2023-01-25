import { auth } from "../main";
import {
    GoogleAuthProvider,
    signInWithRedirect,
} from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import LoginPage from "./LoginPage";
import LoadingPage from "./LodingPage";
import ErrorPage from "./ErrorPage";

export default function LoginWrapper({ children }) {

    const [user, loading, error] = useAuthState(auth);

    if (user && (user.email.slice(-7) === 'asu.edu')) {
        return children;
    }
    if (loading) {
        return <LoadingPage />
    }
    if (error) {
        return <ErrorPage code={1} message={'We\'re having trouble connecting to Google\'s authentication service.'} />
    }
    return (
        <LoginPage loginEvent={() => signInWithRedirect(auth, new GoogleAuthProvider())} />
    );


}