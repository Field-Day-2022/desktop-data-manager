import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, ExportIcon } from '../assets/icons';
import { Table } from '../components/Table';
import ColumnSelectorButton from '../components/ColumnSelectorButton';
import { useColumns } from '../utils/useColumns';
import { useTable } from '../utils/useTable';
import { useEffect } from 'react';

function SearchBar({ onChange }) {

    return (
        <div className='flex items-center space-x-2'>
            <div className='text-2xl'><SearchIcon /></div>
            <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 w-full appearance-none leading-normal" type="text" placeholder="Search" onChange={onChange} />
        </div>
    )
}

const MemoizedSearchBar = React.memo(SearchBar);

export default function DataManager({ name, labels = [], entries = [], setEntries }) {
    const { columns, getShownColumns, toggleColumnVisibility, sortDirection, sortByColumn, getSortedColumn, sortedEntries } = useColumns(labels);
    const [entryFilter, setEntryFilter] = useState('');

    const { getEntryValue } = useTable();

    useEffect(() => {
        console.log('Filtering entries by: ', entryFilter);
    }, [entryFilter]);

    const handleFilterChange = useCallback((e) => {
        setEntryFilter(e.target.value);
    }, []);

    const filteredEntries = useCallback(
        (entries, filter) => {
            if (filter === '') {
                return entries;
            }

            return entries.filter((entry) => {
                return labels.some((label) => {
                    const entryValue = getEntryValue(entry, label);
                    return entryValue?.toString().toLowerCase().includes(filter.toLowerCase());
                });
            });
        },
        [labels]
    );

    const filteredAndSortedEntries = useCallback(
        (entries, column, direction, search) => {
            const filtered = filteredEntries(entries, search);
            const sorted = sortedEntries(filtered, column, direction);
            return sorted;
        },
        [filteredEntries, sortedEntries]
    );

    const removeEntry = useCallback(
        (entry) => {
            setEntries((prevEntries) => prevEntries.filter((e) => e.id !== entry.id));
        },
        [setEntries]
    );

    return (
        <motion.div className="bg-white">
            <div className="flex justify-between px-5 items-center">
                <h1 className="heading pt-4">{name} - Entries</h1>
                <div className="flex px-5 items-center">
                    <MemoizedSearchBar onChange={handleFilterChange} />
                    <div className='flex justify-center text-2xl'>
                        <ColumnSelectorButton
                            labels={labels}
                            columns={columns}
                            toggleColumn={toggleColumnVisibility}
                        />
                        <ExportIcon />
                    </div>

                </div>
            </div>
            <div className="overflow-auto w-full h-full-table">
                <Table
                    name={name}
                    labels={labels}
                    columns={getShownColumns(columns)}
                    entries={filteredAndSortedEntries(entries, getSortedColumn(), sortDirection, entryFilter)}
                    removeEntry={removeEntry}
                    sortDirection={sortDirection}
                    sortByColumn={sortByColumn}
                />
            </div>
        </motion.div>
    );
}