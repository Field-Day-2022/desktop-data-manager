import { SearchIcon } from "../assets/icons";
import classNames from "classnames";

export default function InputField({
    type = "text",
    value,
    onChange,
    checked,
    disabled,
    readonly,
    size,
    maxLength,
    placeholder,
    label,
    layout = "horizontal",
    className,
}) {
    const containerClass = classNames("relative", {
        "flex flex-col": layout === "vertical",
        "flex justify-center": layout === "horizontal",
    });

    const inputClass = classNames(className, {
        "pl-10": type === "search",
        "pl-4": type !== "search",
    });

    const labelClass = classNames("text-sm w-full text-left p-2");

    const searchIconContainerClass = classNames(
        "absolute inset-y-0 left-0 pl-3 flex items-center",
        "pointer-events-none",
        "text-neutral-400 text-xl",
        {
            "pt-9": label,
            "pt-0": !label,
        }
    );

    return (
        <div className={containerClass}>
            {label && <div className={labelClass}>{`${label}:`}</div>}
            <input
                key={label}
                className={inputClass}
                type={type}
                value={value}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
                readOnly={readonly}
                size={size}
                maxLength={maxLength}
                placeholder={placeholder}
            />
            {type === "search" && (
                <div className={searchIconContainerClass}>
                    <SearchIcon />
                </div>
            )}
        </div>
    );
}