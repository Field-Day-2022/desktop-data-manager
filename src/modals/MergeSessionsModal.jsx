import Modal from "../components/Modal"
import InnerModalWrapper from "./InnerModalWrapper"

export default function MergeSessionsModal({
    showModal,
    closeModal
}) {
    return (
        <div>
            <Modal
                showModal={showModal}
                title='Merge Session Tool'
                text='Select sessions to merge'
                onCancel={() => closeModal()}
                onOkay={() => closeModal()}
            >
                <InnerModalWrapper>
                    <h1>Merge</h1>
                </InnerModalWrapper>
            </Modal>
        </div>
    )
}