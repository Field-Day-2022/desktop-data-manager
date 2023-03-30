import classNames from "classnames";

export default function Dropdown({
    label,
    layout,
    options,
    onClickHandler,
    value
}) {

    const containerClass = classNames(
        "relative min-w-max",
        {
            "flex-col": layout === "vertical",
            "flex": layout === "horizontal",
        }
    )

    const labelClass = classNames(
        "text-sm w-full text-left p-2",
    );

    const selectClass = classNames(
        "cursor-pointer w-auto",
        "p-1.5 bg-neutral-200 rounded-md",
        "border-solid border-2 focus:border-asu-gold"
    );


    return (

        <div className={containerClass}>
                {label && (<div className={labelClass}>{`${label}:`}</div>)}
                <select
                    className={selectClass}
                    onChange={(e) => onClickHandler(e.target.value)}
                    value={value}
                >
                    {options.map((option, index) => <option key={index}>{option}</option>)}
                </select>
        </div>
    )
}