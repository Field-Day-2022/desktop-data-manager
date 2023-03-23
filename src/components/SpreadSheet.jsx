import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TableEntry } from '../components/TableEntry';
import { TableHeading } from '../components/TableHeading';
import { tableBody } from '../utils/variants';
import { keyLabelMap } from '../const/tableLabels';

export const SpreadSheet = ({ labels, columns, entries, name, setEntries }) => {

    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortState, setSortState] = useState(null);

    useEffect(() => {
        if (sortState !== null) {
            setEntries(sortEntries(entries, sortState.column, sortState.direction));
        }
    }, [sortState]);

    const sortEntries = (entries, column, direction) => {
        const sortedEntries = [...entries];
        sortedEntries.sort((a, b) => {
            if (getValue(a, column) < getValue(b, column)) {
                return (direction === 'asc') ? -1 : 1;
            }
            if (getValue(a, column) > getValue(b, column)) {
                return (direction === 'asc') ? 1 : -1;
            }
            return 0;
        });
        return sortedEntries;
    };

    const sortByColumn = (label) => {
        if (sortedColumn === label) {
            setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortedColumn(label);
            setSortDirection('asc');
        }
        setSortState({ column: label, direction: sortDirection });
    };

    const getKey = (column) => {
        if (column === 'Comments' && name === 'Session') {
            return 'commentsAboutTheArray';
        }
        return Object.keys(keyLabelMap).find(key => keyLabelMap[key] === column);
    }

    const getValue = (entry, column) => {
        if (!entry._document.data.value.mapValue.fields[getKey(column)]) {
            return 'N/A';
        }
        return entry._document.data.value.mapValue.fields[getKey(column)].stringValue;
    }

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