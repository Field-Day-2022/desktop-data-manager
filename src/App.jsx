import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { currentPageName } from './utils/jotai';
import { Authenticator } from './utils/authenticator';
import HomePage from './pages/HomePage';
import TablePage from './pages/TablePage';
import LoginPage from './pages/LoginPage';
import TopNav from './components/TopNav';
import { Notifier } from './components/Notifier';

// Instantiate Authenticator
const auth = new Authenticator();

function App() {
    const [currentPage] = useAtom(currentPageName);
    const [userEmail, setUserEmail] = useState(null);

    const handleLogin = async () => {
        const success = await auth.login();
        if (success) {
            setUserEmail(auth.user.email); // Store user email on login
        }
    };

    const pageMap = {
        Home: <HomePage />,
        Table: <TablePage />,
    };

    return (
        <div className="flex flex-col w-full min-h-screen text-neutral-800 dark:text-neutral-200 select-none">
            <Notifier />
            <TopNav title="Field Day" auth={auth} />
            <div className="flex flex-grow">
                {userEmail ? (
                    pageMap[currentPage] || <HomePage />
                ) : (
                    <LoginPage auth={auth} onLogin={handleLogin} />
                )}
            </div>
        </div>
    );
}

export default App;
