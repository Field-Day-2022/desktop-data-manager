import { useEffect, useState, forwardRef } from 'react';
import { useAtomValue } from 'jotai';
import { currentTableName } from '../utils/jotai'
import { AnimatePresence, motion } from 'framer-motion';
import { tableRows } from '../utils/variants';
import { CheckIcon, DeleteIcon, EditIcon, XIcon } from '../assets/icons';
import { getKey, getKeys, getLabel } from '../const/tableLabels';
import { useFirestore }  from '../hooks/useFirestore';

export const getValue = (entry, column) => {
    if (!entry._document.data.value.mapValue.fields[getKey(column, name)]) {
        return 'N/A';
    }
    return entry._document.data.value.mapValue.fields[getKey(column, name)].stringValue;
}

export const TableEntry = forwardRef((props, ref) => {
    const { entrySnapshot, shownColumns, removeEntry: removeEntryFromUI, index } = props;

    const [entryUIState, setEntryUIState] = useState('viewing');
    const [entryData, setEntryData] = useState(entrySnapshot.data());
    const [keys, setKeys] = useState();
    const tableName = useAtomValue(currentTableName);

    const { startEntryOperation } = useFirestore();

    const onEditClickedHandler = () => {
        console.log('Edit clicked');
        setEntryUIState('editing');
    };

    const onDeleteClickedHandler = () => {
        setEntryUIState('deleting');
    };

    const onSaveClickedHandler = () => {
        entryUIState === 'editing' && 
            startEntryOperation(
                'uploadEntryEdits', 
                { 
                    entrySnapshot, 
                    entryData, 
                    setEntryUIState 
                }
            );
        entryUIState === 'deleting' && 
            startEntryOperation(
                'deleteEntry', 
                {
                    entrySnapshot,
                    removeEntryFromUI,
                    setEntryUIState
                }
            )
    };

    const onCancelClickedHandler = () => {
        console.log('Cancel clicked');
        setEntryUIState('viewing');
    };

    useEffect(() => {
        setKeys(getKeys(tableName));
    }, [])

    return (
        <motion.tr className="relative hover:bg-neutral-100"
            variants={tableRows}
            initial='initial'
            animate='visible'
            custom={index}
            exit='exit'
            ref={ref}
        >
            <Actions
                onEditClickedHandler={onEditClickedHandler}
                onCancelClickedHandler={onCancelClickedHandler}
                onDeleteClickedHandler={onDeleteClickedHandler}
                onSaveClickedHandler={onSaveClickedHandler}
                entryUIState={entryUIState}
            />
            {keys && keys.map((key) => (
                shownColumns.includes(getLabel(key)) && (
                <EntryItem
                    entrySnapshot={entrySnapshot}
                    entryUIState={entryUIState}
                    dbKey={key}
                    entryData={entryData}
                    setEntryData={setEntryData}
                    key={key}
                />)
            ))}
        </motion.tr>
    );
});

const EntryItem = ({ entrySnapshot, dbKey, entryUIState, setEntryData, entryData }) => {
    const [displayText, setDisplayText] = useState(entrySnapshot.data()[dbKey]);
    const [editable, setEditable] = useState(true);

    const BINARY_KEYS = ['noCaptures', 'isAlive', 'dead'];
    const TRUE_KEYS = ['Y', 'y', 'T', 't'];
    const FALSE_KEYS = ['N', 'n', 'F', 'f'];

    useEffect(() => {
        if (dbKey === 'dateTime') {
            let tempDate = new Date(entrySnapshot.data()[dbKey]);
            setDisplayText(tempDate.toLocaleString());
            setEditable(false);
        }
    }, []);

    const onChangeHandler = (e) => {
        if (BINARY_KEYS.includes(dbKey)) {
            if (TRUE_KEYS.includes(e.target.value.slice(-1))) {
                setEntryData((prevEntryData) => ({
                    ...prevEntryData,
                    [dbKey]: 'true',
                }));
            } else if (FALSE_KEYS.includes(e.target.value.slice(-1))) {
                setEntryData((prevEntryData) => ({
                    ...prevEntryData,
                    [dbKey]: 'false',
                }));
            }
        } else {
            setEntryData((prevEntryData) => ({
                ...prevEntryData,
                [dbKey]: e.target.value,
            }));
        }
    };

    let disabled = false;

    if (
        entryUIState === 'viewing' ||
        (entryUIState === 'editing' && !editable) ||
        entryUIState === 'deleting'
    ) {
        disabled = true;
    }

    let size = 1;
    if (entrySnapshot.data()[dbKey] !== undefined) {
        size = entrySnapshot.data()[dbKey].length;
    }

    return (
        <td key={dbKey} className="text-center border-b border-gray-400 p-2">
            <input
                disabled={disabled}
                className="text-center transition disabled:bg-transparent outline-none rounded-lg"
                type="text"
                value={dbKey === 'dateTime' ? displayText : entryData[dbKey] ?? 'N/A'}
                onChange={(e) => onChangeHandler(e)}
                size={size}
            />
        </td>
    );
};

const Actions = ({
    onEditClickedHandler,
    onDeleteClickedHandler,
    onSaveClickedHandler,
    onCancelClickedHandler,
    entryUIState,
}) => {
    return (
        <td className="border-b border-gray-400 p-2">
            <div className="flex flex-row w-full justify-around">
                <AnimatePresence>
                    {entryUIState === 'deleting' && (
                        <motion.div
                            key='deleteMsg'
                            className="absolute left-8 -top-3 z-10 px-2 rounded-md drop-shadow-xl border-[1px] bg-red-800/10 backdrop-blur border-red-800 shadow-lg  shadow-red-800/25 leading-tight"
                            initial={{
                                left: '-2rem',
                                opacity: 0,
                            }}
                            animate={{
                                left: '2rem',
                                opacity: 1,
                            }}
                            exit={{
                                left: '-20rem',
                                opacity: 0,
                            }}
                        >
                            Are you sure you want to delete this row?
                        </motion.div>
                    )}
                    {entryUIState === 'viewing' &&
                        <>
                            <div
                                className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                                onClick={() => onEditClickedHandler()}>
                                <EditIcon />
                            </div>
                            <div
                                className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                                onClick={() => onDeleteClickedHandler()}>
                                <DeleteIcon />
                            </div>
                        </>
                    }
                    {(entryUIState === 'editing' || entryUIState === 'deleting') &&
                        <>
                            <div
                                className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                                onClick={() => onSaveClickedHandler()}>
                                <CheckIcon />
                            </div>
                            <div
                                className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                                onClick={() => onCancelClickedHandler()}>
                                <XIcon />
                            </div>
                        </>}
                </AnimatePresence>
            </div>
        </td>
    )
}
