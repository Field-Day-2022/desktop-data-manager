export default function InnerModalWrapper({children}) {
    return (
        <div className='flex-col max-w-full-modal-width max-h-full-modal-content-height'>
            {children}
        </div>
    )
}