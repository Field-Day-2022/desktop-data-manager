import Modal from "../components/Modal";
import FormBuilder from "../components/tools/FormBuilder";

export default function FormBuilderModal({ showModal, onCancel, onOkay }) {
    return (
        <Modal
            showModal={showModal}
            onCancel={onCancel}
            onOkay={onOkay}
            title='Form Builder'
            text='Build custom forms with Field Day!'
        >
            <div className="w-full-modal-width">
                <FormBuilder />
            </div>
            
        </Modal>
    );
}