import { useState } from "react";
import { NewDataIcon, NewSessionIcon } from "../assets/icons";
import Modal from "../components/Modal";
import TabBar from "../components/TabBar";
import NewDataTool from "../components/tools/NewDataTool";
import NewSessionTool from "../components/tools/NewSessionTool";
import { useFirestore } from "../utils/firestore";

export default function DataInputModal({ showModal, closeModal }) {
    const [activeTab, setActiveTab] = useState('New Data');
    const [modalData, setModalData] = useState({});

    const { createSession } = useFirestore();

    const tools = {
        'New Data': <NewDataTool />,
        'New Session': <NewSessionTool setData={setModalData} />,
    };

    const processModalData = (data) => {
        if (activeTab === 'New Data') {
            console.log(data);
            return;
        } else if (activeTab === 'New Session') {
            createSession(data);
        }
    };

    return (
        <Modal
            showModal={showModal}
            title='Data Input Tool'
            text='Select a tab to create a new data entry or session.'
            onCancel={() => closeModal()}
            onOkay={() => {
                processModalData(modalData)
                closeModal();
            }}
        >
            <div className='flex-col'>
                <div className='bg-neutral-100'>
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
                <div className='min-w-data-input min-h-data-input overflow-auto'>
                    {tools[activeTab]}
                </div>

            </div>
        </Modal>
    );
}