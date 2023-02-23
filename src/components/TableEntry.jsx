import { useEffect, useState, forwardRef } from 'react';
import { TABLE_KEYS } from '../const/tableKeys';
import { useAtom } from 'jotai';
import { currentTableName } from '../utils/jotai'
import { AnimatePresence, motion } from 'framer-motion';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { currentProjectName, currentPageName, appMode } from '../utils/jotai';
import { notify, Type } from './Notifier';
import { db } from '../utils/firebase';
import { tableRows } from '../utils/variants';

export const TableEntry = forwardRef((props, ref) => {
    const { entrySnapshot, removeEntry, index } = props;
    
    const [currentState, setCurrentState] = useState('viewing');
    const [entryData, setEntryData] = useState(entrySnapshot.data());
    const [keys, setKeys] = useState();
    const [currentProject, setCurrentProject] = useAtom(currentProjectName);
    const [currentPage, setCurrentPage] = useAtom(currentPageName);
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
        return ((environment === 'test')?'Test':'') + currentProject + ((tableName==='Session')?'Session':'Data')
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
        setKeys(TABLE_KEYS[tableName]);
    }, [])

    return (
        <motion.tr className="relative hover:bg-neutral-100"
            variants={tableRows}
            initial='initial'
            animate='visible'
            custom={index}
            exit='exit'
            layout
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
                <EntryItem
                    entrySnapshot={entrySnapshot}
                    currentState={currentState}
                    dbKey={key}
                    entryData={entryData}
                    setEntryData={setEntryData}
                    key={key}
                />
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
                {currentState === 'viewing' &&
                    <>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                        onClick={() => onEditClickedHandler()}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                    </svg>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                        onClick={() => onDeleteClickedHandler()}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                    </svg>
                    </>
                }
                {(currentState === 'editing' || currentState === 'deleting') &&
                <>
                    <svg
                        key='check'
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                        onClick={() => onSaveClickedHandler()}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <svg
                        key='X'
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                        onClick={() => onCancelClickedHandler()}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </>}
                </AnimatePresence>
            </div>
        </td>
    )
}
