import Modal from "../components/Modal";

export default function FormBuilderModal({ showModal, onCancel }) {
    return (
        <Modal
            showModal={showModal}
            title='Form Builder'
            text='Create a custom form below.'
            onCancel={() => onCancel()}
        >
            {/** Content */}
        </Modal>
    );
}