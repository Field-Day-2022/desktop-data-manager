import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ColumnCheckbox from './ColumnCheckbox';

const ColumnSelector = ({ show, labels, columns, setShow, toggleColumn }) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (show && !event.target.closest('.absolute')) {
                setShow(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, toggleColumn]);

    const getShownColumnCount = () => {
        let count = 0;
        for (let key in columns) {
            if (columns[key].show) {
                count++;
            }
        }
        return count;
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
                >
                    <div className='flex-col space-y-3 whitespace-nowrap max-h-full-column-selector-height'>
                        <h1 className='text-xl'>Column Selector</h1>
                        {labels && labels.map((label) =>
                            <ColumnCheckbox
                                key={label}
                                label={label}
                                defaultChecked={columns[label] && columns[label].show}
                                disabled={getShownColumnCount() === 1 && columns[label].show}
                                onChange={() => {
                                    toggleColumn(label);
                                }} />)}
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    );
};

export default ColumnSelector;