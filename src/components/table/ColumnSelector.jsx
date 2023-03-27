import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ColumnCheckbox from './ColumnCheckbox';
import { notify, Type } from '../Notifier';
import { columnSelectorVariant } from '../../const/animationVariants';

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
                    variants={columnSelectorVariant}
                    className='flex items-center space-x-5 absolute z-50 bg-white rounded-md shadow-md p-6 overflow-auto'
                    initial={'hidden'}
                    animate={'visible'}
                    exit={'hidden'}
                    ref={ref}
                >
                    <div className='flex-col space-y-3 whitespace-nowrap max-h-column-selector'>
                        <h1 className='text-xl'>Column Selector</h1>
                        {labels && labels.map((label) =>
                            <ColumnCheckbox
                                key={label}
                                label={label}
                                defaultChecked={columns[label]?.show}
                                disabled={getShownColumnCount() === 1 && columns[label].show}
                                onChange={() => {
                                    toggleColumn(label);
                                }}
                                onClick={() => {
                                    if (getShownColumnCount() === 1 && columns[label].show) {
                                        notify(Type.error, 'You must have at least one column selected.');
                                    }
                                }} />
                        )}
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    );
};

export default ColumnSelector;