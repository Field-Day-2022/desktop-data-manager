import Modal from "../components/Modal";
import { FormBuilder } from "../pages";

export default function FormBuilderModal({ showModal, onCancel, onOkay }) {
    return (
        <Modal
            showModal={showModal}
            onCancel={onCancel}
            onOkay={onOkay}
            displayOptions={['noHeader', 'fullScreen']}
        >
            <FormBuilder />
        </Modal>
    );
}