export default function Button({ text, onClick, enabled }) {
    const CURSOR = (enabled ? ' cursor pointer' : '')
    return (
        <div 
        className={"rounded-md py-3 bg-asu-maroon text-white" + CURSOR}
        onClick={(enabled ? onClick : null)}>
            {text}
        </div>)
}