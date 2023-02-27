import { BiExport } from 'react-icons/bi';
import { MdViewColumn } from 'react-icons/md';
import { TableEntry } from '../components/TableEntry';
import { motion } from 'framer-motion';
import { tableBody } from '../utils/variants';
import Modal from './Modal';
import { useState } from 'react';

export default function DataTable({ name, labels, entries, setEntries }) {
    const [showColumnToggle, setShowColumnToggle] = useState(false);

    return (
        <div className="bg-white">
            {showColumnToggle &&
                <Modal
                    title='Toggle Columns'
                    text='Choose the columns to display.'
                    onCancel={() => setShowColumnToggle(false)}
                >
                    {labels && labels.map((label) => <div className='flex p-2 space-x-5'>
                        <input type='checkbox' />
                        <div>{label}</div>
                    </div>)}
                </Modal>
            }

            <div className="flex justify-between px-5 space-x-5 items-center">
                <h1 className="heading pt-4">{name} - Entries</h1>
                <div className="flex px-5 space-x-5 items-center">
                    <input className="border-b border-neutral-800 p-2" type="text" name="search" />
                    <div onClick={() => setShowColumnToggle(true)}>
                        <MdViewColumn className="text-2xl" />
                    </div>

                    <BiExport className="text-2xl" />
                </div>
            </div>

            <div className="overflow-auto w-full h-full-table">
                <table className="w-full table-auto border-separate border-spacing-0">
                    <thead>
                        <tr>
                            <TableHeading label="Actions" />
                            {labels &&
                                labels.map((label) => <TableHeading key={label} label={label} />)}
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
        </div>
    );
}

const TableHeading = ({ label }) => {
    return (
        <th className="sticky top-0 bg-white z-10 border-b border-neutral-800 p-2 text-sm text-gray-600 font-semibold">
            {label}
        </th>
    );
};
