// https://firebase.google.com/docs/firestore/query-data/query-cursors
// https://firebase.google.com/docs/firestore/query-data/order-limit-data
import { useState, useEffect } from 'react';
import PageWrapper from '../components/containers/PageWrapper';
import { Pagination } from '../components/Pagination';
import TabBar from '../components/TabBar';
import { TABLE_LABELS } from '../const/tableLabels';
import { useAtom, useAtomValue } from 'jotai';
import { currentBatchSize, currentProjectName, currentTableName } from '../utils/jotai';
import TableTools from '../components/TableTools';
import TextRevealIconButton from '../components/TextRevealIconButton';
import { FormBuilderIcon, ExportIcon, NewDataIcon, TurtleIcon, LizardIcon, MammalIcon, SnakeIcon, ArthropodIcon, AmphibianIcon, SessionIcon } from '../assets/icons';
import FormBuilderModal from '../modals/FormBuilderModal';
import ExportModal from '../modals/ExportModal';
import DataInputModal from '../modals/DataInputModal';
import TableManager from '../components/tools/TableManager';
import { usePagination } from '../utils/usePagination';
import { ProjectField } from '../components/forms/Fields';

export default function TablePage() {
    const [labels, setLabels] = useState();
    const [activeTool, setActiveTool] = useState('none');
    const [currentProject, setCurrentProject] = useAtom(currentProjectName);
    const [tableName, setTableName] = useAtom(currentTableName);
    const batchSize = useAtomValue(currentBatchSize);

    const { entries, setEntries, loadBatch, loadNextBatch, loadPrevBatch } = usePagination();

    useEffect(() => {
        setLabels(TABLE_LABELS[tableName]);
        loadBatch();
    }, [tableName, batchSize, currentProject]);

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
            <DataInputModal
                showModal={activeTool === 'dataInput'}
                closeModal={() => setActiveTool('none')}
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
                <div className='pr-2'>
                    <ProjectField
                        setProject={(value) => setCurrentProject(value)}
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
                            text="Input Data"
                            icon={<NewDataIcon />}
                            onClick={() => setActiveTool('dataInput')}
                        />
                    </TableTools>
                    <Pagination loadPrevBatch={loadPrevBatch} loadNextBatch={loadNextBatch} />
                </div>
            </div>
        </PageWrapper>
    );
}