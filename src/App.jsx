import TopNav from './components/TopNav';
import { useAtom } from 'jotai';
import { currentPageName, currentProjectName, appMode } from './utils/jotai';
import React, { useEffect } from 'react';
import { Authenticator } from './utils/authenticator';
import { Notifier } from './components/Notifier';
import { TablePage, FormBuilder, HomePage, LoginPage } from './pages'

function App() {
    const [currentPage, setCurrentPage] = useAtom(currentPageName);

    useEffect(() => {
        setCurrentPage('FormBuilder')
    }, [])

    const auth = new Authenticator();

    const pageMap = {
        'Home': <HomePage />,
        'Table': <TablePage />,
        'FormBuilder': <FormBuilder />
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
