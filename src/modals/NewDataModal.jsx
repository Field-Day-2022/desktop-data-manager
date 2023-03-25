import Modal from "../components/Modal";
import NewDataTool from "../tools/NewDataTool";

export default function NewDataModal({ showModal, onCancel }) {
    return (
        <Modal
            showModal={showModal}
            title='New Data Entry'
            text='Create a new data entry.'
            onCancel={() => onCancel()}
        >
            <NewDataTool />
        </Modal>
    );
}