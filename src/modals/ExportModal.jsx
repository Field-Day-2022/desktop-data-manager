import Modal from "../components/Modal";

export default function ExportModal({ showModal, onCancel }) {
    return (
        <Modal
            showModal={showModal}
            title='Export'
            text='Choose export options.'
            onCancel={() => onCancel()}
        >
            {/** Content */}
        </Modal>
    );
}