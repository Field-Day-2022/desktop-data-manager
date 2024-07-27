import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export class Authenticator {
    constructor() {
        [this.user, this.loading, this.error] = useAuthState(auth);
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
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' }); // Force account selection
        signInWithPopup(auth, provider);
        return this.validateUser();
    }

    logout() {
        signOut(auth).then(() => {
            // Clear cookies
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            // Clear local storage
            localStorage.clear();
            // Redirect to login page or homepage
            window.location.href = '/login';
        });
        return !this.user;
    }
}
