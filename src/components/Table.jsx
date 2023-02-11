// https://firebase.google.com/docs/firestore/query-data/query-cursors
// https://firebase.google.com/docs/firestore/query-data/order-limit-data
import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, orderBy, startAfter, limit, getDocs, startAt, where } from 'firebase/firestore';

export default function Table({ tableName, collectionName }) {
    const [entries, setEntries] = useState([]);
    const [documentQueryCursor, setDocumentQueryCursor] = useState();
    const [queryCursorStack, setQueryCursorStack] = useState([]);
    const [batchSize, setBatchSize] = useState(15);
    const [labels, setLabels] = useState();
    const [whereClause, setWhereClause] = useState();

    const sessionLabels = [
        'Date & Time',
        'Recorder',
        'Handler',
        'Site',
        'Array',
        'No Captures',
        'Trap Status',
        'Comments',
    ];

    const turtleLabels = [
        'Date & Time',
        'Site',
        'Array',
        'Fence Trap',
        'Taxa',
        'Species Code',
        'Genus',
        'Species',
        'Mass(g)',
        'Sex',
        'Dead?',
        'Comments',
    ]

    const lizardLabels = [
        'Date & Time',
        'Site',
        'Array',
        'Fence Trap',
        'Taxa',
        'Species Code',
        'Genus',
        'Species',
        'Toe-clip Code',
        'Recapture',
        'SVL(mm)',
        'VTL(mm)',
        'Regen Tail?',
        'OTL(mm)',
        'Hatchling?',
        'Mass(g)',
        'Sex',
        'Dead?',
        'Comments',
    ]

    const mammalLabels = [
        'Date & Time',
        'Site',
        'Array',
        'Fence Trap',
        'Taxa',
        'Species Code',
        'Genus',
        'Species',
        'Mass(g)',
        'Sex',
        'Dead?',
        'Comments',
    ]

    const snakeLabels = [
        'Date & Time',
        'Site',
        'Array',
        'Fence Trap',
        'Taxa',
        'Species Code',
        'Genus',
        'Species',
        'SVL(mm)',
        'VTM(mm)',
        'Mass(g)',
        'Sex',
        'Dead?',
        'Comments',
    ]

    const arthropodLabels = [
        'Date & Time',
        'Site',
        'Array',
        'Fence Trap',
        'Predator?',
        'ARAN',
        'AUCH',
        'BLAT',
        'CHIL',
        'COLE',
        'CRUS',
        'DERM',
        'DIEL',
        'DIPT',
        'HETE',
        'HYMA',
        'HYMB',
        'LEPI',
        'MANT',
        'ORTH',
        'PSEU',
        'SCOR',
        'SOLI',
        'THYS',
        'UNKI',
        'MICRO',
        'Comments'
    ]

    const amphibianLabels = [
        'Date & Time',
        'Site',
        'Array',
        'Fence Trap',
        'Taxa',
        'Species Code',
        'Genus',
        'Species',
        'HD-Body',
        'Mass(g)',
        'Sex',
        'Dead',
        'Comments',
    ]

    console.log(entries)

    useEffect(() => {
        console.log(`loading ${tableName} from ${collectionName}`)
        const loadInitialEntries = async (initialWhereClause) => {
            let initialQuery;
            if (tableName !== 'Session') {
                initialQuery = query(
                    collection(db, collectionName),
                    where(initialWhereClause[0], '==', initialWhereClause[1]),
                    orderBy('dateTime', 'desc'),
                    limit(batchSize)
                );
            } else {
                initialQuery = query(
                    collection(db, collectionName),
                    orderBy('dateTime', 'desc'),
                    limit(batchSize)
                );
            }
            const initialQuerySnapshot = await getDocs(initialQuery);
            setEntries(initialQuerySnapshot.docs);
            const lastVisibleDoc = initialQuerySnapshot.docs[initialQuerySnapshot.docs.length - 1];
            setDocumentQueryCursor(lastVisibleDoc);
        };
        if (tableName === 'Session') {
            setLabels(sessionLabels);
            loadInitialEntries();
        } else if (tableName === 'Turtle') {
            setLabels(turtleLabels);
            setWhereClause(['taxa', 'Turtle'])
            loadInitialEntries(['taxa', 'Turtle'])
        } else if (tableName === 'Lizard') {
            setLabels(lizardLabels);
            setWhereClause(['taxa', 'Lizard'])
            loadInitialEntries(['taxa', 'Lizard'])
        } else if (tableName === 'Mammal') {
            setLabels(mammalLabels);
            setWhereClause(['taxa', 'Mammal'])
            loadInitialEntries(['taxa', 'Mammal'])
        } else if (tableName === 'Snake') {
            setLabels(snakeLabels);
            setWhereClause(['taxa', 'Snake'])
            loadInitialEntries(['taxa', 'Snake'])
        } else if (tableName === 'Arthropod') {
            setLabels(arthropodLabels);
            setWhereClause(['taxa', 'N/A'])
            loadInitialEntries(['taxa', 'N/A'])
        } else if (tableName === 'Amphibian') {
            setLabels(amphibianLabels);
            setWhereClause(['taxa', 'Amphibian'])
            loadInitialEntries(['taxa', 'Amphibian'])
        }
    }, [ collectionName ]);

    const changeBatchSize = async (newBatchSize) => {
        setBatchSize(newBatchSize)
        let initialQuery;
        if (tableName !== 'Session') {
            initialQuery = query(
                collection(db, collectionName),
                where(whereClause[0], '==', whereClause[1]),
                orderBy('dateTime', 'desc'),
                limit(newBatchSize)
            );
        } else {
            initialQuery = query(
                collection(db, collectionName),
                orderBy('dateTime', 'desc'),
                limit(newBatchSize)
            );
        }
        const initialQuerySnapshot = await getDocs(initialQuery);
        setEntries(initialQuerySnapshot.docs);
        const lastVisibleDoc = initialQuerySnapshot.docs[initialQuerySnapshot.docs.length - 1];
        setDocumentQueryCursor(lastVisibleDoc);
    }

    const loadPrevBatch = async () => {
        console.log(`loading previous batch of ${batchSize} entries`);
        let prevBatchQuery;
        if (tableName !== 'Session') {
            prevBatchQuery = query(
                collection(db, collectionName),
                where(whereClause[0], '==', whereClause[1]),
                orderBy('dateTime', 'desc'),
                startAt(queryCursorStack[queryCursorStack.length - 1]),
                limit(batchSize)
            );
        } else {
            prevBatchQuery = query(
                collection(db, collectionName),
                orderBy('dateTime', 'desc'),
                startAt(queryCursorStack[queryCursorStack.length - 1]),
                limit(batchSize)
            );
        }
        const prevBatchSnapshot = await getDocs(prevBatchQuery);
        setEntries(prevBatchSnapshot.docs);
        setDocumentQueryCursor(prevBatchSnapshot.docs[prevBatchSnapshot.docs.length - 1]);
        let tempStack = queryCursorStack;
        tempStack.pop();
        setQueryCursorStack(tempStack)
    }


    const loadNextBatch = async () => {
        setQueryCursorStack([
            ...queryCursorStack,
            entries[0]
        ])
        console.log(`loading next batch of ${batchSize} entries`)
        let nextBatchQuery;
        if (tableName !== 'Session') {
            nextBatchQuery = query(
                collection(db, collectionName),
                where(whereClause[0], '==', whereClause[1]),
                orderBy('dateTime', 'desc'),
                startAfter(documentQueryCursor),
                limit(batchSize)
            );
        } else {
            nextBatchQuery = query(
                collection(db, collectionName),
                orderBy('dateTime', 'desc'),
                startAfter(documentQueryCursor),
                limit(batchSize)
            );
        }
        const nextBatchSnapshot = await getDocs(nextBatchQuery);
        setEntries(nextBatchSnapshot.docs);
        const lastVisibleDoc = nextBatchSnapshot.docs[nextBatchSnapshot.docs.length - 1];
        setDocumentQueryCursor(lastVisibleDoc);
    };

    return (
        <div className="bg-white m-4 w-full-minus-sideBar rounded-xl p-4 drop-shadow-2xl">
            <h1 className='text-3xl'>{tableName} - Entries</h1>
            <div className='overflow-auto w-full'>
                <table className='w-full'>
                    <thead>
                        <tr>
                            <TableHeading label="Actions" />
                            {labels && labels.map((label) => <TableHeading key={label} label={label} />)}
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry) => (
                            <Entry key={entry.id} entrySnapshot={entry} tableName={tableName} />
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination 
                batchSize={batchSize}
                changeBatchSize={changeBatchSize}
                loadPrevBatch={loadPrevBatch}
                loadNextBatch={loadNextBatch}
            />
        </div>
    );
}

