import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TabBar from '../components/TabBar'
import { CSVLink } from "react-csv";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAtomValue } from "jotai";
import { currentProjectName } from "../utils/jotai";
import { getArthropodLabels } from "../utils/firestore";
import InnerModalWrapper from "./InnerModalWrapper";

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

    const generateCsvData = async () => {
        setButtonText("Generating CSV Data...")
        const entries = [];
        const collectionName = `Test${project}Data`
        const selectedTaxas = []
        for (const form in formsToInclude) {
            if (formsToInclude[form]) {
                if (form === 'Arthropod') selectedTaxas.push('N/A');
                else selectedTaxas.push(form);
            }
        }
        for (const form of forms) {
            if (formsToInclude[form]) {
                const collectionSnapshot = await getDocs(query(
                    collection(db, collectionName),
                    where('taxa', 'in', selectedTaxas)
                ));
                collectionSnapshot.forEach(documentSnapshot => 
                    entries.push(documentSnapshot.data()))
            }
        }

        let tempCsvData = [];


        const arthropodLabels = await getArthropodLabels();

        for (const entry of entries) {
            const arthropodDataObject = {}
            arthropodLabels.forEach(label => {
                arthropodDataObject[label.toLowerCase()] = entry[label.toLowerCase()]
            })


            tempCsvData.push({
                sessionDateTime: new Date(entry.sessionDateTime).toLocaleString(),
                dateTime: new Date(entry.dateTime).toLocaleString(),
                fenceTrap: entry.fenceTrap,
                taxa: entry.taxa,
                speciesCode: entry.speciesCode,
                genus: entry.genus,
                species: entry.species,
                toeClipCode: entry.toeClipCode,
                recapture: entry.recapture,
                svl: entry.svlMm,
                vtl: entry.vtlMm,
                regenTail: entry.regenTail,
                otl: entry.otlMm,
                hatchling: entry.hatchling,
                mass: entry.massG,
                sex: entry.sex,
                dead: entry.dead,
                comments: entry.comments,
                predator: entry.predator,
                ...arthropodDataObject,
            });
        }


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
                headers={[
                    {label: 'Session Date/Time', key: 'sessionDateTime'},
                    {label: 'Date/Time', key: 'dateTime'},
                    {label: 'Fence Trap', key: 'fenceTrap'},
                    {label: 'Taxa', key: 'taxa'},
                    {label: 'Species Code', key: 'speciesCode'},
                    {label: 'Genus', key: 'genus'},
                    {label: 'Species', key: 'species'},
                    {label: 'Toe-Clip Code', key: 'toeClipCode'},
                    {label: 'Recapture', key: 'recapture'},
                    {label: 'SVL(mm)', key: 'svl'},
                    {label: 'VTL(mm)', key: 'vtl'},
                    {label: 'Regen Tail', key: 'regenTail'},
                    {label: 'OTL(mm)', key: 'otl'},
                    {label: 'Hatchling', key: 'hatchling'},
                    {label: 'Mass(g)', key: 'mass'},
                    {label: 'Sex', key: 'sex'},
                    {label: 'Dead?', key: 'dead'},
                    {label: 'Comments', key: 'comments'},
                    {label: 'Predator?', key: 'predator'},
                    {label: 'ARAN', key: 'aran'},
                    {label: 'AUCH', key: 'auch'},
                    {label: 'BLAT', key: 'blat'},
                    {label: 'CHIL', key: 'chil'},
                    {label: 'COLE', key: 'cole'},
                    {label: 'CRUS', key: 'crus'},
                    {label: 'DERM', key: 'derm'},
                    {label: 'DIEL', key: 'diel'},
                    {label: 'DIPT', key: 'dipt'},
                    {label: 'HETE', key: 'hete'},
                    {label: 'HYMA', key: 'hyma'},
                    {label: 'HYMB', key: 'hymb'},
                    {label: 'LEPI', key: 'lepi'},
                    {label: 'MANT', key: 'mant'},
                    {label: 'ORTH', key: 'orth'},
                    {label: 'PSEU', key: 'pseu'},
                    {label: 'SCOR', key: 'scor'},
                    {label: 'SOLI', key: 'soli'},
                    {label: 'THYS', key: 'thys'},
                    {label: 'UNKI', key: 'unki'},
                    {label: 'MICRO', key: 'micro'}
                ]}
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