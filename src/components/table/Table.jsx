import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TableEntry } from './TableEntry';
import { TableHeading } from './TableHeading';
import { tableBody } from '../../const/animationVariants';
import { usePagination } from '../../utils/firestore';

export const Table = ({ labels, columns, entries, name }) => {

    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const { getEntryValue, getKey } = usePagination();

    const sortedEntries = (entries , column, direction) => {
        const sortedEntries = [...entries];
        const key = getKey(column);
        sortedEntries.sort((a, b) => {
            if (getEntryValue(a, key) > getEntryValue(b, key)) {
                return (direction === 'asc') ? 1 : -1;
            }
            if (getEntryValue(a, key) < getEntryValue(b, key)) {
                return (direction === 'asc') ? -1 : 1;
            }
            return 0;
        });
        return sortedEntries;
    };

    const sortByColumn = (column) => {
        const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc'
        setSortedColumn(column)
        setSortDirection(newSortDirection);
    };

    return (
        <table className="w-full table-auto border-separate border-spacing-0">
            <thead>
                <tr>
                    <TableHeading label="Actions" />
                    {labels &&
                        labels.map((label) => (columns[label]?.show) &&
                            <TableHeading
                                key={label}
                                label={label}
                                active={sortedColumn === label}
                                sortDirection={sortDirection}
                                onClick={() => {
                                    sortByColumn(label)
                                }}
                            />)}
                </tr>
            </thead>
            <motion.tbody
                initial='hidden'
                animate='visible'
                variants={tableBody}
            >
                {sortedEntries(entries, sortedColumn, sortDirection).map((entry, index) => (
                    <TableEntry
                        index={index}
                        key={entry.id}
                        entrySnapshot={entry}
                        shownColumns={[...labels].filter(label => columns[label]?.show)}
                        tableName={name}
                    />
                ))}
            </motion.tbody>
        </table>
    );
};