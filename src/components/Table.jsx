import React, { useState, useRef, useEffect } from 'react';
import { TableEntry } from './TableEntry';
import { TableHeading } from './TableHeading';
import { getKey } from '../const/tableLabels';
import '../styles/Table.css';

export const Table = ({ labels, columns, entries, name, setEntries }) => {
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [columnWidths, setColumnWidths] = useState({});
    const [resizing, setResizing] = useState(null);
    const tableRef = useRef(null);
    const startXRef = useRef(null);
    const startWidthRef = useRef(null);

    const calculateColumnWidths = () => {
        if (!tableRef.current) return;

        const measureDiv = document.createElement('div');
        measureDiv.style.position = 'absolute';
        measureDiv.style.visibility = 'hidden';
        measureDiv.style.whiteSpace = 'nowrap';
        document.body.appendChild(measureDiv);

        const newWidths = {};

        newWidths['actions'] = 60;

        labels.forEach((label, index) => {
            if (columns[label]?.show) {
                measureDiv.textContent = label;
                // Reduced padding from 40 to 16
                let maxWidth = measureDiv.offsetWidth + 12;

                entries.forEach((entry) => {
                    const key = getKey(label, name);
                    const value = entry.data?.()[key] || 'N/A';
                    measureDiv.textContent = String(value);

                    const contentWidth = measureDiv.offsetWidth + 34;
                    maxWidth = Math.max(maxWidth, contentWidth);
                });
                const adjustmentFactor = 20; // increase min width as you wish. I find 20 to be the lowest usable number.
                newWidths[index] = Math.min(Math.max(maxWidth + adjustmentFactor, 20), 400);
            }
        });

        document.body.removeChild(measureDiv);
        return newWidths;
    };

    useEffect(() => {
        const initialWidths = calculateColumnWidths();
        setColumnWidths((prevWidths) => {
            return JSON.stringify(prevWidths) !== JSON.stringify(initialWidths)
                ? initialWidths
                : prevWidths;
        });
    }, [entries, labels, columns]);

    const sortedEntries = (entries, column, direction) => {
        const sortedEntries = [...entries];
        sortedEntries.sort((a, b) => {
            if (getValue(a, column) > getValue(b, column)) {
                return direction === 'asc' ? 1 : -1;
            }
            if (getValue(a, column) < getValue(b, column)) {
                return direction === 'asc' ? -1 : 1;
            }
            return 0;
        });
        return sortedEntries;
    };

    const sortByColumn = (column) => {
        const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortedColumn(column);
        setSortDirection(newSortDirection);
    };

    const getValue = (entry, column) => {
        const key = getKey(column, name);
        const value = entry.data?.()[key] || 'N/A';
        return value;
    };

    const startResizing = (e, columnIndex) => {
        setResizing(columnIndex);
        startXRef.current = e.clientX;
        startWidthRef.current = columnWidths[columnIndex] || (columnIndex === 'actions' ? 50 : 80);

        e.preventDefault();
        e.stopPropagation();
    };

    const handleMouseMove = (e) => {
        if (resizing === null) return;

        const currentWidth = startWidthRef.current;
        const mouseMove = e.clientX - startXRef.current;
        const newWidth = Math.max(20, currentWidth + mouseMove);

        requestAnimationFrame(() => {
            setColumnWidths((prev) => ({
                ...prev,
                [resizing]: Math.min(newWidth, 400), // Keeping maximum width at 400px
            }));
        });

        e.preventDefault();
    };

    const stopResizing = () => {
        setResizing(null);
        startXRef.current = null;
        startWidthRef.current = null;
    };

    useEffect(() => {
        if (resizing !== null) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', stopResizing);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', stopResizing);
            };
        }
    }, [resizing]);

    const resetColumnWidths = () => {
        const initialWidths = calculateColumnWidths();
        setColumnWidths(initialWidths);
    };

    return (
        <div className="w-full overflow-x-auto relative border-b border-neutral-400">
            <div className="flex justify-end mb-1">
                <button
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded border border-gray-300 transition-colors"
                    onClick={resetColumnWidths}
                >
                    Reset Columns
                </button>
            </div>
            <div className="min-w-full inline-block">
                <table
                    ref={tableRef}
                    className="w-full table-auto border-collapse"
                    style={{
                        tableLayout: 'fixed',
                        borderSpacing: 0,
                    }}
                >
                    <thead>
                        <tr className="border-b border-neutral-200">
                            <th
                                className="relative font-semibold text-gray-600 text-center"
                                style={{
                                    width: columnWidths['actions'] || 60,
                                    minWidth: 20,
                                    position: 'relative',
                                    padding: '4px 2px', // Minimal padding
                                }}
                            >
                                Actions
                                <div
                                    className="absolute top-0 h-full cursor-col-resize hover:bg-blue-400 z-10"
                                    style={{
                                        right: '-1px',
                                        width: '2px',
                                        transform: 'translateX(50%)',
                                    }}
                                    onMouseDown={(e) => startResizing(e, 'actions')}
                                />
                            </th>
                            {labels &&
                                labels.map(
                                    (label, index) =>
                                        columns[label]?.show && (
                                            <th
                                                key={label}
                                                className="relative border-l border-neutral-200"
                                                style={{
                                                    width: columnWidths[index] || 60,
                                                    minWidth: 20,
                                                    position: 'relative',
                                                    padding: '4px 2px', // Minimal padding
                                                }}
                                            >
                                                <TableHeading
                                                    label={label}
                                                    active={sortedColumn === label}
                                                    sortDirection={sortDirection}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        sortByColumn(label);
                                                    }}
                                                />
                                                <div
                                                    className="absolute top-0 h-full cursor-col-resize hover:bg-red-800/50 z-10"
                                                    style={{
                                                        right: '-1px',
                                                        width: '6px',
                                                        transform: 'translateX(50%)',
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.stopPropagation();
                                                        startResizing(e, index);
                                                    }}
                                                />
                                            </th>
                                        ),
                                )}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedEntries(entries, sortedColumn, sortDirection).map((entry, index) => (
                            <TableEntry
                                index={index}
                                key={entry.id}
                                entrySnapshot={entry}
                                shownColumns={[...labels].filter((label) => columns[label]?.show)}
                                tableName={name}
                                removeEntry={() => {
                                    setEntries(entries.filter((e) => e !== entry));
                                }}
                                columnWidths={columnWidths}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
