import { useState } from "react";
import Modal from "../components/Modal";
import TabBar from '../components/TabBar';
import { CSVLink } from "react-csv";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAtom, useAtomValue } from "jotai";
import { appMode, currentProjectName } from "../utils/jotai";
import InnerModalWrapper from "./InnerModalWrapper";
import _ from "lodash";
import { TABLE_LABELS, dynamicArthropodLabels, getKey } from "../const/tableLabels";
import { LizardIcon, SessionIcon } from "../assets/icons";
import { ProjectField } from "../components/FormFields";
import React from 'react';
import Button from "../components/Button";

export default function ExportModal({ showModal, onCancel }) {
    const [activeTab, setActiveTab] = useState('Data Form');
    const [currentProject, setCurrentProject] = useAtom(currentProjectName);
    const [exportFormat, setExportFormat] = useState('Standard');

    return (
        <Modal
            showModal={showModal}
            title='Export'
            text='Choose export options.'
            onCancel={onCancel}
            buttonOptions={{
                cancel: 'Close',
                okay: '',
            }}
        >
            <InnerModalWrapper>
                <Tabs 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    currentProject={currentProject} 
                    setCurrentProject={setCurrentProject}
                />
                <ExportFormatSelector 
                    exportFormat={exportFormat} 
                    setExportFormat={setExportFormat} 
                />
                {activeTab === 'Data Form' ? 
                    <DataForm exportFormat={exportFormat} /> : 
                    <SessionForm exportFormat={exportFormat} />
                }
            </InnerModalWrapper>
        </Modal>
    );
}

const Tabs = ({ activeTab, setActiveTab, currentProject, setCurrentProject }) => (
    <div className="flex justify-between items-center overflow-auto bg-neutral-100 dark:bg-neutral-700">
        <TabBar
            tabs={[
                { text: 'Sessions', icon: <SessionIcon />, active: activeTab === 'Session Form', onClick: () => setActiveTab('Session Form') },
                { text: 'Critters', icon: <LizardIcon className="h-6" />, active: activeTab === 'Data Form', onClick: () => setActiveTab('Data Form') },
            ]}
        />
        <div className="flex items-center px-5 space-x-5">
            <ProjectField
                project={currentProject.replace(/([a-z])([A-Z])/g, '$1 $2')}
                setProject={(e) => setCurrentProject(e.replace(/ /g, ''))}
            />
        </div>
    </div>
);

const ExportFormatSelector = ({ exportFormat, setExportFormat }) => (
    <div className="bg-white dark:bg-neutral-800 p-3 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center space-x-4">
            <span className="font-medium text-sm">Export Format:</span>
            <div className="flex space-x-3">
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="radio"
                        className="form-radio h-4 w-4 text-asu-maroon accent-asu-maroon"
                        name="exportFormat"
                        value="Standard"
                        checked={exportFormat === 'Standard'}
                        onChange={(e) => setExportFormat(e.target.value)}
                    />
                    <span className="ml-2 text-sm">Standard</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="radio"
                        className="form-radio h-4 w-4 text-asu-maroon accent-asu-maroon"
                        name="exportFormat"
                        value="Game and Fish"
                        checked={exportFormat === 'Game and Fish'}
                        onChange={(e) => setExportFormat(e.target.value)}
                    />
                    <span className="ml-2 text-sm">Game and Fish</span>
                </label>
            </div>
        </div>
    </div>
);

