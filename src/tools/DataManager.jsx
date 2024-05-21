import React from 'react';
import { ExportIcon } from '../assets/icons';
import { motion } from 'framer-motion';
import ColumnSelectorButton from '../components/ColumnSelectorButton';
import { Table } from '../components/Table';
import { useState, useEffect, useCallback } from 'react';
import { getValue } from '../components/TableEntry';
import { SearchField } from '../components/FormFields';
import { CSVLink } from 'react-csv';
import { getKey } from '../const/tableLabels';
import { notify, Type } from '../components/Notifier';
import { getCollectionNameFromDoc } from '../utils/firestore';

export default function DataManager({ name, labels = [], entries = [], setEntries, updateConstraints }) {
    const [columns, setColumns] = useState({});
    const [search, setSearch] = useState('');

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

    const generateCSV = (labels, entries) => {
        if (!labels || !entries) {
            return [];
        }
        let csvData = [];
        csvData.push(labels);
        entries.forEach((entry) => {
            let row = [];
            labels.forEach((label) => {
                if (label !== 'Actions') {
                    let key = getKey(label, name);
                    row.push(entry.data()[key]);
                }
            });
            csvData.push(row);
        });
        return csvData;
    };

    const getCSVName = (entry) => {
        if (!entry) {
            return '';
        }
        const collectionName = getCollectionNameFromDoc(entry);
        const dateTime = new Date().toLocaleString();
        if (name === 'Session') {
            return collectionName + ' ' + dateTime;
        } else {
            return collectionName.slice(0, -4) + name + ' ' + dateTime;
        }
    };

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
                return entryValue?.toString().toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [labels]);

    return (
        <motion.div className="bg-white dark:bg-neutral-950">
            <div className="flex justify-between px-5 items-center">
                <h1 className="heading pt-4">{name} - Entries</h1>
                <div className="flex px-5 items-center">
                    <SearchField search={search} setSearch={handleSearchChange} />
                    <div className='flex justify-center text-2xl'>
                        <ColumnSelectorButton
                            labels={labels}
                            columns={columns}
                            toggleColumn={toggleColumn}
                        />
                        <CSVLink
                            className='hover:scale-125 transition h-8 cursor-pointer'
                            data={generateCSV(labels, entries)}
                            filename={getCSVName(entries[0]) + '.csv'}
                            onClick={() => {
                                if (generateCSV(labels, entries).length === 0) {
                                    notify(Type.error, 'No data to export');
                                } else {
                                    notify(Type.success, 'Exported data to CSV');
                                }
                            }}
                        >
                            <ExportIcon />
                        </CSVLink>
                    </div>

                </div>
            </div>
            <div className="overflow-auto w-full h-full-table">
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