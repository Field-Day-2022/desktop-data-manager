import { useState, useEffect, useCallback } from 'react';
import { useTable } from './useTable';

export const useColumns = (labels) => {
    const [columns, setColumns] = useState({});

    const { getEntryValue } = useTable();

    useEffect(() => {
        setColumns(
            labels.reduce((acc, label) => {
                acc[label] = { show: true, sorted: false };
                return acc;
            }, {})
        );
    }, [labels]);

    const getShownColumns = useCallback((columns) => {
        return Object.keys(columns).reduce((acc, key) => {
            if (columns[key].show) {
                acc[key] = columns[key];
            }
            return acc;
        }, {});
    }, []);

    const toggleColumnVisibility = useCallback((label) => {
        setColumns((prevColumns) => ({
            ...prevColumns,
            [label]: {
                ...prevColumns?.[label],
                show: !prevColumns?.[label]?.show,
            },
        }));
    }, []);

    const [sortDirection, setSortDirection] = useState('asc');

    const setSortedColumn = useCallback((column) => {
        setColumns((prevColumns) => {
            const newColumns = { ...prevColumns };
            Object.keys(newColumns).forEach((key) => {
                newColumns[key].sorted = false;
            });
            newColumns[column].sorted = true;
            return newColumns;
        });
    }, []);

    const getSortedColumn = useCallback(() => {
        return Object.keys(columns).find((key) => columns[key].sorted);
    }, [columns]);

    const sortByColumn = useCallback(
        (column) => {
            const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            setSortedColumn(column);
            setSortDirection(newSortDirection);
            setColumns((prevColumns) => ({
                ...prevColumns,
                [getSortedColumn()]: {
                    ...prevColumns?.[getSortedColumn()],
                    sorted: false,
                },
                [column]: {
                    ...prevColumns?.[column],
                    sorted: true,
                },
            }));
        },
        [sortDirection, getSortedColumn]
    );

    const sortedEntries = useCallback((entries) => {
        const sortedEntries = [...entries];
        sortedEntries.sort((a, b) => {
            if (getEntryValue(a, getSortedColumn()) > getEntryValue(b, getSortedColumn())) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            if (getEntryValue(a, getSortedColumn()) < getEntryValue(b, getSortedColumn())) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            return 0;
        });
        return sortedEntries;
    }, []);

    return {
        columns,
        getShownColumns,
        toggleColumnVisibility,
        sortDirection,
        sortByColumn,
        getSortedColumn,
        sortedEntries,
    };
};
