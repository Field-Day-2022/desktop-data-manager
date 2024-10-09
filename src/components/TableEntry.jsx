import { useEffect, useState, forwardRef } from 'react';
import { useAtomValue } from 'jotai';
import { currentTableName } from '../utils/jotai';
import { AnimatePresence, motion } from 'framer-motion';
import { tableRows } from '../utils/variants';
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from '../assets/icons';
import { getKey, getKeys, getLabel } from '../const/tableLabels';
import { getSessionEntryCount, startEntryOperation } from '../utils/firestore';
import { Type, notify } from './Notifier';
import { FormField } from './FormFields';

const BINARY_KEYS = ['noCaptures', 'isAlive', 'dead'];
const TRUE_KEYS = ['Y', 'y', 'T', 't'];
const FALSE_KEYS = ['N', 'n', 'F', 'f'];

export const getValue = (entry, column) => {
    const field = entry._document.data.value.mapValue.fields[getKey(column, name)];
    return field ? field.stringValue : 'N/A';
}

export const TableEntry = forwardRef((props, ref) => {
    const {
        entrySnapshot,
        shownColumns,
        removeEntry: removeEntryFromUI,
        index
    } = props;

    const [entryUIState, setEntryUIState] = useState('viewing');
    const [entryData, setEntryData] = useState(entrySnapshot.data());
    const [keys, setKeys] = useState([]);
    const tableName = useAtomValue(currentTableName);
    const [deleteMessage, setDeleteMessage] = useState('Are you sure you want to delete this row?');

    useEffect(() => {
        setKeys(getKeys(tableName));
    }, [tableName]);

    const handleEditClick = () => setEntryUIState('editing');

    const handleDeleteClick = async () => {
        setEntryUIState('deleting');
        if (entrySnapshot.ref.parent.id.includes('Session')) {
            const entryCount = await getSessionEntryCount(entrySnapshot);
            setDeleteMessage(`Are you sure you want to delete this session and its ${entryCount} animal entries?`);
        }
    };

    const handleSaveClick = () => {
        const operationType = entryUIState === 'editing'
            ? (tableName.includes('Session') ? 'uploadSessionEdits' : 'uploadEntryEdits')
            : (tableName.includes('Session') ? 'deleteSession' : 'deleteEntry');

        startEntryOperation(operationType, {
            entrySnapshot,
            entryData,
            setEntryUIState,
            removeEntryFromUI
        }).then(response => notify(...response));
    };

    const handleCancelClick = () => {
        setEntryData(entrySnapshot.data());
        setEntryUIState('viewing');
    };

    return (
        <motion.tr
            className="relative hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 ease-in-out"
            variants={tableRows}
            initial='initial'
            animate='visible'
            custom={index}
            exit='exit'
            ref={ref}
        >
            <Actions
                onEditClick={handleEditClick}
                onCancelClick={handleCancelClick}
                onDeleteClick={handleDeleteClick}
                onSaveClick={handleSaveClick}
                entryUIState={entryUIState}
                deleteMessage={deleteMessage}
            />
            {keys.map(key => (
                shownColumns.includes(getLabel(key)) && (
                    <EntryItem
                        key={key}
                        entrySnapshot={entrySnapshot}
                        entryUIState={entryUIState}
                        dbKey={key}
                        entryData={entryData}
                        setEntryData={setEntryData}
                        className={getLabel(key) === 'Date & Time' ? 'dateTimeColumn' : ''}
                    />
                )
            ))}
        </motion.tr>
    );
});

const EntryItem = ({ entrySnapshot, dbKey, entryUIState, setEntryData, entryData, className}) => {
    const [editable, setEditable] = useState(true);

    const onChangeHandler = (e) => {
        const value = e.target.value.slice(-1);
        const isBinaryKey = BINARY_KEYS.includes(dbKey);
        const isTrueKey = TRUE_KEYS.includes(value);
        const isFalseKey = FALSE_KEYS.includes(value);

        setEntryData(prev => ({
            ...prev,
            [dbKey]: isBinaryKey ? (isTrueKey ? 'true' : (isFalseKey ? 'false' : prev[dbKey])) : e.target.value,
        }));
    };

    const onClickHandler = (e) => {
        if (dbKey === 'year' && entryUIState === 'editing') {
            notify(Type.error, "Editing the year directly is not supported. Please edit the date instead.");
        }
    };
    
    let disabled = dbKey === 'year' || entryUIState === 'viewing' || (entryUIState === 'editing' && !editable) || entryUIState === 'deleting';

    const size = entryData[dbKey] ? String(entryData[dbKey]).length : 1;

    return (
        //<td className="text-center border-b border-neutral-400 dark:border-neutral-600 p-1">
        <td className={`text-center border-b border-neutral-400 dark:border-neutral-600 p-1 ${className || ''}`}>
            <input
                readOnly={disabled}
                className="text-center w-full read-only:bg-transparent read-only:border-transparent read-only:focus:outline-none"
                value={entryData[dbKey] ?? 'N/A'}
                onChange={(e) => onChangeHandler(e)}
                onClick={(e) => onClickHandler(e)}
                size={size}
            />
        </td>
    );
};

const Actions = ({
    onEditClick,
    onDeleteClick,
    onSaveClick,
    onCancelClick,
    entryUIState,
    deleteMessage
}) => {
    return (
        <td className="border-b border-neutral-400 dark:border-neutral-600 p-2">
            <div className="flex flex-row w-full justify-around">
                <AnimatePresence>
                    {entryUIState === 'deleting' && (
                        <motion.div
                            key='deleteMsg'
                            className="absolute text-lg left-8 -top-3 z-10 px-2 rounded-md drop-shadow-xl border-[1px] bg-red-800/10 backdrop-blur border-red-800 shadow-lg  shadow-red-800/25 leading-tight"
                            initial={{ left: '-2rem', opacity: 0 }}
                            animate={{ left: '2rem', opacity: 1 }}
                            exit={{ left: '-20rem', opacity: 0, transition: { opacity: { duration: 0.25 } } }}
                        >
                            {deleteMessage}
                        </motion.div>
                    )}
                    {entryUIState === 'viewing' && (
                        <>
                            <div className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer" onClick={onEditClick}>
                                <EditIcon />
                            </div>
                            <div className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer" onClick={onDeleteClick}>
                                <DeleteIcon />
                            </div>
                        </>
                    )}
                    {(entryUIState === 'editing' || entryUIState === 'deleting') && (
                        <>
                            <div className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer" onClick={onSaveClick}>
                                <CheckIcon />
                            </div>
                            <div className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer" onClick={onCancelClick}>
                                <CloseIcon />
                            </div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </td>
    );
};
