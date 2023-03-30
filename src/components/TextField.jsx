import { SearchIcon } from "../assets/icons";
import classNames from "classnames";

export default function TextField({
    className,
    label,
    value,
    disabled,
    onChange,
    placeholder,
    maxLength,
    size,
    type = "text",
}) {

    const containerClass = classNames(
        "relative min-w-max",
    );

    const iconClass = classNames(
        "absolute inset-y-0 left-0 pl-3 flex items-center",
        "pointer-events-none",
        "text-neutral-400 text-xl",
        {
            'pt-9': label,
            'pt-0': !label,
        }
    );

    const inputClass = classNames(
        className,
        {
            "pl-10": type === "search",
            "pl-4": type !== "search",
        },
    );

    const labelClass = classNames(
        "text-sm w-full text-left p-2",
    );

    return (
        <div className={containerClass}>
            {label && (<div className={labelClass}>{`${label}:`}</div>)}
            <input
                className={inputClass}
                disabled={disabled}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                size={size}
                maxLength={maxLength}

            />
            {type === "search" && (
                <div className={iconClass}>
                    <SearchIcon />
                </div>
            )}
        </div>
    );
}
