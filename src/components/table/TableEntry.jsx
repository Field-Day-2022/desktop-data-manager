import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { currentTableName } from '../../utils/jotai'
import { AnimatePresence, motion } from 'framer-motion';
import { currentProjectName, appMode } from '../../utils/jotai';
import { deleteMessageVariant, tableRows } from '../../const/animationVariants';
import { CheckIcon, DeleteIcon, EditIcon, XIcon } from '../../assets/icons';
import { usePagination } from '../../utils/firestore';

export const TableEntry = (props) => {
    const { entrySnapshot, shownColumns, index } = props;
    const [currentState, setCurrentState] = useState('viewing');
    const [entryData, setEntryData] = useState(entrySnapshot.data());
    const [keys, setKeys] = useState();
    const currentProject = useAtomValue(currentProjectName);
    const environment = useAtomValue(appMode);
    const tableName = useAtomValue(currentTableName);

    const { updateEntry, deleteEntry, getKeys, getLabel } = usePagination();

    const onSaveClickedHandler = () => {
        if (currentState === 'editing') {
            setCurrentState('viewing');
            updateEntry(getCollectionName(), entrySnapshot.id, entryData);
        } else if (currentState === 'deleting') {
            setCurrentState('viewing');
            deleteEntry(getCollectionName(), entrySnapshot.id);
        }
    };

    const getCollectionName = () => {
        const tablePrefix = (tableName === 'Session') ? 'Session' : 'Data';
        return `${environment === 'test' ? 'Test' : ''}${currentProject}${tablePrefix}`;
    };

    useEffect(() => {
        setKeys(getKeys(tableName));
    }, [tableName]);

    const filteredKeys = keys?.filter(key => shownColumns.includes(getLabel(key, tableName)));

    return (
        <motion.tr
            className="relative hover:bg-neutral-100"
            variants={tableRows}
            initial='initial'
            animate='visible'
            custom={index}
            exit='exit'
        >
            <Actions
                onEditClickedHandler={() => setCurrentState('editing')}
                onCancelClickedHandler={() => setCurrentState('viewing')}
                onDeleteClickedHandler={() => setCurrentState('deleting')}
                onSaveClickedHandler={onSaveClickedHandler}
                currentState={currentState}
            />
            {filteredKeys?.map((key) => (
                <EntryItem
                    key={key}
                    dbKey={key}
                    entryData={entryData}
                    setEntryData={setEntryData}
                    entrySnapshot={entrySnapshot}
                    currentState={currentState}
                />
            ))}
        </motion.tr>
    );
};

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
