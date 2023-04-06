import { useState, useEffect } from 'react';
import PageWrapper from './PageWrapper';
import { Pagination } from '../components/Pagination';
import TabBar from '../components/TabBar';
import { TABLE_LABELS, dynamicArthropodLabels } from '../const/tableLabels';
import DataManager from '../tools/DataManager';
import { useAtom } from 'jotai';
import { currentBatchSize, currentProjectName, currentTableName } from '../utils/jotai';
import Dropdown from '../components/Dropdown';
import TableTools from '../components/TableTools';
import { FormBuilderIcon, ExportIcon, NewSessionIcon, NewDataIcon, TurtleIcon, LizardIcon, MammalIcon, SnakeIcon, ArthropodIcon, AmphibianIcon, SessionIcon } from '../assets/icons';
import FormBuilderModal from '../modals/FormBuilderModal';
import ExportModal from '../modals/ExportModal';
import NewSessionModal from '../modals/NewSessionModal';
import NewDataModal from '../modals/NewDataModal';
import { usePagination } from '../hooks/usePagination';
import Button from '../components/Button';

export default function TablePage() {
    const [entries, setEntries] = useState([]);
    const [labels, setLabels] = useState();
    const [activeTool, setActiveTool] = useState('none');
    const [labelsLoaded, setLabelsLoaded] = useState(false);

    const [currentProject, setCurrentProject] = useAtom(currentProjectName);
    const [tableName, setTableName] = useAtom(currentTableName);
    const [batchSize, setBatchSize] = useAtom(currentBatchSize);

    const { loadBatch, loadNextBatch, loadPreviousBatch } = usePagination(setEntries);

    // entries[0] && console.log(entries[0].data());

    const loadDynamicArthropodLabels = async () => {
        setLabels(await dynamicArthropodLabels())
    }

    useEffect(() => {
        if (tableName === 'Arthropod') {
            loadDynamicArthropodLabels();
        } else {
            setLabels(TABLE_LABELS[tableName])
        }
        setLabelsLoaded(true);
        loadBatch()
    }, [tableName, batchSize, currentProject, labelsLoaded]);

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
                onOkay={() => setActiveTool('none')}
                setLabelsLoaded={setLabelsLoaded}
            />
            <ExportModal
                showModal={activeTool === 'export'}
                onCancel={() => setActiveTool('none')}
            />
            <NewSessionModal
                showModal={activeTool === 'newSession'}
                onCancel={() => setActiveTool('none')}
            />
            <NewDataModal
                showModal={activeTool === 'newData'}
                onCancel={() => setActiveTool('none')}
            />
            <div className="flex justify-between items-center overflow-auto">
                <TabBar 
                    tabs={tabsData.map((tab) => ({
                        ...tab,
                        active: tab.text === tableName,
                        onClick: () => setTableName(tab.text),
                    }))}
                />
                <div className="flex items-center px-5 space-x-5">
                    <Dropdown
                        label="Project"
                        layout="horizontal"
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
                <DataManager
                    name={tableName}
                    labels={labels}
                    entries={entries}
                    setEntries={setEntries}
                />
                <div className="flex justify-between overflow-auto">
                    <TableTools>
                        <Button
                            flexible={true}
                            text="Form Builder"
                            icon={<FormBuilderIcon />}
                            onClick={() => setActiveTool('formBuilder')}
                        />
                        <Button
                            flexible={true}
                            text="Export to CSV"
                            icon={<ExportIcon />}
                            onClick={() => setActiveTool('export')}
                        />
                        <Button
                            flexible={true}
                            text="New Session"
                            icon={<NewSessionIcon />}
                            onClick={() => setActiveTool('newSession')}
                        />
                        <Button
                            flexible={true}
                            text="New Data Entry"
                            icon={<NewDataIcon />}
                            onClick={() => setActiveTool('newData')}
                        />
                    </TableTools>
                    <Pagination
                        loadPrevBatch={loadPreviousBatch}
                        loadNextBatch={loadNextBatch} />
                </div>
            </div>
        </PageWrapper>
    );
}
