import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth'

export default class Authenticator {
    constructor(auth) {
        this.auth = auth;
        this.state = useAuthState(this.auth);
        this.user = this.state.user;
        this.loading = this.state.loading;
        this.error = this.state.error;
    }

    validateUser() {
        if (!this.user) return false;
        if (this.user && this.user.email.slice(-7) === 'asu.edu') {
            return true;
        }
        else {
            logout();
            return false;
        }
    }
    
    login() {
        signInWithRedirect(this.auth, new GoogleAuthProvider())
    }
    
    logout() {
        signOut(this.auth);
    }

}