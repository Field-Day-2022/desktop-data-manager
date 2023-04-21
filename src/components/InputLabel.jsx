import classNames from "classnames";

export default function InputLabel({
    label,
    layout = "horizontal",
    input,
}) {
    const containerClass = classNames("relative", {
        "flex flex-col": layout === "vertical",
        "flex justify-center": layout === "horizontal",
    });

    const labelClass = classNames("text-sm w-full text-left p-2");

    return (
        <div className={containerClass}>
            {label && <label className={labelClass}>{`${label}:`}</label>}
            {input}
        </div>
    );
}