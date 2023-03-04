import { BiExport } from 'react-icons/bi';
import { MdViewColumn } from 'react-icons/md';
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

    const ColumnSelectorButton = () => {
        return (
            <div className="flex px-5 space-x-5 items-center">
                <div onClick={() => setShowColumnToggle(!showColumnToggle)}>
                    <MdViewColumn className="text-2xl" />
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
                <div className='flex items-center space-x-5 absolute z-50 bg-white rounded-sm shadow-md p-2'>
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
                    <ColumnSelectorButton />
                    <BiExport className="text-2xl" />
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
                            console.log(entry),
                            (columns[entry.label] && columns[entry.label].show &&

                                <TableEntry
                                    index={index}
                                    key={entry.id}
                                    entrySnapshot={entry}
                                    tableName={name}
                                    removeEntry={() => {
                                        setEntries(entries.filter(e => e !== entry));
                                    }}
                                />
                            )

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
