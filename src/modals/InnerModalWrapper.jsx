export default function InnerModalWrapper({children}) {
    return (
        <div className='flex-col w-full-modal-width h-full-modal-content-height max-w-5xl'>
            {children}
        </div>
    )
}