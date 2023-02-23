import TopNav from './components/TopNav';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { useAtom } from 'jotai';
import { currentPageName, currentProjectName, appMode } from './utils/jotai';
import TablePage from './pages/TablePage';
import React from 'react';
import { Authenticator } from './utils/authenticator';
import { Notifier } from './components/Notifier';
import { getTable } from './utils/TableDbMappings';

function App() {
    const [currentPage, setCurrentPage] = useAtom(currentPageName);
    const [currentProject, setCurrentProject] = useAtom(currentProjectName);
    const [environment, setEnvironment] = useAtom(appMode);

    const auth = new Authenticator();

    const pageMap = {
        'Home': <HomePage />,
        'Table': <TablePage />
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-neutral-100 text-neutral-800 select-none">
            <Notifier />
            <TopNav title="Field Day" auth={auth} />
            <div className="flex flex-grow">
                {
                    auth.validateUser()
                        ? pageMap[currentPage]
                        : <LoginPage auth={auth} />
                }
            </div>
        </div>
    );
}

export default App;
