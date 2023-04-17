import Modal from "../components/Modal";
import { FormBuilder } from "../pages";

export default function FormBuilderModal({ showModal, onCancel, onOkay, triggerRerender }) {
    return (
        <Modal
            showModal={showModal}
            onCancel={onCancel}
            onOkay={onOkay}
            title='Form Builder'
            text='Build custom forms with Field Day!'
            buttonOptions={{
                cancel: 'Close',
                okay: '',
            }}
        >
            <div className="w-full-modal-width">
                <FormBuilder triggerRerender={triggerRerender} />
            </div>
            
        </Modal>
    );
}