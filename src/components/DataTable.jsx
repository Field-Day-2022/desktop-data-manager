import { ArrowIcon, ExportIcon } from '../assets/icons';
import { TableEntry } from '../components/TableEntry';
import { motion } from 'framer-motion';
import { tableBody } from '../utils/variants';
import { useEffect, useState } from 'react';
import ColumnSelectorButton from './ColumnSelectorButton';
import { useCallback } from 'react';

export default function DataTable({ name, labels, entries, setEntries }) {
    const [columns, setColumns] = useState({});
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');


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

    const sortColumn = (label) => {
        if (sortedColumn === label) {
            setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortedColumn(label);
            setSortDirection('asc');
        }
    };

    // Function to sort entries by column
    const sortEntries = (entries, column, direction) => {
        const sortedEntries = [...entries];
        sortedEntries.sort((a, b) => {
            if (a[column] < b[column]) {
                return (direction === 'asc') ? -1 : 1;
            }
            if (a[column] > b[column]) {
                return (direction === 'asc') ? 1 : -1;
            }
            return 0;
        });
        return sortedEntries;
    };

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

            <div className="overflow-auto w-full h-full-table">
                <table className="w-full table-auto border-separate border-spacing-0">
                    <thead>
                        <tr>
                            <TableHeading label="Actions" />
                            {labels &&
                                labels.map((label) => (columns[label]?.show) && <TableHeading key={label} label={label} active={sortedColumn === label} sortDirection={sortDirection} onClick={() => {
                                    sortColumn(label)
                                    sortEntries(entries, label, sortDirection);
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
        </motion.div>
    );
}

const TableHeading = ({ label, active, sortDirection, onClick }) => {

    const getArrow = () => {
        if (active) {
            return <ArrowIcon direction={(sortDirection === 'asc')?'up':'down'}/>;
        }
    };

    const getLabel = () => {
        return (
            <div className="flex items-center">
                <span>{label}</span>
                {getArrow()}
            </div>
        );
    };

    return (
        <th className="sticky top-0 bg-white z-10 border-b border-neutral-800 p-2 text-sm text-gray-600 font-semibold"
            onClick={onClick}>
            {getLabel()}
        </th>
    );
};
