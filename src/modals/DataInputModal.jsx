import { useState } from "react";
import { NewDataIcon, NewSessionIcon } from "../assets/icons";
import Modal from "../components/Modal";
import { notify, Type } from "../components/Notifier";
import TabBar from "../components/TabBar";
import NewSessionTool from "../tools/NewSessionTool";
import NewEntryForm from "../components/NewEntryForm";
import { uploadNewSession } from "../utils/firestore";
import { useAtomValue } from "jotai";
import { appMode } from "../utils/jotai";

export default function DataInputModal({ showModal, closeModal }) {
    const [activeTab, setActiveTab] = useState('New Data');
    const [modalData, setModalData] = useState({});
    const [sessionProject, setSessionProject] = useState('Gateway')
    const environment = useAtomValue(appMode);

    const tools = {
        'New Data': <NewEntryForm setData={setModalData} />,
        'New Session': <NewSessionTool setData={setModalData} project={sessionProject} setProject={setSessionProject} />,
    };

    const requiredSessionFields = [
        'dateTime',
        'recorder', 'handler',
        'site', 'array',
        'noCaptures', 'trapStatus', 'year']

    const validateSessionData = (data) => {
        console.log('validating session data')
        for (const field of requiredSessionFields) {
            console.log(field, data[field]);
            if (data[field] === '') return false;
        }
        return true;
    };

    const processModalData = (data) => {
        if (activeTab === 'New Data') {
            console.log(data);
            return;
        } else if (activeTab === 'New Session') {
            if (!validateSessionData(data)) {
                notify(Type.error, 'Please fill in all fields before submitting.')
                return false;
            } else {
                if (uploadNewSession(data, sessionProject, environment))
                    notify(Type.success, 'Session data saved.')
                console.log(data);
                return true;
            }
        }
    };

    const onOkay = () => {
        processModalData(modalData);
    };

    return (
        <div>
            <Modal
                showModal={showModal}
                title='Data Input Tool'
                text='Select a tab to create a new data entry or session.'
                onCancel={() => closeModal()}
                onOkay={() => onOkay()}
                buttonOptions={{
                    cancel: 'Close',
                    okay: activeTab === 'New Session' ? 'Submit' : ''
                }}
            >
                <div className='flex-col w-full-modal-width h-full-modal-content-height max-w-5xl'>
                    <div className='bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 h-tab-bar'>
                        <TabBar
                            tabs={[
                                {
                                    text: 'New Data',
                                    icon: <NewDataIcon />,
                                    active: activeTab === 'New Data',
                                    onClick: () => setActiveTab('New Data'),
                                },
                                {
                                    text: 'New Session',
                                    icon: <NewSessionIcon />,
                                    active: activeTab === 'New Session',
                                    onClick: () => setActiveTab('New Session'),
                                },
                            ]}
                        />
                    </div>
                    <div className='flex-grow overflow-auto'>
                        {tools[activeTab]}
                    </div>
                </div>
            </Modal>
        </div>

    );
}