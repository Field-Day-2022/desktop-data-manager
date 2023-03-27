import { useEffect, useState, forwardRef } from 'react';
import { useAtom } from 'jotai';
import { currentTableName } from '../../utils/jotai'
import { AnimatePresence, motion } from 'framer-motion';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { currentProjectName, appMode } from '../../utils/jotai';
import { notify, Type } from '../Notifier';
import { db } from '../../utils/firebase';
import { deleteMessageVariant, tableRows } from '../../const/animationVariants';
import { CheckIcon, DeleteIcon, EditIcon, XIcon } from '../../assets/icons';
import { getKey, getKeys, getLabel } from '../../const/tableLabels';

export const getValue = (entry, column) => {
    if (!entry._document.data.value.mapValue.fields[getKey(column, name)]) {
        return 'N/A';
    }
    return entry._document.data.value.mapValue.fields[getKey(column, name)].stringValue;
}

export const TableEntry = forwardRef((props, ref) => {
    const { entrySnapshot, shownColumns, removeEntry, index } = props;

    const [currentState, setCurrentState] = useState('viewing');
    const [entryData, setEntryData] = useState(entrySnapshot.data());
    const [keys, setKeys] = useState();
    const [currentProject, setCurrentProject] = useAtom(currentProjectName);
    const [environment, setEnvironment] = useAtom(appMode);
    const [tableName, setTableName] = useAtom(currentTableName);

    const onEditClickedHandler = () => {
        console.log('Edit clicked');
        setCurrentState('editing');
    };

    const onDeleteClickedHandler = () => {
        setCurrentState('deleting');
    };

    const getCollectionName = () => {
        return ((environment === 'test') ? 'Test' : '') + currentProject + ((tableName === 'Session') ? 'Session' : 'Data')
    }

    const deleteDocumentFromFirestore = async () => {
        setCurrentState('viewing');
        removeEntry();
        await deleteDoc(
            doc(db, getCollectionName(), entrySnapshot.id)
        )
            .then(() => {
                notify(Type.success, 'Document successfully deleted!');
            })
            .catch((e) => {
                notify(Type.error, `Error deleting document: ${e}`);
            });
    };

    const pushChangesToFirestore = async () => {
        setCurrentState('viewing');
        await setDoc(
            doc(db, getCollectionName(), entrySnapshot.id),
            entryData
        )
            .then(() => {
                notify(Type.success, 'Changes successfully written to database!');
            })
            .catch((e) => {
                notify(Type.error, `Error writing changes to database: ${e}`);
            });
    };

    const onSaveClickedHandler = () => {
        currentState === 'editing' && pushChangesToFirestore();
        currentState === 'deleting' && deleteDocumentFromFirestore();
    };

    const onCancelClickedHandler = () => {
        console.log('Cancel clicked');
        setCurrentState('viewing');
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
                currentState={currentState}
            />
            {keys && keys.map((key) => (
                shownColumns.includes(getLabel(key)) && (
                <EntryItem
                    entrySnapshot={entrySnapshot}
                    currentState={currentState}
                    dbKey={key}
                    entryData={entryData}
                    setEntryData={setEntryData}
                    key={key}
                />)
            ))}
        </motion.tr>
    );
});

const EntryItem = ({ entrySnapshot, dbKey, currentState, setEntryData, entryData }) => {
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
        currentState === 'viewing' ||
        (currentState === 'editing' && !editable) ||
        currentState === 'deleting'
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
    currentState,
}) => {
    return (
        <td className="border-b border-gray-400 p-2">
            <div className="flex flex-row w-full justify-around">
                <AnimatePresence>
                    {currentState === 'deleting' && (
                        <motion.div
                            key='deleteMsg'
                            className="absolute left-8 -top-3 z-10 px-2 rounded-md drop-shadow-xl border-[1px] bg-red-800/10 backdrop-blur border-red-800 shadow-lg  shadow-red-800/25 leading-tight"
                            variants={deleteMessageVariant}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'hidden'}
                        >
                            Are you sure you want to delete this row?
                        </motion.div>
                    )}
                    {currentState === 'viewing' &&
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
                    {(currentState === 'editing' || currentState === 'deleting') &&
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
