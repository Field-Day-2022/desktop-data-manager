export default function Button({ text, onClick, enabled, icon }) {
    return (
        (enabled ?
            <div className={"flex rounded-md p-2 bg-asu-maroon text-white cursor-pointer border-transparent border-2 active:border-asu-gold"}
                onClick={onClick}>
                <div className="flex-none">{icon ? icon : null}</div>
                <div className="flex-grow">{text}</div>
            </div>
            :
            <div className={"flex rounded-md p-2 bg-neutral-800 text-white"}>
                <div className="flex-none">{icon ? icon : null}</div>
                <div className="flex-grow">{text}</div>
            </div>
        )
    )
}