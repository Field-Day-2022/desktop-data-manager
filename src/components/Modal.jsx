import Button from '../components/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { modalVariant } from '../utils/variants';
export default function Modal({ title, text, onOkay, onCancel, children, showModal }) {
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
                        <motion.div
                            className="fixed inset-0 bg-neutral-300 opacity-0"
                            key="bg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.75 }}
                            exit={{ opacity: 0 }}
                        />

                        <motion.div
                            className="fixed inset-0 backdrop-blur-sm"
                            key="modal"
                            variants={modalVariant}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <div className="flex min-h-full justify-center text-center items-center">
                                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all my-8 w-full max-w-lg">
                                    <div className="bg-white px-6 pt-5 pb-4">
                                        <h1 className="subtitle">{title}</h1>
                                        <p>{text}</p>
                                        {children}
                                    </div>
                                    <div className="bg-neutral-100 px-4 py-3 flex justify-end space-x-5">
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
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
