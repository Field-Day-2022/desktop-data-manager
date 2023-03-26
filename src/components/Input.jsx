import { SearchIcon } from "../assets/icons";

export default function Input({
    value,
    onChange,
    placeholder,
    maxLength,
    type = "text",
}) {
    const searchIconWidth = type === "search" ? 6 : 0; // Adjust the value based on the width of your icon
    const pl = `pl-${searchIconWidth + 4}`;
    return (
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className={`bg-white focus:outline-none focus:shadow-outline border border-neutral-300 rounded-lg py-2 ${pl} pr-4 w-full appearance-none leading-normal`}
            />
            {type === "search" && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xl">
                    <SearchIcon className="text-neutral-400" />
                </div>
            )}
        </div>
    );
}