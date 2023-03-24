import { ExportIcon } from '../assets/icons';
import { motion } from 'framer-motion';
import ColumnSelectorButton from '../components/ColumnSelectorButton';
import { Table } from '../components/Table';
import { useState } from 'react';

export default function DataManager({ name, labels = [], entries, setEntries }) {
    const [columns, setColumns] = useState(
        labels.reduce((obj, label) => {
            obj[label] = { show: true };
            return obj;
        }, {})
    );

    const toggleColumn = (label) => {
        setColumns((prevColumns) => ({
            ...prevColumns,
            [label]: {
                ...prevColumns[label],
                show: !prevColumns[label].show,
            },
        }));
    };

    return (
        <motion.div className="bg-white">
            <div className="flex justify-between px-5 space-x-5 items-center">
                <h1 className="heading pt-4">{name} - Entries</h1>
                <div className="flex px-5 space-x-5 items-center">
                    <input className="border-b border-neutral-800 p-2" type="text" name="search" />
                    <div className="text-2xl flex">
                        <ColumnSelectorButton labels={labels} columns={columns} toggleColumn={toggleColumn} />
                        <ExportIcon />
                    </div>
                </div>
            </div>
            <div className="overflow-auto w-full h-full-table">
                <Table labels={labels} columns={columns} entries={entries} name={name} setEntries={setEntries} />
            </div>
        </motion.div>
    );
}