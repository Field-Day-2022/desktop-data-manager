import Button from '../components/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { modalVariant } from '../utils/variants';

export default function Modal({
    title,
    text,
    onOkay,
    onCancel,
    children,
    showModal,
    displayOptions,
}) {

    return (
        <motion.div
            className="relative z-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <AnimatePresence>
                {showModal && (
                    <>
                        <ModalOverlay />
                        <motion.div
                            className="fixed inset-0 backdrop-blur-sm"
                            key="modal"
                            variants={modalVariant}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <ModalBuffer>
                                <ModalWrapper displayOptions={displayOptions}>
                                    {((displayOptions && !displayOptions.includes('noHeader')) ||
                                        !displayOptions) && (
                                        <ModalHeader title={title} text={text} />
                                    )}
                                    <ModalContent>{children}</ModalContent>
                                    <ModalFooter>
                                        <Button
                                            onClick={() => onCancel()}
                                            text="Cancel"
                                            enabled={true}
                                        />
                                        <Button
                                            onClick={() => onOkay()}
                                            text="Okay"
                                            enabled={true}
                                        />
                                    </ModalFooter>
                                </ModalWrapper>
                            </ModalBuffer>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function ModalOverlay() {
    return (
        <motion.div
            className="fixed inset-0 bg-neutral-300 opacity-0"
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
        />
    );
}

function ModalBuffer({ children }) {
    return <div className="flex h-full justify-center text-center items-center">{children}</div>;
}

function ModalWrapper({ children, displayOptions }) {
    return (
        <div
            className={
                !displayOptions
                    ? 'relative overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-full-modal-width'
                    : displayOptions.includes('fullScreen')
                    ? 'relative overflow-hidden rounded-lg bg-white text-left shadow-xl w-full-modal-width'
                    : 'relative overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-full-modal-width'
            }
        >
            {children}
        </div>
    );
}

function ModalHeader({ title, text }) {
    return (
        <div className="bg-neutral-100 p-3">
            <h1 className="text-2xl p-2">{title}</h1>
            <p className="p-2">{text}</p>
        </div>
    );
}

function ModalContent({ children }) {
    return <div className="bg-white p-4  overflow-auto">{children}</div>;
}

function ModalFooter({ children }) {
    return <div className="bg-neutral-100 p-4 flex justify-end space-x-5">{children}</div>;
}
