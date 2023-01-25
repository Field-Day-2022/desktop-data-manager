export default function Button({ text, onClick }) {
    return (
        <div 
        className="rounded-md py-3 bg-asu-maroon text-white cursor-pointer"
        onClick={onClick}>
            {text}
        </div>)
}