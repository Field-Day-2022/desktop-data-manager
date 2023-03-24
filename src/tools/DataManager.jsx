import React from 'react';
import { ExportIcon, SearchIcon } from '../assets/icons';
import { motion } from 'framer-motion';
import ColumnSelectorButton from '../components/ColumnSelectorButton';
import { Table } from '../components/Table';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { getValue } from '../components/TableEntry';
import Dropdown from '../components/Dropdown';

function SearchBar({ onChange }) {

    return (
        <div className='flex items-center space-x-2'>
            <div className='text-2xl'><SearchIcon /></div>
            <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 w-full appearance-none leading-normal" type="text" placeholder="Search" onChange={onChange} />
        </div>
    )
}

const MemoizedSearchBar = React.memo(SearchBar);

export default function DataManager({ name, labels, entries, setEntries }) {
    const [columns, setColumns] = useState({});
    const [search, setSearch] = useState('');

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

    const handleSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    const filteredEntries = useCallback((entries, search) => {

        if (search === '') {
            return entries;
        }

        return entries.filter((entry) => {
            return labels.some((label) => {
                const entryValue = getValue(entry, label);
                return entryValue.toString().toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [labels]);

    return (
        <motion.div className="bg-white">
            <div className="flex justify-between px-5 items-center">
                <h1 className="heading pt-4">{name} - Entries</h1>
                <div className="flex px-5 items-center">
                    <MemoizedSearchBar onChange={handleSearchChange} />
                    <div className='flex justify-center text-2xl'>
                        <ColumnSelectorButton
                            labels={labels}
                            columns={columns}
                            toggleColumn={toggleColumn} />
                        <ExportIcon />
                    </div>

                </div>
            </div>

            <Table
                labels={labels}
                columns={columns}
                entries={filteredEntries(entries, search)}
                name={name}
                setEntries={setEntries}
            />
        </motion.div>
    );
}