export default function Button({ text, onClick, enabled, icon }) {
    return (
        (enabled ?
            <div
                className={"rounded-md py-3 bg-asu-maroon text-white cursor-pointer"}
                onClick={onClick}>
                <div className="absolute px-3">
                    {icon ? icon : null}
                </div>
                <div className="select-none">{text}</div>

            </div>
            :
            <div
                className={"rounded-md py-3 bg-neutral-800 text-white"}>
                <div className="absolute px-3">
                    {icon ? icon : null}
                </div>
                <div className="select-none">{text}</div>
            </div>
        )
    )
}