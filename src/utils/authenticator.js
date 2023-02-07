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
<<<<<<< HEAD
        return this.validateUser;
=======
        if (!this.validateUser()) {
            this.logout();
        }
>>>>>>> 05327d64d4bb3b38cf43fb18652d5945d8e0a4fe
    }

    logout() {
        signOut(auth);
        return !this.user;
    }
}
