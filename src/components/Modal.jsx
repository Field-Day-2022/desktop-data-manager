import Button from '../components/Button'
export default function Modal({ title, text, onOkay, onCancel, children }) {
    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">

            <div className="fixed inset-0 bg-neutral-300 bg-opacity-75 transition-opacity" />

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full justify-center text-center items-center">

                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all my-8 w-full max-w-lg">
                        <div className="bg-white px-6 pt-5 pb-4">
                            <h1 className='subtitle'>{title}</h1>
                            <p>{text}</p>
                            {children}
                        </div>
                        <div className="bg-neutral-100 px-4 py-3 flex justify-end space-x-5">
                            <Button onClick={() => onCancel()} text='Cancel' enabled={true} />
                            <Button onClick={() => onOkay()} text='Okay' enabled={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}