export default function TextInput({ value, onChange, placeholder, maxLength }) {
    return (
        <input
            type='text'
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            className="bg-white focus:outline-none focus:shadow-outline border border-neutral-300 rounded-lg py-2 px-4 w-full appearance-none leading-normal"
        />
    );
}