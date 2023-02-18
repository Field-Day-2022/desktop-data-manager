import TopNav from './components/TopNav';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { useAtom } from 'jotai';
import { currentPageName, currentProjectName } from './utils/jotai';
import TablePage from './pages/TablePage';

import React from 'react';
import { Authenticator } from './utils/authenticator';
import { Notifier } from './components/Notifier';

function App() {

    const [currentPage, setCurrentPage] = useAtom(currentPageName);
    const [currentProject, setCurrentProject] = useAtom(currentProjectName);

    const auth = new Authenticator();

    return (
        <div className="flex flex-col w-full min-h-screen bg-neutral-100 text-neutral-800 select-none">
            <Notifier />
            <TopNav title="Field Day" auth={auth} />
            <div className="flex flex-grow">
                {auth.validateUser() ? (
                    <>

                        {currentPage === 'Home' && <HomePage />}
                        {currentPage === 'Table' && (
                            <TablePage collectionName={`${currentProject}Data`} />
                        )}
                    </>
                ) : (
                    <LoginPage auth={auth} />
                )}
            </div>
        </div>
    );
}

export default App;
