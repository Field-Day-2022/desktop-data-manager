// https://firebase.google.com/docs/firestore/query-data/query-cursors
// https://firebase.google.com/docs/firestore/query-data/order-limit-data
import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import {
    collection,
    query,
    orderBy,
    startAfter,
    limit,
    getDocs,
    startAt,
    where,
} from 'firebase/firestore';
import PageWrapper from './PageWrapper';
import { Pagination } from '../components/Pagination';
import TabBar from '../components/TabBar';
import { TABLE_LABELS } from '../const/tableLabels';
import { useAtom } from 'jotai';
import { appMode, currentBatchSize, currentProjectName, currentTableName } from '../utils/jotai';
import Dropdown from '../components/Dropdown';
import { notify, Type } from '../components/Notifier';
import TableTools from '../components/TableTools';
import TextRevealIconButton from '../components/TextRevealIconButton';
import { FormBuilderIcon, ExportIcon, NewSessionIcon, NewDataIcon, TurtleIcon, LizardIcon, MammalIcon, SnakeIcon, ArthropodIcon, AmphibianIcon, SessionIcon } from '../assets/icons';
import FormBuilderModal from '../modals/FormBuilderModal';
import ExportModal from '../modals/ExportModal';
import NewSessionModal from '../modals/NewSessionModal';
import DataInputModal from '../modals/DataInputModal';
import TableManager from '../tools/TableManager';
import { getCollectionName } from '../utils/firestore';

export default function TablePage() {
    const [entries, setEntries] = useState([]);
    const [documentQueryCursor, setDocumentQueryCursor] = useState();
    const [queryCursorStack, setQueryCursorStack] = useState([]);
    const [labels, setLabels] = useState();
    const [activeTool, setActiveTool] = useState('none');

    const [currentProject, setCurrentProject] = useAtom(currentProjectName);
    const [tableName, setTableName] = useAtom(currentTableName);
    const [batchSize, setBatchSize] = useAtom(currentBatchSize);
    const [environment, setEnvironment] = useAtom(appMode);

    useEffect(() => {
        setLabels(TABLE_LABELS[tableName]);
        loadEntries();
    }, [tableName, batchSize, currentProject, activeTool]);

    const generateQueryConstraints = ({ whereClause, at, after } = {}) => {
        const collectionName = getCollectionName(environment, currentProject, tableName);
        const constraints = [
            collection(db, collectionName),
            orderBy('dateTime', 'desc'),
            limit(batchSize),];
        whereClause?.length && constraints.push(where(...whereClause));
        at ? constraints.push(startAt(at)) : after && constraints.push(startAfter(after));
        return constraints;
    };

    const loadEntries = async () => {
        const initialQuery = query(
            ...generateQueryConstraints({
                whereClause: tableName !== 'Session' && ['taxa', '==', tableName === 'Arthropod' ? 'N/A' : tableName],
            })
        );

        try {
            const { docs } = await getDocs(initialQuery);
            setEntries(docs);
            const lastVisibleDoc = docs[docs.length - 1];
            setDocumentQueryCursor(lastVisibleDoc);
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    };

    const loadBatch = async (constraints) => {
        const batchQuery = query(...generateQueryConstraints(constraints));
        const batchSnapshot = await getDocs(batchQuery);
        setEntries(batchSnapshot.docs);
        const lastVisibleDoc = batchSnapshot.docs[batchSnapshot.docs.length - 1];
        setDocumentQueryCursor(lastVisibleDoc);
    };

    const loadPrevBatch = async () => {
        if (queryCursorStack.length - 1 < 0) {
            notify(Type.error, 'Unable to go back. This is the first page.');
            return;
        }

        const prevQueryCursor = queryCursorStack[queryCursorStack.length - 1];
        setQueryCursorStack(queryCursorStack.slice(0, -1));

        const constraints = {
            whereClause: tableName !== 'Session' && [
                'taxa',
                '==',
                tableName === 'Arthropod' ? 'N/A' : tableName,
            ],
            at: prevQueryCursor,
        };
        await loadBatch(constraints);
    };

    const loadNextBatch = async () => {
        const constraints = {
            whereClause: tableName !== 'Session' && [
                'taxa',
                '==',
                tableName === 'Arthropod' ? 'N/A' : tableName,
            ],
            after: documentQueryCursor,
        };
        setQueryCursorStack([...queryCursorStack, entries[0]]);
        await loadBatch(constraints);
    };

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
                    tabs={[
                        { text: 'Turtle', icon: <TurtleIcon />, onClick: () => setTableName('Turtle'), active: tableName === 'Turtle' },
                        { text: 'Lizard', icon: <LizardIcon className="h-6" />, onClick: () => setTableName('Lizard'), active: tableName === 'Lizard' },
                        { text: 'Mammal', icon: <MammalIcon />, onClick: () => setTableName('Mammal'), active: tableName === 'Mammal' },
                        { text: 'Snake', icon: <SnakeIcon />, onClick: () => setTableName('Snake'), active: tableName === 'Snake' },
                        { text: 'Arthropod', icon: <ArthropodIcon />, onClick: () => setTableName('Arthropod'), active: tableName === 'Arthropod' },
                        { text: 'Amphibian', icon: <AmphibianIcon />, onClick: () => setTableName('Amphibian'), active: tableName === 'Amphibian' },
                        { text: 'Session', icon: <SessionIcon />, onClick: () => setTableName('Session'), active: tableName === 'Session' },
                    ]}
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
