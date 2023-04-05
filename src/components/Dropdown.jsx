import classNames from "classnames";

export default function Dropdown({
    label,
    layout,
    options,
    onClickHandler,
    value,
    className
}) {

    const containerClass = classNames(
        className,
        "relative min-w-max",
        {
            "flex flex-col": layout === "vertical",
            "flex": layout === "horizontal",
        }
    )

    const labelClass = classNames(
        "text-sm w-full text-left p-2",
    );

    return (
        <div className={containerClass}> 
                {label && (<label className={labelClass}>{`${label}:`}</label>)}
                <select
                    onChange={(e) => onClickHandler(e.target.value)}
                    value={value}
                >
                    {options.map((option, index) => <option key={index}>{option}</option>)}
                </select>
        </div>
    )
}