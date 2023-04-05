import { useState } from "react";
import { NewDataIcon, NewSessionIcon } from "../assets/icons";
import Modal from "../components/Modal";
import { notify, Type } from "../components/Notifier";
import TabBar from "../components/TabBar";
import NewSessionTool from "../tools/NewSessionTool";

export default function DataInputModal({ showModal, closeModal }) {
    const [activeTab, setActiveTab] = useState('New Data');
    const [modalData, setModalData] = useState({});

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const tools = {
        'New Data': <div />,
        'New Session': <NewSessionTool setData={setModalData} />,
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
                setShowConfirmationModal(true);
                notify(Type.success, 'Session data saved.')
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
            className='z-50'
                showModal={showConfirmationModal}
                title='Is this data correct?'
                text='Please check the data before submitting.'
                onCancel={() => setShowConfirmationModal(false)}
                onOkay={() => {() => closeModal(), setShowConfirmationModal(false)}}
            >
                <div className="p-4">
                    {modalData && Object.keys(modalData).map((key, index) => {
                    return (
                        <div key={index}>
                            <span className='font-bold'>{key}:</span>
                            <span className='ml-2'>{modalData[key]}</span>
                        </div>
                    );
                }
                )}
                </div>
                
            </Modal>
            <Modal
                showModal={showModal}
                title='Data Input Tool'
                text='Select a tab to create a new data entry or session.'
                onCancel={() => closeModal()}
                onOkay={() => onOkay()}
            >
                <div className='flex-col'>
                    <div className='bg-neutral-100 flex-shrink-0'>
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
                    <div className='flex-grow h-data-input overflow-auto'>
                        {tools[activeTab]}
                    </div>
                </div>
            </Modal>
        </div>

    );
}