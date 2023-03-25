// https://firebase.google.com/docs/firestore/query-data/query-cursors
// https://firebase.google.com/docs/firestore/query-data/order-limit-data
import { useState, useEffect } from 'react';
import PageWrapper from './PageWrapper';
import { Pagination } from '../components/Pagination';
import TabBar from '../components/TabBar';
import { TABLE_LABELS } from '../const/tableLabels';
import { useAtom, useAtomValue } from 'jotai';
import { currentBatchSize, currentProjectName, currentTableName } from '../utils/jotai';
import Dropdown from '../components/Dropdown';
import TableTools from '../components/TableTools';
import TextRevealIconButton from '../components/TextRevealIconButton';
import { FormBuilderIcon, ExportIcon, NewSessionIcon, NewDataIcon, TurtleIcon, LizardIcon, MammalIcon, SnakeIcon, ArthropodIcon, AmphibianIcon, SessionIcon } from '../assets/icons';
import FormBuilderModal from '../modals/FormBuilderModal';
import ExportModal from '../modals/ExportModal';
import NewSessionModal from '../modals/NewSessionModal';
import DataInputModal from '../modals/DataInputModal';
import TableManager from '../tools/TableManager';
import { useFirestore } from '../utils/firestore';

export default function TablePage() {
    const [labels, setLabels] = useState();
    const [activeTool, setActiveTool] = useState('none');
    const [currentProject, setCurrentProject] = useAtom(currentProjectName);
    const [tableName, setTableName] = useAtom(currentTableName);
    const batchSize = useAtomValue(currentBatchSize);

    const { entries, setEntries, loadEntries, loadNextBatch, loadPrevBatch } = useFirestore();

    useEffect(() => {
        setLabels(TABLE_LABELS[tableName]);
        loadEntries();
    }, [tableName, batchSize, currentProject, activeTool]);

    const tabsData = [
        { text: 'Turtle', icon: <TurtleIcon /> },
        { text: 'Lizard', icon: <LizardIcon className="h-6" /> },
        { text: 'Mammal', icon: <MammalIcon /> },
        { text: 'Snake', icon: <SnakeIcon /> },
        { text: 'Arthropod', icon: <ArthropodIcon /> },
        { text: 'Amphibian', icon: <AmphibianIcon /> },
        { text: 'Session', icon: <SessionIcon /> },
    ];

    return (
        <PageWrapper>
            <FormBuilderModal
                showModal={activeTool === 'formBuilder'}
                onCancel={() => setActiveTool('none')}
                onOkay={() => console.log('okay then...')}
            />
            <ExportModal
                showModal={activeTool === 'export'}
                onCancel={() => setActiveTool('none')}
            />
            <NewSessionModal
                showModal={activeTool === 'newSession'}
                onCancel={() => setActiveTool('none')}
            />
            <DataInputModal
                showModal={activeTool === 'newData'}
                onCancel={() => setActiveTool('none')}
            />
            <div className="flex justify-between items-center overflow-auto">
                <TabBar
                    tabs={tabsData.map(({ text, icon }) => ({
                        text,
                        icon,
                        onClick: () => setTableName(text),
                        active: text === tableName,
                    }))}
                />
                <div className="flex items-center px-5 space-x-5">
                    <div>Project: </div>
                    <Dropdown
                        onClickHandler={(selectedOption) => {
                            if (selectedOption !== currentProject)
                                setCurrentProject(selectedOption.replace(/\s/g, ''));
                        }}
                        value={currentProject.replace(/([a-z])([A-Z])/g, "$1 $2")}
                        options={['Gateway', 'Virgin River', 'San Pedro']}
                    />
                </div>
            </div>

            <div>
                <TableManager
                    name={tableName}
                    labels={labels}
                    entries={entries}
                    setEntries={setEntries}
                />
                <div className="flex justify-between overflow-auto">
                    <TableTools>
                        <TextRevealIconButton
                            text="Form Builder"
                            icon={<FormBuilderIcon />}
                            onClick={() => setActiveTool('formBuilder')}
                        />
                        <TextRevealIconButton
                            text="Export to CSV"
                            icon={<ExportIcon />}
                            onClick={() => setActiveTool('export')}
                        />
                        <TextRevealIconButton
                            text="New Session"
                            icon={<NewSessionIcon />}
                            onClick={() => setActiveTool('newSession')}
                        />
                        <TextRevealIconButton
                            text="New Data Entry"
                            icon={<NewDataIcon />}
                            onClick={() => setActiveTool('newData')}
                        />
                    </TableTools>
                    <Pagination loadPrevBatch={loadPrevBatch} loadNextBatch={loadNextBatch} />
                </div>
            </div>
        </PageWrapper>
    );
}
