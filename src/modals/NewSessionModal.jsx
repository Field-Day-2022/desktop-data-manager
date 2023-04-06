import Modal from "../components/Modal";

export default function NewSessionModal({ showModal, onCancel }) {
    return (
        <Modal
            showModal={showModal}
            title='New Session'
            text='Create a new session entry.'
            onCancel={() => onCancel()}
        >
            {/** Content */}
        </Modal>
    );
}