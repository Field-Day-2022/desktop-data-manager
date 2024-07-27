// src/utils/authenticator.js
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithRedirect, signOut, getRedirectResult } from 'firebase/auth';

export class Authenticator {
    constructor() {
        [this.user, this.loading, this.error] = useAuthState(auth);
        this.handleRedirectResult();
    }

    async handleRedirectResult() {
        try {
            console.log('Handling redirect result...');
            const result = await getRedirectResult(auth);
            if (result) {
                this.user = result.user;
                console.log('User signed in:', this.user);
            } else {
                console.log('No redirect result.');
            }
        } catch (error) {
            console.error('Error handling redirect result:', error);
        }
    }

    validateUser() {
        if (!this.user) return false;
        if (this.user && this.user.email.slice(-7) === 'asu.edu') {
            return true;
        } else {
            this.logout();
            return false;
        }
    }

    login() {
        signInWithRedirect(auth, new GoogleAuthProvider());
    }

    logout() {
        signOut(auth);
        return !this.user;
    }
}
