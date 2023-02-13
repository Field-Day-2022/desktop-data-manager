import { useEffect, useState } from 'react';
import { SESSION_KEYS, TURTLE_KEYS, LIZARD_KEYS, MAMMAL_KEYS, SNAKE_KEYS, ARTHROPOD_KEYS, AMPHIBIAN_KEYS } from '../const/keys'


export const TableEntry = ({ entrySnapshot, tableName }) => {
    const [currentState, setCurrentState] = useState('viewing');
    const [entryData, setEntryData] = useState(entrySnapshot.data());
    const [keys, setKeys] = useState();

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

    const BINARY_KEYS = ['noCaptures', 'isAlive', 'dead'];
    const TRUE_KEYS = ['Y', 'y', 'T', 't'];
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
