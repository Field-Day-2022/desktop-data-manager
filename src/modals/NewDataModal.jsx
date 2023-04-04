import { useState } from "react";
import { NewDataIcon, NewSessionIcon } from "../assets/icons";
import Modal from "../components/Modal";
import TabBar from "../components/TabBar";
import NewSessionTool from "../tools/NewSessionTool";

export default function DataInputModal({ showModal, closeModal }) {
    const [activeTab, setActiveTab] = useState('New Data');
    const [modalData, setModalData] = useState({});

    const tools = {
        'New Data': <div />,
        'New Session': <NewSessionTool setData={setModalData} />,
    };

    const processModalData = (data) => {
        if (activeTab === 'New Data') {
            console.log(data);
            return;
        } else if (activeTab === 'New Session') {
            console.log(data);
        }
    };

    const onOkay = () => {
        processModalData(modalData);
        closeModal();
    };

    return (
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
    );
}