import { ExportIcon } from '../assets/icons';
import { motion } from 'framer-motion';
import ColumnSelectorButton from '../components/ColumnSelectorButton';
import { SpreadSheet } from '../components/SpreadSheet';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

export default function DataManager({ name, labels, entries, setEntries }) {
    const [columns, setColumns] = useState({});

    useEffect(() => {
        let initialColumns = {};
        labels && labels.forEach((label) => {
            initialColumns[label] = { show: true };
        });
        setColumns(initialColumns);
    }, [labels]);

    const toggleColumn = useCallback((label) => {
        setColumns(prevColumns => ({
            ...prevColumns,
            [label]: {
                ...prevColumns[label],
                show: !prevColumns[label].show
            }
        }));
    }, []);

    return (
        <motion.div className="bg-white">
            <div className="flex justify-between px-5 space-x-5 items-center">
                <h1 className="heading pt-4">{name} - Entries</h1>
                <div className="flex px-5 space-x-5 items-center">
                    <input className="border-b border-neutral-800 p-2" type="text" name="search" />
                    <div className="text-2xl flex">
                        <ColumnSelectorButton
                            labels={labels}
                            columns={columns}
                            toggleColumn={toggleColumn} />
                        <ExportIcon />
                    </div>
                </div>
            </div>

            <SpreadSheet
                labels={labels}
                columns={columns}
                entries={entries}
                name={name}
                setEntries={setEntries}
            />
        </motion.div>
    );
}