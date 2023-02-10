export default function Dropdown({ options, onClickHandler }) {
    return (
        <div className="relative text-neutral-800">
            <select 
                className="w-full p-1.5 bg-neutral-200 rounded-md border-solid border-2 border- focus:border-asu-gold"
                onChange={(e) => onClickHandler(e.target.value)}
            >
                {options.map((option, index) => <option key={index}>{option}</option>)}
            </select>
        </div>
    )
}