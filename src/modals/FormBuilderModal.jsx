import Modal from '../components/Modal';
import { FormBuilder } from '../pages';
import React, { useState } from 'react';

export default function FormBuilderModal({ showModal, onCancel, onOkay, triggerRerender }) {
    const [modalStep, setModalStep] = useState(1);

    const handleBack = () => {
        if (modalStep > 1) {
            setModalStep(modalStep - 1);
        }
    };

    // Non-functional testing purposes only
    // console.log('Rendering FormBuilderModal - Current modalStep:', modalStep);

    return (
        <Modal
            showModal={showModal}
            onCancel={onCancel}
            onOkay={onOkay}
            onBack={modalStep > 1 ? handleBack : null}
            title="Form Builder"
            text="Create custom forms in a few easy steps with Field Day!"
            buttonOptions={{
                back: modalStep > 1 ? 'Back' : '',
                cancel: 'Close',
                okay: '',
            }}
        >
            <div className="w-[600px] h-[400px] p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-lg flex items-center justify-center">
                {/* Ensure inner FormBuilder also respects square shape */}
                <FormBuilder
                    triggerRerender={triggerRerender}
                    modalStep={modalStep}
                    setModalStep={setModalStep}
                />
            </div>
        </Modal>
    );
}
