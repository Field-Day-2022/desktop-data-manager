export default function Button({ className, text, onClick, enabled, icon }) {
    return (
        (enabled ?
            <div className={className + " flex rounded-md p-2 bg-asu-maroon text-white cursor-pointer border-transparent border-2 active:border-asu-gold"}
                onClick={onClick}>
                <div className="flex-none">{icon ? <div className='text-2xl m-auto px-1'>{icon}</div> : null}</div>
                <div className="flex-grow">{text}</div>
            </div>
            :
            <div className={"flex rounded-md p-2 bg-neutral-800 text-white"}>
                <div className="flex-none">{icon ? <div className='text-2xl m-auto'>{icon}</div> : null}</div>
                <div className="flex-grow">{text}</div>
            </div>
        )
    )
}