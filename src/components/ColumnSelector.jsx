import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import InputField from './InputField';

const ColumnSelector = ({ show, labels, columns, setShow, toggleColumn }) => {
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (show && !ref.current.contains(event.target)) {
                setShow(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, toggleColumn]);

    const getShownColumnCount = () => {
        return Object.values(columns).reduce((count, column) => count + (column.show ? 1 : 0), 0);
    };

    return (
        <AnimatePresence>
            {show &&
                <motion.div
                    key='column-selector'
                    className='flex items-center space-x-5 absolute z-50 bg-white rounded-md shadow-md p-6 overflow-auto'
                    initial={{ opacity: 0, y: '-100%', x: '-100%' }}
                    animate={{ opacity: 1, y: '0%', x: '-100%' }}
                    exit={{ opacity: 0, y: '-100%', x: '-100%' }}
                    ref={ref}
                >
                    <div className='flex-col space-y-3 whitespace-nowrap max-h-full-column-selector-height'>
                        <h1 className='text-xl'>Column Selector</h1>
                        {labels && labels.map((label) =>
                            <InputField
                                key={label}
                                label={label}
                                type='checkbox'
                                checked={columns[label]?.show}
                                disabled={getShownColumnCount() === 1 && columns[label].show}
                                onChange={() => {
                                    toggleColumn(label);
                                }}
                            />
                        )}
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    );
};

export default ColumnSelector;