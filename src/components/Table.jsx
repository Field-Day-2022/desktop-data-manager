import React from 'react';
import { motion } from 'framer-motion';
import { TableEntry } from './TableEntry';
import { TableHeading } from './TableHeading';
import { tableBody } from '../utils/variants';

export const Table = ({ name, labels, columns, entries, removeEntry, sortDirection, sortByColumn }) => {

    return (
        <table className="w-full table-auto border-separate border-spacing-0">
            <thead>
                <tr>
                    <TableHeading label="Actions" />
                    {labels &&
                        labels.map((label) =>
                            columns[label]?.show &&
                            <TableHeading
                                key={label}
                                label={label}
                                active={columns[label]?.sorted}
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
                {entries.map((entry, index) => (
                    <TableEntry
                        index={index}
                        key={entry.id}
                        entrySnapshot={entry}
                        shownColumns={[...labels].filter(label => columns[label]?.show)}
                        tableName={name}
                        removeEntry={() => {
                            removeEntry(entry);
                        }}
                    />
                ))}
            </motion.tbody>
        </table>
    );
};