const Pagination = ({
    batchSize,
    changeBatchSize,
    loadNextBatch,
    loadPrevBatch
}) => {
    const [ batchSizeOptionsShown, setBatchSizeOptionsShown ] = useState(false);

    const onClickHandler = (batchSize) => {
        changeBatchSize(batchSize)
        setBatchSizeOptionsShown(false);
    }

    return (
        <div className="w-full p-2 flex justify-end items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer hover:scale-125 transition active:scale-100"
                onClick={() => loadPrevBatch()}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>

            <div className='relative p-2'>
                <button 
                    className="peer cursor-pointer border-[1px] border-gray-400 rounded-xl drop-shadow-lg p-2 active:scale-100 transition hover:scale-110"
                    onClick={() => setBatchSizeOptionsShown(!batchSizeOptionsShown)}
                >{`${batchSize} Rows`}</button>            
                {batchSizeOptionsShown && 
                <ul className="absolute p-2 rounded-xl w-24 -left-1 text-center bg-white/90 drop-shadow-2xl">
                    <li className='cursor-pointer hover:text-blue-400' onClick={() => onClickHandler(15)}>15 Rows</li>
                    <li className='cursor-pointer hover:text-blue-400' onClick={() => onClickHandler(50)}>50 Rows</li>
                    <li className='cursor-pointer hover:text-blue-400' onClick={() => onClickHandler(100)}>100 Rows</li>
                </ul>}
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer hover:scale-125 transition active:scale-100"
                onClick={() => loadNextBatch()}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>

        </div>
    )
}



