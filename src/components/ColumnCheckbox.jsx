import { useState } from 'react';

const ColumnCheckbox = ({ label, defaultChecked, disabled, onChange, onClick }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    const handleOnChange = () => {

        if (!disabled) {
            setIsChecked(!isChecked);
            onChange(!isChecked);
        }
    };

    let style = (!disabled) ? 'accent-asu-maroon cursor-pointer ' : 'accent-neutral-400 ';

    return (
        <div key={label} className='flex p-2 space-x-5 hover:bg-neutral-100 text-base'>
            
            <input
                className={style + "w-4"}
                type="checkbox"
                checked={isChecked}
                onChange={handleOnChange}
                onClick={onClick}
            />
            <div>{label}</div>
        </div>

    );
};

export default ColumnCheckbox;