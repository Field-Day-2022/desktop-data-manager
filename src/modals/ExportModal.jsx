import { useState } from "react";
import Modal from "../components/Modal";
import TabBar from '../components/TabBar'
import { CSVLink } from "react-csv";

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
    const [csvData, setCsvData] = useState();

    const downloadForms = () => {
        setButtonText('Loading...');

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
            <CSVLink
                data={csvData}
                filename="dataForm.csv"
            >
                <button className="m-2 button">{buttonText}</button>
            </CSVLink>
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