const TableHeading = ({ label }) => {
    return <th className="border-b border-gray-800 p-2 text-sm text-gray-600 font-semibold">{label}</th>;
};

const Entry = ({ entrySnapshot, tableName }) => {
    const [currentState, setCurrentState] = useState('viewing');
    const [entryData, setEntryData] = useState(entrySnapshot.data());
    const [keys, setKeys] = useState();

    // console.log(entryData);

    const SESSION_KEYS = [
        'dateTime',
        'recorder',
        'handler',
        'site',
        'array',
        'noCaptures',
        'trapStatus',
        'commentsAboutTheArray',
    ];

    const TURTLE_KEYS = [
        'dateTime',
        'site',
        'array',
        'fenceTrap',
        'taxa',
        'speciesCode',
        'genus',
        'species',
        'massG',
        'sex',
        'dead',
        'comments'
    ]

    const LIZARD_KEYS = [
        'dateTime',
        'site',
        'array',
        'fenceTrap',
        'taxa',
        'speciesCode',
        'genus',
        'species',
        'toeClipCode',
        'recapture',
        'svlMm',
        'vtlMm',
        'regenTail',
        'otlMm',
        'hatchling',
        'massG',
        'sex',
        'dead',
        'comments',
    ]

    const MAMMAL_KEYS = [
        'dateTime',
        'site',
        'array',
        'fenceTrap',
        'taxa',
        'speciesCode',
        'genus',
        'species',
        'massG',
        'sex',
        'dead',
        'comments',
    ]

    const SNAKE_KEYS = [
        'dateTime',
        'site',
        'array',
        'fenceTrap',
        'taxa',
        'speciesCode',
        'genus',
        'species',
        'svlMm',
        'vtlMm',
        'massG',
        'sex',
        'dead',
        'comments',
    ]

    const ARTHROPOD_KEYS = [
        'dateTime',
        'site',
        'array',
        'fenceTrap',
        'predator',
        'aran',
        'auch',
        'blat',
        'chil',
        'cole',
        'crus',
        'derm',
        'diel',
        'dipt',
        'hete',
        'hyma',
        'hymb',
        'lepi',
        'mant',
        'orth',
        'pseu',
        'scor',
        'soli',
        'thys',
        'unki',
        'micro',
        'comments',
    ]

    const AMPHIBIAN_KEYS = [
        'dateTime',
        'site',
        'array',
        'fenceTrap',
        'taxa',
        'speciesCode',
        'genus',
        'species',
        'hdBody',
        'massG',
        'sex',
        'dead',
        'comments',
    ]

    const onEditClickedHandler = () => {
        console.log('Edit clicked');
        setCurrentState('editing');
    };

    const onDeleteClickedHandler = () => {
        console.log('Delete clicked');
        setCurrentState('deleting');
    };

    const onSaveClickedHandler = () => {
        console.log('Save clicked');
    };

    const onCancelClickedHandler = () => {
        console.log('Cancel clicked');
        setCurrentState('viewing');
    };

    useEffect(() => {
        if (tableName === 'Session') {
            setKeys(SESSION_KEYS);
        } else if (tableName === 'Turtle') {
            setKeys(TURTLE_KEYS);
        } else if (tableName === 'Lizard') {
            setKeys(LIZARD_KEYS);
        } else if (tableName === 'Mammal') {
            setKeys(MAMMAL_KEYS);
        } else if (tableName === 'Snake') {
            setKeys(SNAKE_KEYS);
        } else if (tableName === 'Arthropod') {
            setKeys(ARTHROPOD_KEYS);
        } else if (tableName === 'Amphibian') {
            setKeys(AMPHIBIAN_KEYS);
        }
    }, [])

    return (
        <tr className="relative">
            {currentState === 'viewing' ? (
                <EditDeleteActions
                    onEditClickedHandler={onEditClickedHandler}
                    onDeleteClickedHandler={onDeleteClickedHandler}
                />
            ) : currentState === 'editing' || currentState === 'deleting' ? (
                <SaveCancelActions
                    onSaveClickedHandler={onSaveClickedHandler}
                    onCancelClickedHandler={onCancelClickedHandler}
                />
            ) : null}
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
            {currentState === 'deleting' &&
                <p className="absolute left-20 top-2 z-10 bg-white/95 px-2 rounded-2xl">
                    Are you sure you want to delete this row?
                </p>
            }
        </tr>
    );
};

