import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getRedirectResult, GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';

export class Authenticator {
    constructor() {
        [this.user, this.loading, this.error] = useAuthState(auth);
    }

    validateUser() {
        if (!this.user) return false;
        if (this.user && this.user.email.slice(-7) === 'asu.edu') {
            return true;
        } else {
            logout();
            return false;
        }
    }

    login() {
        signInWithRedirect(auth, new GoogleAuthProvider());
        return this.validateUser;
    }

    logout() {
        signOut(auth);
        return !this.user;
    }

}