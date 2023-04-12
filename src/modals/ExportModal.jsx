import { useState, useRef } from "react";
import Modal from "../components/Modal";
import TabBar from '../components/TabBar'
import { CSVLink } from "react-csv";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

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
        >
        <InnerModalWrapper>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {tools[activeTab]}
        </InnerModalWrapper>
        </Modal>
    );
}

const InnerModalWrapper = ({children}) => (
    <div className='flex-col w-full-modal-width h-full-modal-content-height max-w-5xl'>
        {children}
    </div>
)

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

    const [formsToInclude, setFormsToInclude] = useState({
        'Turtle': false,
        'Lizard': false,
        'Mammal': false,
        'Snake': false,
        'Arthropod': false,
        'Amphibian': false,
    })
    const [buttonText, setButtonText] = useState('Download CSV');
    const [csvData, setCsvData] = useState([]);
    const csvRef = useRef();

    const generateCsvData = async () => {
        const entries = [];
        const projects = ['Gateway, SanPedro, VirginRiver'];
        for (const form of forms) {
            if (formsToInclude[form]) {
                for (const project of projects) {
                    const collectionSnapshot = await getDocs(collection(db, `${project}Data`));
                    entries.push(...collectionSnapshot.docs);
                }
            }
        }
        let tempCsvData = [];

        // TODO: dynamically fetch arthopod labels and use those instead of the hardcoded ones!

        for (const entry of entries) {
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
                aran: entry.aran,
                auch: entry.auch,
                blat: entry.blat,
                chil: entry.chil,
                cole: entry.cole,
                crus: entry.crus,
                derm: entry.derm,
                diel: entry.diel,
                dipt: entry.dipt,
                hete: entry.hete,
                hyma: entry.hyma,
                hymb: entry.hymh,
                lepi: entry.lepi,
                mant: entry.mant,
                orth: entry.orht,
                pseu: entry.pseu,
                scor: entry.scor,
                soli: entry.soli,
                thys: entry.thys,
                unki: entry.unki,
                micro: entry.micro,
            });
        }
        setCsvData(tempCsvData);
    }   

    const downloadForms = async () => {
        setButtonText('Loading...');
        await generateCsvData();
        csvRef.current.click();
    }
    
    return (
        <div>
            <h1 className='text-xl m-2'>Please select the forms to include in the file</h1>
            {forms.map(form => (
                <div 
                    key={form} 
                    className='flex items-center mx-2'
                    onClick={() => {
                        setFormsToInclude({...formsToInclude, [form]: !formsToInclude[form]});
                    }}
                >
                    <input 
                        className="mr-2 w-4"
                        value={formsToInclude[form]}
                        type='checkbox' 
                        id={form} 
                    />
                    <label for={form}>{form}</label>
                </div>
            ))}
                <button onClick={() => downloadForms()} className="m-2 button">{buttonText}</button>
            <CSVLink
                ref={csvRef}
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
                filename="dataForm.csv"
            />
        </div>
    )
}

const SessionForm = () => {
    const [buttonText, setButtonText] = useState('Download CSV');
    const [csvData, setCsvData] = useState();


    const downloadForms = () => {
        
    }
    
    return (
        <div>
            <h1 className='text-xl m-2'>Download Session Entries</h1>
            <CSVLink
                data={csvData}
                filename="sessionForm.csv"
            >
                <button className="m-2 button">{buttonText}</button>
            </CSVLink>        
        </div>
    )
}