const EntryItem = ({ entrySnapshot, dbKey, currentState, setEntryData, entryData }) => {
    const [displayText, setDisplayText] = useState('');
    const [editable, setEditable] = useState(true);

    // console.log(entryData)

    const BINARY_KEYS = ['noCaptures', 'isAlive', 'dead'];
    const TRUE_KEYS = ['Y', 'y', 'T','t'];
    const FALSE_KEYS = ['N', 'n', 'F', 'f'];

    useEffect(() => {
        setDisplayText(entrySnapshot.data()[dbKey]);
        if (dbKey === 'dateTime') {
            let tempDate = new Date(entrySnapshot.data()[dbKey]);
            setDisplayText(tempDate.toLocaleString());
            setEditable(false);
        }
    }, []);

    const onChangeHandler = (e) => {
        console.log(e.target.value)
        if (BINARY_KEYS.includes(dbKey)) {
            if (TRUE_KEYS.includes(e.target.value.slice(-1))) {
                setEntryData((prevEntryData) => ({
                    ...prevEntryData,
                    [dbKey]: 'true'
                }))
            } else if (FALSE_KEYS.includes(e.target.value.slice(-1))) {
                setEntryData((prevEntryData) => ({
                    ...prevEntryData,
                    [dbKey]: 'false'
                }))
            }
        } else {
            setEntryData((prevEntryData) => ({
                ...prevEntryData,
                [dbKey]: e.target.value,
            }));
        }
    }

    let disabled = false;

    if (
        currentState === 'viewing' || 
        (currentState === 'editing' && !editable) ||
        currentState === 'deleting'
    ) {
        disabled = true;
    }

    return (
        <td key={dbKey} className="text-center border-b border-gray-400 p-2">
            <input
                disabled={disabled}
                className="text-center transition disabled:bg-transparent outline-none rounded-lg"
                type="text"
                value={entryData[dbKey]}
                onChange={e => onChangeHandler(e)}
                size={entryData[dbKey].length || 1}
            />
        </td>
    );
};

const EditDeleteActions = ({ onEditClickedHandler, onDeleteClickedHandler }) => {
    return (
        <td className="border-b border-gray-400 p-2">
            <div className="flex flex-row w-full justify-around">
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
            </div>
        </td>
    );
};

const SaveCancelActions = ({ onSaveClickedHandler, onCancelClickedHandler }) => {
    return (
        <td className="border-b border-gray-400 p-2">
            <div className="flex flex-row w-full justify-around">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer"
                    onClick={() => onSaveClickedHandler()}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                    />
                </svg>
                <svg
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
            </div>
        </td>
    );
};
