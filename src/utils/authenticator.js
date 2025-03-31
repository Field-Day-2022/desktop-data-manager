import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore();

export class Authenticator {
    constructor() {
        this.user = null; // Will hold the current user after login
    }

    // Check if the user is already authorized in Firestore
    async isAuthorizedUser(email) {
        const authorizedUsersRef = collection(db, 'authorized_users');
        const q = query(authorizedUsersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty; // True if user exists in the collection
    }

    // Add a new user to the 'authorized_users' collection in Firestore
    async addUserToDatabase(email) {
        const authorizedUsersRef = collection(db, 'authorized_users');
        await addDoc(authorizedUsersRef, { email });
    }

    //This adds user login history to a new collection.
    async addLoginHistory(email) {
        const loginHistoryRef = collection(db, 'loginHistory');
        const now = new Date();
        await addDoc(loginHistoryRef, {
            email: email,
            loginDate: now.toLocaleDateString(),
            loginTime: now.toLocaleTimeString(),
            platform: 'desktop' // Added platform field
        });
        console.log(`Login recorded for: ${email}`);
    }

    // Prompt the user for a password to register them in the database
    async promptForPassword() {
        const password = window.prompt('Enter the registration password:');
        if (password === 'lizard') {
            return true; // Password matches
        } else {
            alert('Invalid password. You are not authorized.');
            return false;
        }
    }

    // Login method with user validation
    async login() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const result = await signInWithPopup(auth, provider);
            this.user = result.user; // Assign the logged-in user

            const email = this.user.email;
            const isAuthorized = await this.isAuthorizedUser(email);

            if (!isAuthorized) {
                const passwordCorrect = await this.promptForPassword();
                if (passwordCorrect) {
                    await this.addUserToDatabase(email); // Register the user
                    alert('You have been registered successfully!');
                } else {
                    await this.logout(); // Logout if password is incorrect
                    return false;
                }
            }
            //this records login history after authentication is done
            await this.addLoginHistory(email);

            console.log('User successfully logged in and validated:', email);
            return true; // Successful login
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }

    // Logout function to clear cookies and local storage
    async logout() {
        try {
            await signOut(auth);
            document.cookie.split(';').forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, '')
                    .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
            });
            localStorage.clear();
            window.location.href = '/login'; // Redirect to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
}
