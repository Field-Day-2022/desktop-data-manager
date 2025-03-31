import { ColumnToggleIcon } from '../assets/icons';
import { useState } from 'react';
import ColumnSelector from './ColumnSelector';
import React from 'react';

const ColumnSelectorButton = ({ labels, columns, toggleColumn }) => {
    const [showColumnSelector, setShowColumnSelector] = useState(false);

    return (
        <div className="flex-col px-5 space-x-5 items-center">
            <div
                className="hover:scale-125 transition h-8 cursor-pointer"
                onClick={() => !showColumnSelector && setShowColumnSelector(true)}
            >
                <ColumnToggleIcon className="text-2xl" />
            </div>
            <ColumnSelector
                show={showColumnSelector}
                labels={labels}
                columns={columns}
                setShow={setShowColumnSelector}
                toggleColumn={toggleColumn}
            />
        </div>
    );
};

export default ColumnSelectorButton;
