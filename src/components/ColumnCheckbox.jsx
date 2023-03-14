import { useState } from 'react';

const ColumnCheckbox = ({ label, defaultChecked, disabled, onChange }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    const handleOnChange = () => {
        if (!disabled) {
            setIsChecked(!isChecked);
            onChange(!isChecked);
        }
    };

    return (
        <div key={label} className='flex p-2 space-x-5 hover:bg-neutral-100 text-base'>
            <input
                className="accent-asu-maroon w-4"
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