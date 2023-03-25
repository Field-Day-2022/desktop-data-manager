import { useState } from "react";
import { NewDataIcon, NewSessionIcon } from "../assets/icons";
import Modal from "../components/Modal";
import TabBar from "../components/TabBar";
import NewDataTool from "../tools/NewDataTool";
import NewSessionTool from "../tools/NewSessionTool";

export default function DataInputModal({ showModal, onCancel }) {
    const [activeTab, setActiveTab] = useState('New Data');

    const tools = {
        'New Data': <NewDataTool />,
        'New Session': <NewSessionTool />,
    };


    return (
        <Modal
            showModal={showModal}
            title='Data Input Tool'
            text='Select a tab to create a new data entry or session.'
            onCancel={() => onCancel()}
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

                {tools[activeTab]}
            </div>
        </Modal>
    );
}