import { useState } from 'react';
import Modal from '../components/Modal';
import TabBar from '../components/TabBar';
import { CSVLink } from 'react-csv';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAtom, useAtomValue } from 'jotai';
import { appMode, currentProjectName } from '../utils/jotai';
import InnerModalWrapper from './InnerModalWrapper';
import { _ } from 'lodash';
import { TABLE_LABELS, dynamicArthropodLabels, getKey } from '../const/tableLabels';
import { LizardIcon, SessionIcon } from '../assets/icons';
import { ProjectField } from '../components/FormFields';
import React from 'react';

export default function ExportModal({ showModal, onCancel }) {
    const [activeTab, setActiveTab] = useState('Data Form');
    const [currentProject, setCurrentProject] = useAtom(currentProjectName);

    return (
        <Modal
            showModal={showModal}
            title="Export"
            text="Choose export options."
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
                {activeTab === 'Data Form' ? <DataForm /> : <SessionForm />}
            </InnerModalWrapper>
        </Modal>
    );
}

const Tabs = ({ activeTab, setActiveTab, currentProject, setCurrentProject }) => (
    <div className="flex justify-between items-center overflow-auto bg-neutral-100 dark:bg-neutral-700">
        <TabBar
            tabs={[
                {
                    text: 'Sessions',
                    icon: <SessionIcon />,
                    active: activeTab === 'Session Form',
                    onClick: () => setActiveTab('Session Form'),
                },
                {
                    text: 'Critters',
                    icon: <LizardIcon className="h-6" />,
                    active: activeTab === 'Data Form',
                    onClick: () => setActiveTab('Data Form'),
                },
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

const DataForm = () => {
    const environment = useAtomValue(appMode);
    const project = useAtomValue(currentProjectName);
    const forms = ['Turtle', 'Lizard', 'Mammal', 'Snake', 'Arthropod', 'Amphibian'];
    const [formsToInclude, setFormsToInclude] = useState(
        forms.reduce((acc, form) => ({ ...acc, [form]: false }), {}),
    );
    const [buttonText, setButtonText] = useState('Generate CSV');
    const [csvData, setCsvData] = useState([]);
    const [disabledState, setDisabledState] = useState(false);

    const generateCSV = (labels, entries) => {
        if (!labels || !entries) return [];

        const modifiedLabels = labels.flatMap((label) =>
            label === 'Date & Time' ? ['Date', 'Time'] : label,
        );

        const csvData = [modifiedLabels];

        entries.forEach((entry) => {
            const row = labels.flatMap((label) => {
                if (label === 'Date & Time') {
                    const dateTime = entry[getKey(label, 'Data')];
                    if (!dateTime) return ['N/A', 'N/A'];

                    const [date, time] = dateTime.split(' ');
                    return [date, time];
                }
                return label !== 'Actions' ? entry[getKey(label, 'Data')] || 'N/A' : '';
            });

            csvData.push(row);
        });

        return csvData;
    };

    const generateCsvData = async () => {
        setButtonText('Generating CSV Data...');
        const entries = [];
        const collectionName = environment === 'live' ? `${project}Data` : `Test${project}Data`;
        const selectedTaxas = forms
            .filter((form) => formsToInclude[form])
            .map((form) => (form === 'Arthropod' ? 'N/A' : form));

        const collectionSnapshot = await getDocs(
            query(collection(db, collectionName), where('taxa', 'in', selectedTaxas)),
        );
        collectionSnapshot.forEach((doc) => entries.push(doc.data()));

        entries.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

        const labelArray = await Promise.all(
            forms
                .filter((form) => formsToInclude[form])
                .map(async (form) =>
                    form === 'Arthropod' ? dynamicArthropodLabels() : TABLE_LABELS[form],
                ),
        );
        const uniqueLabels = _.union(...labelArray);

        setCsvData(generateCSV(uniqueLabels, entries));
        setDisabledState(true);
        setButtonText('CSV Generated');
    };

    const clearData = () => {
        setDisabledState(false);
        setFormsToInclude(forms.reduce((acc, form) => ({ ...acc, [form]: false }), {}));
        setButtonText('Generate CSV');
        setCsvData([]);
    };

    return (
        <div className="flex flex-col items-center p-10 max-w-full-modal-width max-h-full-modal-content-height">
            <h1 className="text-xl m-2">Please select the forms to include in the file</h1>
            {forms.map((form) => (
                <div key={form} className="flex items-center mx-2">
                    <input
                        className="mr-2 w-4"
                        checked={formsToInclude[form]}
                        onChange={() =>
                            setFormsToInclude((prev) => ({ ...prev, [form]: !prev[form] }))
                        }
                        type="checkbox"
                        id={form}
                    />
                    <label htmlFor={form}>{form}</label>
                </div>
            ))}
            <button className="m-2 button" onClick={generateCsvData} disabled={disabledState}>
                {buttonText}
            </button>
            {csvData.length > 0 && (
                <div>
                    <CSVLink data={csvData} filename={`dataForm${Date.now()}.csv`}>
                        <button className="m-2 button" onClick={clearData}>
                            Download CSV
                        </button>
                    </CSVLink>
                    <button className="m-2 button" onClick={clearData}>
                        Clear Form
                    </button>
                </div>
            )}
        </div>
    );
};

const SessionForm = () => {
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
        const collectionName =
            environment === 'live' ? `${project}Session` : `Test${project}Session`;

        const collectionSnapshot = await getDocs(collection(db, collectionName));
        collectionSnapshot.forEach((doc) => entries.push(doc.data()));

        entries.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

        const tempCsvData = entries.map((entry) => {
            const [date, time] = entry.dateTime ? entry.dateTime.split(' ') : ['N/A', 'N/A'];

            return {
                Year: entry.year || 'N/A',
                Date: date,
                Time: time,
                Recorder: entry.recorder || 'N/A',
                Handler: entry.handler || 'N/A',
                Site: entry.site || 'N/A',
                Array: entry.array || 'N/A',
                'No Captures': entry.noCaptures || 'N/A',
                'Trap Status': entry.trapStatus || 'N/A',
                'Comments About The Array': entry.commentsAboutTheArray || 'N/A',
            };
        });

        setCsvData(tempCsvData);
        setDisabledState(true);
        setButtonText('CSV Generated');
    };

    return (
        <div className="flex flex-col items-center p-10">
            <h1 className="text-xl m-2">Download Session Entries</h1>
            <button className="m-2 button" onClick={generateCSV} disabled={disabledState}>
                {buttonText}
            </button>
            {csvData.length > 0 && (
                <div>
                    <CSVLink
                        data={csvData}
                        filename={`sessionForm${Date.now()}.csv`}
                        headers={[
                            { label: 'Session Date/Time', key: 'dateTime' },
                            { label: 'Recorder', key: 'recorder' },
                            { label: 'Handler', key: 'handler' },
                            { label: 'Site', key: 'site' },
                            { label: 'Array', key: 'array' },
                            { label: 'No Captures', key: 'noCaptures' },
                            { label: 'Trap Status', key: 'trapStatus' },
                            { label: 'Comments About The Array', key: 'commentsAboutTheArray' },
                        ]}
                    >
                        <button className="m-2 button" onClick={clearData}>
                            Download CSV
                        </button>
                    </CSVLink>
                    <button className="m-2 button" onClick={clearData}>
                        Clear Form
                    </button>
                </div>
            )}
        </div>
    );
};
