import React from 'react';
import { ExportIcon } from '../assets/icons';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import ColumnSelectorButton from '../components/ColumnSelectorButton';
import { Table } from '../components/Table';
import { useState, useEffect, useCallback } from 'react';
import { getValue } from '../components/TableEntry';
import {SearchField} from '../components/FormFields';
import { CSVLink } from 'react-csv';
import { getKey } from '../const/tableLabels';
import { notify, Type } from '../components/Notifier';
import { getCollectionNameFromDoc } from '../utils/firestore';
import { where } from 'firebase/firestore';

export default function DataManager({ name, labels = [], entries = [], setEntries, updateConstraints }) {
    const [columns, setColumns] = useState({});
    const [search, setSearch] = useState('');
    const [searchField, setSearchField] = useState('Year');
    const [searchTerm, setSearchTerm] = useState('')
    const [searchButtonText, setSearchButtonText] = useState('Search')

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
        if(name === 'Session') {
            return collectionName +  ' ' + dateTime;
        } else {
            return collectionName.slice(0, -4) + name + ' ' + dateTime;
        }
    };

    const doSearch = () => {
        const key = getKey(searchField)
        updateConstraints(where(key, '==', searchTerm))
    }

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
        <motion.div className="bg-white">
            <div className="flex justify-between px-5 items-center">
                <h1 className="heading pt-4">{name} - Entries</h1>
                <motion.div
                    className='relative flex flex-row mt-2 border-gray-400/25 border-2 rounded-xl p-2 space-x-2'
                >  
                    <motion.p
                        className='absolute -top-3 bg-white text-sm'
                    >Search entire project</motion.p>
                    <p className='text-lg self-center'>Year:</p>
                    {/* <motion.select
                        value={searchField || 'Select an option'}
                        onChange={e => setSearchField(e.target.value)}
                        >
                    <motion.option value="Select an option" disabled hidden>Select an option</motion.option>
                        {labels.map(l => <option key={l}>{l}</option>)}
                    </motion.select> */}
                    <motion.input 
                        className='w-20'
                        placeholder='2023'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <motion.button
                        disabled={!(searchTerm)}
                        className='button w-min transition'
                        onClick={doSearch}
                    >
                        {searchButtonText}
                    </motion.button>
                </motion.div>
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
                                if(generateCSV(labels, entries).length === 0) {
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