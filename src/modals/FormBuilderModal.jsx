import Modal from "../components/Modal";
import { FormBuilder } from "../pages";

export default function FormBuilderModal({ showModal, onCancel, onOkay, setLabelsLoaded }) {
    return (
        <Modal
            showModal={showModal}
            onCancel={onCancel}
            onOkay={onOkay}
            title='Form Builder'
            text='Build custom forms with Field Day!'
        >
            <div className="w-full-modal-width">
                <FormBuilder setLabelsLoaded={setLabelsLoaded} />
            </div>
            
        </Modal>
    );
}