import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { deleteMessageVariant, tableRows } from '../../const/animationVariants';
import { CheckIcon, DeleteIcon, EditIcon, XIcon } from '../../assets/icons';
import { usePagination } from '../../utils/usePagination';

export const TableEntry = ({ entrySnapshot, shownColumns, index }) => {
    const [currentState, setCurrentState] = useState('viewing');
    const [entryData, setEntryData] = useState(entrySnapshot.data());

    const { updateEntry, deleteEntry, getKeys, getLabel } = usePagination();

    const onSaveClickedHandler = () => {
        if (currentState === 'editing') {
            setCurrentState('viewing');
            updateEntry(entrySnapshot.id, entryData);
        } else if (currentState === 'deleting') {
            setCurrentState('viewing');
            deleteEntry(entrySnapshot.id);
        }
    };

    const filteredKeys = getKeys()?.filter(key => shownColumns.includes(getLabel(key)));

    const BINARY_KEYS = ['noCaptures', 'isAlive', 'dead'];
    const VALUE_MAP = { 'Y': 'true', 'y': 'true', 'T': 'true', 't': 'true', 'N': 'false', 'n': 'false', 'F': 'false', 'f': 'false' };

    const EntryItem = ({ dbKey }) => {
        const [displayText, setDisplayText] = useState(entrySnapshot.data()[dbKey]);
        const [editable, setEditable] = useState(dbKey !== 'dateTime');

        useEffect(() => {
            if (dbKey === 'dateTime') {
                setDisplayText(new Date(entrySnapshot.data()[dbKey]).toLocaleString());
                setEditable(false);
            }
        }, []);

        const onChangeHandler = (e) => {
            const value = e.target.value.slice(-1);
            setEntryData(prevEntryData => ({
                ...prevEntryData,
                [dbKey]: BINARY_KEYS.includes(dbKey) ? VALUE_MAP[value] ?? null : e.target.value,
            }));
        };

        const disabled = currentState !== 'editing' || !editable;

        const size = entrySnapshot.data()[dbKey]?.length ?? 1;

        return (
            <td key={dbKey} className="text-center border-b border-gray-400 p-2">
                <input
                    disabled={disabled}
                    className="text-center transition disabled:bg-transparent outline-none rounded-lg"
                    type="text"
                    value={dbKey === 'dateTime' ? displayText : entryData[dbKey] ?? 'N/A'}
                    onChange={onChangeHandler}
                    size={size}
                />
            </td>
        );
    };

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
                />
            ))}
        </motion.tr>
    );
};

const ActionIcon = ({ icon, onClickHandler }) => {
    return (
        <div className="w-5 h-5 hover:scale-125 transition hover:cursor-pointer" onClick={onClickHandler}>
            {icon}
        </div>
    );
};

const DeleteMessage = () => {
    return (
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
    );
};

const Actions = ({
    onEditClickedHandler,
    onDeleteClickedHandler,
    onSaveClickedHandler,
    onCancelClickedHandler,
    currentState,
}) => {
    const EditIconComponent = <ActionIcon icon={<EditIcon />} onClickHandler={onEditClickedHandler} />;
    const DeleteIconComponent = <ActionIcon icon={<DeleteIcon />} onClickHandler={onDeleteClickedHandler} />;
    const CheckIconComponent = <ActionIcon icon={<CheckIcon />} onClickHandler={onSaveClickedHandler} />;
    const XIconComponent = <ActionIcon icon={<XIcon />} onClickHandler={onCancelClickedHandler} />;

    return (
        <td className="border-b border-gray-400 p-2">
            <div className="flex flex-row w-full justify-around">
                <AnimatePresence>
                    {currentState === 'deleting' && <DeleteMessage />}
                    {currentState === 'viewing' && (
                        <>
                            {EditIconComponent}
                            {DeleteIconComponent}
                        </>
                    )}
                    {(currentState === 'editing' || currentState === 'deleting') && (
                        <>
                            {CheckIconComponent}
                            {XIconComponent}
                        </>
                    )}
                </AnimatePresence>
            </div>
        </td>
    );
};
