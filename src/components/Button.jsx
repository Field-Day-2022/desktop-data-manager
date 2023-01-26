export default function Button({ text, onClick, enabled }) {
    return (
        (enabled ?
            <div
                className={"rounded-md py-3 bg-asu-maroon text-white cursor-pointer"}
                onClick={onClick}>
                {text}
            </div> 
            :
            <div
                className={"rounded-md py-3 bg-asu-maroon text-white"}
                onClick={null}>
                {text}
            </div> 
        )
    )
}