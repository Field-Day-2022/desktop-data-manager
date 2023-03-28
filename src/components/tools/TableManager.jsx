import React from 'react';
import { ExportIcon } from '../../assets/icons';
import { motion } from 'framer-motion';
import ColumnSelectorButton from '../table/ColumnSelectorButton';
import { Table } from '../table/Table';
import { useState, useEffect, useCallback } from 'react';
import { SearchField } from '../forms/Fields';
import { usePagination } from '../../utils/usePagination';

export default function TableManager({ name, labels = [], entries = [], setEntries }) {
    const [columns, setColumns] = useState({});
    const [search, setSearch] = useState('');

    const { getEntryValue } = usePagination();

    useEffect(() => {
        setColumns(labels.reduce((acc, label) => {
            acc[label] = { show: true };
            return acc;
        }, {}));
    }, [labels]);

    const toggleColumn = useCallback((label) => {
        setColumns(prevColumns => ({
            ...prevColumns,
            [label]: {
                ...prevColumns?.[label],
                show: !prevColumns?.[label]?.show
            }
        }));
    }, []);

    const filteredEntries = useCallback((entries, search) => {
        if (search === '') {
            return entries;
        }
        return entries.filter((entry) => {
            return labels.some((label) => {
                const entryValue = getEntryValue(entry, label);
                return entryValue?.toString().toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [labels]);

    return (
        <motion.div className="bg-white">
            <div className="flex justify-between px-5 items-center">
                <h1 className="heading pt-4">{name} - Entries</h1>
                <div className="flex px-5 items-center">
                    <SearchField setField={(e) => {
                        console.log(e);
                        setSearch(e)
                    }} />
                    <div className='flex justify-center text-2xl'>
                        <ColumnSelectorButton
                            labels={labels}
                            columns={columns}
                            toggleColumn={toggleColumn}
                        />
                        <ExportIcon />
                    </div>

                </div>
            </div>
            <div className="overflow-auto w-full h-table">
                <Table
                    labels={labels}
                    columns={columns}
                    entries={filteredEntries(entries, search)}
                    name={name}
                    setEntries={setEntries}
                />
            </div>
        </motion.div>
    );
}
