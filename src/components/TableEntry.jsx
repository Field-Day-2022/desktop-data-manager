import { useEffect, useState, forwardRef } from 'react';
import { useAtomValue } from 'jotai';
import { currentTableName } from '../utils/jotai'
import { AnimatePresence, motion } from 'framer-motion';
import { deleteEntryMessageVariant, tableRows } from '../utils/variants';
import { CheckIcon, DeleteIcon, EditIcon, XIcon } from '../assets/icons';
import { getKey, getKeys, getLabel } from '../const/tableLabels';
import { updateEntry, deleteEntry } from '../utils/firestore';
import InputField from './InputField';
import { notify, Type } from '../components/Notifier';

export const getValue = (entry, column) => {
    if (!entry._document.data.value.mapValue.fields[getKey(column, name)]) {
        return 'N/A';
    }
    return entry._document.data.value.mapValue.fields[getKey(column, name)].stringValue;
}

export const TableEntry = forwardRef((props, ref) => {
    const { entrySnapshot, shownColumns, removeEntryUI, updateEntryUI, index } = props;

    const [entryUIState, setEntryUIState] = useState('viewing');
    const [entryData, setEntryData] = useState(entrySnapshot.data());
    const [keys, setKeys] = useState();
    const tableName = useAtomValue(currentTableName);


    const onEditClickedHandler = () => {
        setEntryUIState('editing');
    };

    const onDeleteClickedHandler = () => {
        setEntryUIState('deleting');
    };

    const onSaveClickedHandler = async () => {
        if (entryUIState === 'editing') {
            await updateEntry(entrySnapshot, entryData).then(([success, message]) => {
                const notificationType = success ? Type.success : Type.error;
                notify(notificationType, message);
                updateEntryUI(entrySnapshot);
            }).catch((error) => {
                notify(Type.error, 'Unknown error occured while updating entry: ' + error.message);
                console.error(error);
            });
            setEntryData(entrySnapshot.data());
        } else if (entryUIState === 'deleting') {
            await deleteEntry(entrySnapshot).then(([success, message]) => {
                const notificationType = success ? Type.success : Type.error;
                notify(notificationType, message);
                removeEntryUI(entrySnapshot);
            }).catch((error) => {
                notify(Type.error, 'Unknown error occured while deleting entry: ' + error.message);
            });
        }
        setEntryUIState('viewing');
    };

    const onCancelClickedHandler = () => {
        setEntryUIState('viewing');
        setEntryData(entrySnapshot.data());
    };

    useEffect(() => {
        setKeys(getKeys(tableName));
    }, [])

    return (
        <motion.tr
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
    const BINARY_KEYS = ['noCaptures', 'isAlive', 'dead'];
    const KEY_MAP = {
        Y: true,
        y: true,
        T: true,
        t: true,
        N: false,
        n: false,
        F: false,
        f: false,
    };

    const onChangeHandler = (e) => {
        console.log(e.target.value)
        if (BINARY_KEYS.includes(dbKey)) {
            const lastChar = e.target.value.slice(-1);
            const value = KEY_MAP[lastChar];
            setEntryData((prevEntryData) => ({
                ...prevEntryData,
                [dbKey]: value,
            }));
        } else {
            setEntryData((prevEntryData) => ({
                ...prevEntryData,
                [dbKey]: e.target.value,
            }));
        }
    };

    const disabled = entryUIState !== 'editing' || dbKey === 'dateTime';

    const size = entryData[dbKey]?.length || 1;

    let value = entryData[dbKey] || getValue(entrySnapshot, dbKey);

    value = (dbKey === 'dateTime') ? new Date(value).toLocaleString() : value;

    return (
        <td key={dbKey}>
            <InputField
                disabled={disabled}
                className="text-center"
                value={value}
                onChange={onChangeHandler}
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
        <td>
            <div className="flex flex-row w-full justify-around">
                <AnimatePresence>
                    {entryUIState === 'deleting' && (
                        <motion.div
                            key='deleteMsg'
                            className="absolute left-8 -top-3 z-10 px-2 rounded-md drop-shadow-xl border-[1px] bg-red-800/10 backdrop-blur border-red-800 shadow-lg  shadow-red-800/25 leading-tight"
                            variants={deleteEntryMessageVariant}
                            initial='hidden'
                            animate='visible'
                            exit='hidden'
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
