import Modal from "../components/Modal";

export default function NewDataModal({ showModal, onCancel }) {
    return (
        <Modal
            showModal={showModal}
            title='New Data Entry'
            text='Create a new data entry.'
            onCancel={() => onCancel()}
        >
            {/** Content */}
        </Modal>
    );
}