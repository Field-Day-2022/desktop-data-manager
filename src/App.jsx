import TopNav from './components/TopNav';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { useAtom } from 'jotai';
import { currentPageName, currentProjectName } from './utils/jotai';
import Table from './components/Table';

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
                        {currentPage === 'Turtle' && (
                            <Table tableName="Turtle" collectionName={`${currentProject}Data`}/>
                        )}
                        {currentPage === 'Lizard' && (
                            <Table tableName="Lizard" collectionName={`${currentProject}Data`}/>
                        )}
                        {currentPage === 'Mammal' && (
                            <Table tableName="Mammal" collectionName={`${currentProject}Data`}/>
                        )}
                        {currentPage === 'Snake' && (
                            <Table tableName="Snake" collectionName={`${currentProject}Data`}/>
                        )}
                        {currentPage === 'Arthropod' && (
                            <Table tableName="Arthropod" collectionName={`${currentProject}Data`}/>
                        )}
                        {currentPage === 'Amphibian' && (
                            <Table tableName="Amphibian" collectionName={`${currentProject}Data`}/>
                        )}
                        {currentPage === 'Session' && (
                            <Table tableName="Session" collectionName={`${currentProject}Session`}/>
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
