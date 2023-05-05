import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TabBar from '../components/TabBar'
import { CSVLink } from "react-csv";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAtomValue } from "jotai";
import { appMode, currentProjectName } from "../utils/jotai";
import { getArthropodLabels } from "../utils/firestore";
import InnerModalWrapper from "./InnerModalWrapper";
import { _ } from "lodash";
import { TABLE_LABELS, dynamicArthropodLabels, getKey } from "../const/tableLabels";

export default function ExportModal({ showModal, onCancel }) {
    const [ activeTab, setActiveTab ] = useState('Data Form');

    const tools = {
        'Session Form': <SessionForm />,
        'Data Form': <DataForm />
    }
    
    return (
        <Modal
            showModal={showModal}
            title='Export'
            text='Choose export options.'
            onCancel={() => onCancel()}
            buttonOptions={{
                cancel: 'Close',
                okay: '',
            }}
        >
        <InnerModalWrapper>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {tools[activeTab]}
        </InnerModalWrapper>
        </Modal>
    );
}

const Tabs = ({
    activeTab,
    setActiveTab
}) => (
    <div className='bg-neutral-100 flex-shrink-0 h-tab-bar'>
        <TabBar
            tabs={[
                {
                    text: 'Session Forms',
                    active: activeTab === 'Session Form',
                    onClick: () => setActiveTab('Session Form'),
                },
                {
                    text: 'Data Forms',
                    active: activeTab === 'Data Form',
                    onClick: () => setActiveTab('Data Form'),
                },
            ]}
        />
    </div>
)

const DataForm = () => {
    const environment = useAtomValue(appMode);
    const forms = [
        'Turtle',
        'Lizard',
        'Mammal',
        'Snake',
        'Arthropod',
        'Amphibian',
    ]
    const project = useAtomValue(currentProjectName);
    const [formsToInclude, setFormsToInclude] = useState({
        'Turtle': false,
        'Lizard': false,
        'Mammal': false,
        'Snake': false,
        'Arthropod': false,
        'Amphibian': false,
    })
    const [buttonText, setButtonText] = useState('Generate CSV');
    const [csvData, setCsvData] = useState([]);
    const [disabledState, setDisabledState] = useState(false);

    const generateCSV = (labels, entries) => {
        if (!labels || !entries) {
            return [];
        }
        let csvData = [];
        csvData.push(labels);
        entries.forEach((entry) => {
            let row = [];
            labels.forEach((label) => {
                if (label !== 'Actions') {
                    let key = getKey(label, name);
                    row.push(entry[key]);
                }
            });
            csvData.push(row);
        });
        return csvData;
    };

    const generateCsvData = async () => {
        setButtonText("Generating CSV Data...")
        const entries = [];
        let collectionName = `Test${project}Data`
        if (environment === 'live') collectionName = `${project}Data`
        console.log(project)
        console.log(environment)
        console.log(`getting data from ${collectionName}`)
        const selectedTaxas = []
        for (const form in formsToInclude) {
            if (formsToInclude[form]) {
                if (form === 'Arthropod') selectedTaxas.push('N/A');
                else selectedTaxas.push(form);
            }
        }
        console.log(selectedTaxas)
        
        const collectionSnapshot = await getDocs(query(
            collection(db, collectionName),
            where('taxa', 'in', selectedTaxas)
        ));
        collectionSnapshot.forEach(documentSnapshot => 
            entries.push(documentSnapshot.data()))

        let tempCsvData = [];


        const arthropodLabels = await getArthropodLabels();

        entries.sort((a, b) => {
            const dateA = new Date(a.dateTime).getTime();
            const dateB = new Date(b.dateTime).getTime();
            return dateB - dateA;
        })

        // console.log(entries);

        let labelArray = [];
        for (const form in formsToInclude) {
            if (formsToInclude[form]) {
                console.log(`${form} is included`)
                if (form === 'Arthropod') {
                    labelArray = _.union(labelArray, await dynamicArthropodLabels())
                } else {
                    labelArray = _.union(labelArray, TABLE_LABELS[form])
                }
            }
        };
        console.log(labelArray);

        tempCsvData = generateCSV(labelArray, entries);


        // for (const entry of entries) {
        //     const arthropodDataObject = {}
        //     arthropodLabels.forEach(label => {
        //         arthropodDataObject[label.toLowerCase()] = entry[label.toLowerCase()]
        //     })


        //     tempCsvData.push({
        //         year: new Date(entry.sessionDateTime).getFullYear(),
        //         sessionDateTime: new Date(entry.sessionDateTime).toLocaleString(),
        //         dateTime: new Date(entry.dateTime).toLocaleString(),
        //         site: entry.site,
        //         array: entry.array,
        //         fenceTrap: entry.fenceTrap,
        //         taxa: entry.taxa,
        //         speciesCode: entry.speciesCode,
        //         genus: entry.genus,
        //         species: entry.species,
        //         ccl: entry.cclMm,
        //         pl: entry.plMm,
        //         toeClipCode: entry.toeClipCode,
        //         recapture: entry.recapture,
        //         svl: entry.svlMm,
        //         vtl: entry.vtlMm,
        //         regenTail: entry.regenTail,
        //         otl: entry.otlMm,
        //         hatchling: entry.hatchling,
        //         mass: entry.massG,
        //         sex: entry.sex,
        //         dead: entry.dead,
        //         comments: entry.comments,
        //         predator: entry.predator,
        //         ...arthropodDataObject,
        //     });
        // }

        console.log(tempCsvData);

        setCsvData(tempCsvData)
        setDisabledState(true);
        setButtonText('CSV Generated');
    }   

    const clearData = () => {
        setDisabledState(false);
        setFormsToInclude({
            'Turtle': false,
            'Lizard': false,
            'Mammal': false,
            'Snake': false,
            'Arthropod': false,
            'Amphibian': false,
        })
        setButtonText('Generate CSV');
        setCsvData([])
    }

    return (
        <div>
            <h1 className='text-xl m-2'>Please select the forms to include in the file</h1>
            {forms.map(form => (
                <div 
                    key={form} 
                    className='flex items-center mx-2'
                >
                    <input 
                        className="mr-2 w-4"
                        checked={formsToInclude[form]}
                        onChange={() => setFormsToInclude({...formsToInclude, [form]: !formsToInclude[form]})}
                        type='checkbox' 
                        id={form} 
                    />
                    <label 
                        htmlFor={form}
                    >{form}</label>
                </div>
            ))}
            <button 
                className="m-2 button" 
                onClick={() => generateCsvData()}
                disabled={disabledState}
            >{buttonText}</button>
            {csvData.length > 0 && 
            <div>
            <CSVLink
                data={csvData}
                filename={`dataForm${new Date().getTime()}.csv`}
            >
                <button className="m-2 button" onClick={clearData}>Download CSV</button>
            </CSVLink>
            <button className="m-2 button" onClick={clearData}>Clear Form</button>
            </div>
            }
        </div>
    )
}

