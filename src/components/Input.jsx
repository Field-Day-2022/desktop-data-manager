import { SearchIcon } from "../assets/icons";
import classNames from "classnames";

export default function Input({
    value,
    onChange,
    placeholder,
    maxLength,
    type = "text",
}) {

    const inputClass = classNames(
        "bg-white focus:outline-none focus:shadow-outline border border-neutral-300 rounded-lg py-2",
        {
            "pl-10": type === "search",
            "pl-4": type !== "search",
        },
        "pr-4 w-full appearance-none leading-normal accent-asu-maroon"
    );
    
    return (
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className={inputClass}
            />
            {type === "search" && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xl">
                    <SearchIcon className="text-neutral-400" />
                </div>
            )}
        </div>
    );
}
