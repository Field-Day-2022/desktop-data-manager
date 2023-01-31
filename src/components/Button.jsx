export default function Button({ text, onClick, enabled, icon }) {
    return (
        (enabled ?
            <div
                className={"rounded-md p-3 bg-asu-maroon text-white cursor-pointer border-transparent border-2 active:border-asu-gold"}
                onClick={onClick}>
                <div className="absolute">
                    {icon ? icon : null}
                </div>
                <div className="select-none">{text}</div>
            </div>
            :
            <div
                className={"rounded-md p-3 bg-neutral-800 text-white"}>
                <div className="absolute">
                    {icon ? icon : null}
                </div>
                <div className="select-none">{text}</div>
            </div>
        )
    )
}