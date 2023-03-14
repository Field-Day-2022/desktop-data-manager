import { useState } from 'react';

const ColumnCheckbox = ({ label, defaultChecked, disabled, onChange, onClick }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    const handleOnChange = () => {
        if (!disabled) {
            setIsChecked(!isChecked);
            onChange(!isChecked);
        }
    };

    return (
        <div key={label} className='flex p-2 space-x-5 hover:bg-neutral-100 text-base' onClick={onClick}>
            <input
                className="accent-asu-maroon w-4 cursor-pointer"
                type="checkbox"
                checked={isChecked}
                disabled={disabled}
                onChange={handleOnChange}
            />
            <div>{label}</div>
        </div>

    );
};

export default ColumnCheckbox;