export default function Dropdown({ options, onClickHandler, value }) {
    return (
        <div className="relative text-neutral-800 min-w-max">
            <select 
                className="cursor-pointer w-full p-1.5 bg-neutral-200 rounded-md border-solid border-2 focus:border-asu-gold"
                onChange={(e) => onClickHandler(e.target.value)}
                value={value}
            >
                {options.map((option, index) => <option key={index}>{option}</option>)}
            </select>
        </div>
    )
}