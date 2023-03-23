import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getValue, TableEntry } from './TableEntry';
import { TableHeading } from './TableHeading';
import { tableBody } from '../utils/variants';

export const Table = ({ labels, columns, entries, name, setEntries }) => {

    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortState, setSortState] = useState(null);

    useEffect(() => {
        if (sortState !== null) {
            setEntries(sortEntries(entries, sortState.column, sortState.direction));
        } else {
            setEntries(entries);
        }
    }, [sortState]);

    const sortEntries = (entries, column, direction) => {
        const sortedEntries = [...entries];
        sortedEntries.sort((a, b) => {
            if (getValue(a, column) < getValue(b, column)) {
                return (direction === 'asc') ? 1 : -1;
            }
            if (getValue(a, column) > getValue(b, column)) {
                return (direction === 'asc') ? -1 : 1;
            }
            return 0;
        });
        return sortedEntries;
    };

    const sortByColumn = (column) => {
        if (sortedColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortedColumn(column);
            setSortDirection('asc');
        }
        setSortState({ column: column, direction: sortDirection });
    };

    return (
        <div className="overflow-auto w-full h-full-table">
            <table className="w-full table-auto border-separate border-spacing-0">
                <thead>
                    <tr>
                        <TableHeading label="Actions" />
                        {labels &&
                            labels.map((label) => (columns[label]?.show) && <TableHeading key={label} label={label} active={sortedColumn === label} sortDirection={sortDirection} onClick={() => {
                                sortByColumn(label)
                            }} />)}
                    </tr>
                </thead>
                <motion.tbody
                    initial='hidden'
                    animate='visible'
                    variants={tableBody}
                >
                    {entries.map((entry, index) => (
                        <TableEntry
                            index={index}
                            key={entry.id}
                            entrySnapshot={entry}
                            shownColumns={[...labels].filter(label => columns[label]?.show)}
                            tableName={name}
                            removeEntry={() => {
                                setEntries(entries.filter(e => e !== entry));
                            }}
                        />
                    ))}
                </motion.tbody>
            </table>
        </div>
    );
};