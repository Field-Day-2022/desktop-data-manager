import { useAuthState } from 'react-firebase-hooks/auth';
import { getRedirectResult, GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';

export default class Authenticator {
    constructor(auth) {
        this.auth = auth;
        const [user, loading, error] = useAuthState(auth);
        this.user = user;
        this.loading = loading;
        this.error = error;
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

    async login() {
        signInWithRedirect(this.auth, new GoogleAuthProvider());
        const result = await getRedirectResult(auth);
        if (result) {
            this.user = result.user;
            return this.validateUser();
        }
    }

    logout() {
        signOut(this.auth);
    }
}
