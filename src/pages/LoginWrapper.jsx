import { auth } from "../main";
import {
    GoogleAuthProvider,
    signInWithRedirect,
    signOut
} from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import LoginPage from "./LoginPage";
import ErrorPage from "./ErrorPage";


export default function LoginWrapper({ children, loginEnd }) {

    const [user, loading, error] = useAuthState(auth);

    const LOGIN_PAGE =
        <LoginPage
            loading={loading}
            loginEvent={() => {
                signInWithRedirect(auth, new GoogleAuthProvider())
                loginEnd();
            }} />

    if (user) {
        if (user.email.slice(-7) === 'asu.edu') {
            return children;
        } else {
            signOut(auth);
            return LOGIN_PAGE;
        }
    }
    if (error) {
        return <ErrorPage code={1} message={'We\'re having trouble connecting to Google\'s authentication service.'} />
    }
    return (
        LOGIN_PAGE
    );


}