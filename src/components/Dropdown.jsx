export default function Dropdown({ options }) {

    function Options() {
        let o = []
        for (let i = 0; i < options.length; i++) {
            o.push(<option key={i}>{options[i]}</option>)
        }
        return o;
    }

    return (
        <div className="relative text-neutral-800">
            <select className="w-full p-1.5 bg-neutral-200 rounded-md border-solid border-2 border- focus:border-asu-gold">
                <Options />
            </select>
        </div>
    )
}