const DataForm = ({ exportFormat }) => {
    const environment = useAtomValue(appMode);
    const project = useAtomValue(currentProjectName);
    const forms = ['Turtle', 'Lizard', 'Mammal', 'Snake', 'Arthropod', 'Amphibian'];
    const [formsToInclude, setFormsToInclude] = useState(forms.reduce((acc, form) => ({ ...acc, [form]: false }), {}));
    const [buttonText, setButtonText] = useState('Generate CSV');
    const [csvData, setCsvData] = useState([]);
    const [disabledState, setDisabledState] = useState(false);

    const generateStandardCSV = (labels, entries) => {
        if (!labels || !entries) return [];
        const csvData = [labels];
        entries.forEach(entry => {
            const row = labels.map(label => (label !== 'Actions' ? entry[getKey(label, 'Data')] : ''));
            csvData.push(row);
        });
        return csvData;
    };

    const generateGameAndFishCSV = (labels, entries) => {
        if (!labels || !entries) return [];
        
        // Define the columns required by Game and Fish format
        const gameAndFishLabels = [
            'Species Code', 'Scientific Name', 'Location', 'Date', 
            'Time', 'Sex', 'Age', 'Measurement', 'Site Details', 'Notes'
        ];
        
        const csvData = [gameAndFishLabels];
        
        entries.forEach(entry => {
            const scientificName = entry.genus && entry.species 
                ? `${entry.genus} ${entry.species}` 
                : 'Not specified';
                
            const dateTimeArr = entry.dateTime ? entry.dateTime.split(' ') : ['', ''];
            
            // Create the row in Game and Fish format
            const row = [
                entry.speciesCode || entry.taxaCode || '',
                scientificName,
                `${entry.site || ''}, ${entry.array || ''}`,
                dateTimeArr[0] || '',
                dateTimeArr[1] || '',
                entry.sex || '',
                entry.ageClass || entry.age || '',
                entry.svl || entry.weight || '',
                entry.trapNumber || entry.captureMethod || '',
                entry.comments || ''
            ];
            
            csvData.push(row);
        });
        
        return csvData;
    };

    const generateCsvData = async () => {
        setButtonText("Generating CSV Data...");
        const entries = [];
        const collectionName = environment === 'live' ? `${project}Data` : `Test${project}Data`;
        const selectedTaxas = forms.filter(form => formsToInclude[form]).map(form => (form === 'Arthropod' ? 'N/A' : form));

        if (selectedTaxas.length === 0) {
            setButtonText('Select at least one form');
            setTimeout(() => setButtonText('Generate CSV'), 2000);
            return;
        }

        const collectionSnapshot = await getDocs(query(collection(db, collectionName), where('taxa', 'in', selectedTaxas)));
        collectionSnapshot.forEach(doc => entries.push(doc.data()));

        entries.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

        const labelArray = await Promise.all(
            forms.filter(form => formsToInclude[form]).map(async form => (form === 'Arthropod' ? dynamicArthropodLabels() : TABLE_LABELS[form]))
        );
        const uniqueLabels = _.union(...labelArray);

        // Generate CSV based on selected format
        if (exportFormat === 'Standard') {
            setCsvData(generateStandardCSV(uniqueLabels, entries));
        } else { // Game and Fish format
            setCsvData(generateGameAndFishCSV(uniqueLabels, entries));
        }
        
        setDisabledState(true);
        setButtonText('CSV Generated');
    };

    const clearData = () => {
        setDisabledState(false);
        setFormsToInclude(forms.reduce((acc, form) => ({ ...acc, [form]: false }), {}));
        setButtonText('Generate CSV');
        setCsvData([]);
    };

    const getFormattedDate = () => {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const getFileName = () => {
        const formatSuffix = exportFormat === 'Standard' ? '' : '-GameAndFish';
        return `${project}Data${formatSuffix}-${getFormattedDate()}.csv`;
    };

    return (
        <div className="flex flex-col items-center p-6 max-w-full-modal-width max-h-full-modal-content-height">
            <h1 className='text-xl mb-3'>Please select the forms to include in the file</h1>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
                {forms.map(form => (
                    <div key={form} className='flex items-center'>
                        <input
                            className="mr-2 w-4"
                            checked={formsToInclude[form]}
                            onChange={() => setFormsToInclude(prev => ({ ...prev, [form]: !prev[form] }))}
                            type='checkbox'
                            id={form}
                        />
                        <label htmlFor={form}>{form}</label>
                    </div>
                ))}
            </div>
            <div className="flex flex-col items-center">
                <Button 
                    text={buttonText}
                    onClick={generateCsvData} 
                    disabled={disabledState}
                    className="mb-3"
                />
                
                {csvData.length > 0 &&
                    <div className="flex space-x-3">
                        <CSVLink data={csvData} filename={getFileName()}>
                            <Button text="Download CSV" onClick={clearData} />
                        </CSVLink>
                        <Button text="Clear Form" onClick={clearData} />
                    </div>
                }
            </div>
        </div>
    );
};

const SessionForm = ({ exportFormat }) => {
    const environment = useAtomValue(appMode);
    const project = useAtomValue(currentProjectName);
    const [buttonText, setButtonText] = useState('Generate CSV');
    const [csvData, setCsvData] = useState([]);
    const [disabledState, setDisabledState] = useState(false);

    const clearData = () => {
        setDisabledState(false);
        setButtonText('Generate CSV');
        setCsvData([]);
    };

    const generateCSV = async () => {
        setButtonText('Generating CSV Data...');
        const entries = [];
        const collectionName = environment === 'live' ? `${project}Session` : `Test${project}Session`;

        const collectionSnapshot = await getDocs(collection(db, collectionName));
        collectionSnapshot.forEach(doc => entries.push(doc.data()));

        entries.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

        // For session data, the standard format is used for both export types,
        // but for Game and Fish we add extra metadata headers
        let tempCsvData = entries.map(entry => ({
            dateTime: entry.dateTime,
            recorder: entry.recorder,
            handler: entry.handler,
            site: entry.site,
            array: entry.array,
            noCaptures: entry.noCaptures,
            trapStatus: entry.trapStatus,
            commentsAboutTheArray: entry.commentsAboutTheArray,
        }));

        if (exportFormat === 'Game and Fish') {
            // Add metadata at the beginning of the CSV
            const metadata = [
                { project: project, exportType: "Game and Fish Format", date: new Date().toLocaleDateString() },
                {} // Empty row for separation
            ];
            tempCsvData = [...metadata, ...tempCsvData];
        }

        setCsvData(tempCsvData);
        setDisabledState(true);
        setButtonText('CSV Generated');
    };

    const getFormattedDate = () => {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const getFileName = () => {
        const formatSuffix = exportFormat === 'Standard' ? '' : '-GameAndFish';
        return `${project}Sessions${formatSuffix}-${getFormattedDate()}.csv`;
    };

    const getHeaders = () => {
        const baseHeaders = [
            { label: 'Session Date/Time', key: 'dateTime' },
            { label: 'Recorder', key: 'recorder' },
            { label: 'Handler', key: 'handler' },
            { label: 'Site', key: 'site' },
            { label: 'Array', key: 'array' },
            { label: 'No Captures', key: 'noCaptures' },
            { label: 'Trap Status', key: 'trapStatus' },
            { label: 'Comments About The Array', key: 'commentsAboutTheArray' }
        ];
        
        if (exportFormat === 'Game and Fish') {
            return [
                { label: 'Project', key: 'project' },
                { label: 'Export Type', key: 'exportType' },
                { label: 'Date Exported', key: 'date' },
                ...baseHeaders
            ];
        }
        
        return baseHeaders;
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className='text-xl mb-4'>Download Session Entries</h1>
            <Button 
                text={buttonText}
                onClick={generateCSV} 
                disabled={disabledState}
                className="mb-3"
            />
            
            {csvData.length > 0 &&
                <div className="flex space-x-3">
                    <CSVLink data={csvData} filename={getFileName()} headers={getHeaders()}>
                        <Button text="Download CSV" onClick={clearData} />
                    </CSVLink>
                    <Button text="Clear Form" onClick={clearData} />
                </div>
            }
        </div>
    );
};