const SessionForm = () => {
    const project = useAtomValue(currentProjectName);
    const [buttonText, setButtonText] = useState('Generate CSV');
    const [csvData, setCsvData] = useState([]);
    const [disabledState, setDisabledState] = useState(false);

    const clearData = () => {
        setDisabledState(false);
        setButtonText('Generate CSV');
        setCsvData([])
    }

    const generateCSV = async () => {
        setButtonText('Generating CSV Data...')
        const entries = []
        const collectionName = `Test${project}Session`
        const collectionSnapshot = await getDocs(
            collection(db, collectionName)
        )
        collectionSnapshot.forEach(documentSnapshot => {
            entries.push(documentSnapshot.data())
        })
        const tempCsvData = []
        for (const entry of entries) {
            tempCsvData.push({
                dateTime: new Date(entry.dateTime).toLocaleString(),
                recorder: entry.recorder,
                handler: entry.handler,
                site: entry.site,
                array: entry.array,
                noCapture: entry.noCaptures,
                trapStatus: entry.trapStatus,
                comments: entry.commentsAboutTheArray,
            })
        }
        setCsvData(tempCsvData)
        setDisabledState(true)
        setButtonText('CSV Generated');
    }
    
    return (
        <div>
            <h1 className='text-xl m-2'>Download Session Entries</h1>
            <button 
                className="m-2 button" 
                onClick={generateCSV}
                disabled={disabledState}
            >{buttonText}</button>
            {csvData.length > 0 && 
            <div>
                <CSVLink
                    data={csvData}
                    headers={[
                        {label: 'Session Date/Time', key: 'dateTime'},
                        {label: 'Recorder', key: 'recorder'},
                        {label: 'Handler', key: 'handler'},
                        {label: 'Site', key: 'site'},
                        {label: 'Array', key: 'array'},
                        {label: 'No Captures', key: 'noCaptures'},
                        {label: 'Trap Status', key: 'trapStatus'},
                        {label: 'Comments About The Array', key: 'commentsAboutTheArray'}
                    ]}
                    filename={`sessionForm${new Date().getTime()}.csv`}
                >
                    <button className="m-2 button" onClick={clearData}>Download CSV</button>
                </CSVLink>
                <button className="m-2 button" onClick={clearData}>Clear Form</button>
            </div>
            }
        </div>
    )
}