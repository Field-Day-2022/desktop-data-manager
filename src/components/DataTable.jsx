import { ColumnToggleIcon, ExportIcon } from '../assets/icons';
import { TableEntry } from '../components/TableEntry';
import { motion } from 'framer-motion';
import { tableBody } from '../utils/variants';
import { useEffect, useState } from 'react';

export default function DataTable({ name, labels, entries, setEntries }) {
    const [showColumnToggle, setShowColumnToggle] = useState(false);
    const [columns, setColumns] = useState();

    useEffect(() => {
        let initialColumns = {};
        labels && labels.forEach((label) => {
            initialColumns[label] = { show: true };
        });
        setColumns(initialColumns);
        console.log(columns);
    }, [labels]);

    useEffect(() => {
        console.log(columns);
    }, [columns]);

    const ColumnSelectorButton = () => {
        return (
            <div className="flex px-5 space-x-5 items-center">
                <div onClick={() => setShowColumnToggle(!showColumnToggle)}>
                    <ColumnToggleIcon className="text-2xl" />
                </div>
            </div>
        );
    };

    const ColumnCheckbox = ({ label }) => {

        const onClickHandler = () => {
            let newColumns = columns;
            newColumns[label].show = !newColumns[label].show;
            setColumns(newColumns);
            console.log(columns)
        };

        return (
            <input
                className="accent-asu-maroon w-4"
                type="checkbox"
                defaultChecked={columns[label] && columns[label].show}
                onChange={() => {
                    onClickHandler();
                }}
            />
        );
    };

    const ColumnSelector = () => {
        return (
            (showColumnToggle) && (
                <div className='flex items-center space-x-5 absolute z-50 bg-white rounded-sm shadow-md p-2 max-h-full-table overflow-auto'>
                    <div className='flex-col items-center space-x-5'>
                        {labels && labels.map((label) =>
                            <div key={label} className='flex p-2 space-x-5'>
                                <ColumnCheckbox label={label} />
                                <div>{label}</div>
                            </div>)}
                    </div>
                </div>
            )
        );
    };

    return (
        <motion.div className="bg-white">

            <ColumnSelector />

            <div className="flex justify-between px-5 space-x-5 items-center">
                <h1 className="heading pt-4">{name} - Entries</h1>
                <div className="flex px-5 space-x-5 items-center">
                    <input className="border-b border-neutral-800 p-2" type="text" name="search" />
                    <div className="text-2xl flex">
                        <ColumnSelectorButton />
                        <ExportIcon />
                    </div>
                </div>
            </div>

            <div className="overflow-auto w-full h-full-table">
                <table className="w-full table-auto border-separate border-spacing-0">
                    <thead>
                        <tr>
                            <TableHeading label="Actions" />
                            {labels &&
                                labels.map((label) => (columns[label] && columns[label].show) && <TableHeading key={label} label={label} />)}
                        </tr>
                    </thead>
                    <motion.tbody
                        initial='hidden'
                        animate='visible'
                        variants={tableBody}
                    >
                        {/* <AnimatePresence> */}
                        {entries.map((entry, index) => (
                            <TableEntry
                                index={index}
                                key={entry.id}
                                entrySnapshot={entry}
                                shownColumns={[...labels].filter(label => columns[label] && columns[label].show)}
                                tableName={name}
                                removeEntry={() => {
                                    setEntries(entries.filter(e => e !== entry));
                                }}
                            />
                        ))}
                        {/* </AnimatePresence> */}
                    </motion.tbody>

                </table>
            </div>
        </motion.div>
    );
}

const TableHeading = ({ label }) => {
    return (
        <th className="sticky top-0 bg-white z-10 border-b border-neutral-800 p-2 text-sm text-gray-600 font-semibold">
            {label}
        </th>
    );
};
