import PageWrapper from '../pages/PageWrapper';
import { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc, getDoc, addDoc, where, query, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { notify, Type } from '../components/Notifier';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

export default function FormBuilder({ triggerRerender }) {
    const [activeCollection, setActiveCollection] = useState(''); // current collection selected
    const [documents, setDocuments] = useState([]); // array of all documents with just their data
    const [documentSnapshots, setDocumentSnapshots] = useState([]); // array of all documents, as Firestore document objects
    const [activeDocument, setActiveDocument] = useState(); // current selected document, just its data
    const [activeDocumentIndex, setActiveDocumentIndex] = useState(-1); // index of current document out of all documents for easy access
    const [documentDataPrimaries, setDocumentDataPrimaries] = useState([]); // array of all primary keys for each document
    const [activeDocumentDataPrimary, setActiveDocumentDataPrimary] = useState(); // currently selected primary key
    const [formData, setFormData] = useState(); // form data
    const [changeBoxTitle, setChangeBoxTitle] = useState('Edit Data');
    const [editAllEntriesModal, setEditAllEntriesModal] = useState(false);


    useEffect(() => {
        const getAllDocs = async () => {
            let querySnapshot = null;
            if (activeCollection === 'AnswerSet') {
                querySnapshot = await getDocs(query(
                    collection(db, activeCollection),
                    orderBy('set_name', 'asc')
                ));
            } else {
                querySnapshot = await getDocs(query(
                    collection(db, activeCollection),
                ));
            }
            let tempDocArray = [];
            let tempDocSnapshotArray = [];
            querySnapshot.forEach((doc) => {
                tempDocArray.push(doc.data());
                tempDocSnapshotArray.push(doc);
            });
            setDocuments(tempDocArray);
            setDocumentSnapshots(tempDocSnapshotArray);
        };
        if (activeCollection) getAllDocs();
        else {
            setDocuments([]);
            setDocumentDataPrimaries([]);
        }
        setActiveDocument('');
        setActiveDocumentDataPrimary('');
        setFormData('');
        setActiveDocumentIndex(-1);
    }, [activeCollection]);

    useEffect(() => {
        if (activeDocument) {
            let tempDataArray = [];
            if (activeDocument.answers) {
                for (const answer of activeDocument.answers) {
                    tempDataArray.push(answer.primary);
                }
            }
            setDocumentDataPrimaries(tempDataArray);
        } else {
            setDocumentDataPrimaries([]);
        }
        setActiveDocumentDataPrimary('');
        setFormData('');
        setChangeBoxTitle('Edit Data')
    }, [activeDocument]);

    const pushChangesToFirestore = async () => {
        await setDoc(
            doc(db, activeCollection, documentSnapshots[activeDocumentIndex].id),
            documents[activeDocumentIndex]
        )
            .then(() => {
                notify(Type.success, 'Changes successfully written to database!');
                setChangeBoxTitle('Edit Data')
            })
            .catch((e) => {
                notify(Type.error, `Error writing to database: ${e}`);
            });
    };

    const andUpdateAllDocuments = async () => {
        const BATCH_WRITE_LIMIT = 500;
        const targetCollections = [];
        const setName = documents[activeDocumentIndex].set_name;
        let speciesName = '';

        if (!setName.includes('Species')) {
            notify(Type.error, 'This functionality is only supported when changing species');
            return;
        }

        if (setName.includes('Gateway')) { 
            targetCollections[0] = 'TestGatewayData'
            speciesName = setName.replace('Gateway', '').slice(0, -7);
        }
        else if (setName.includes('San Pedro')) {
            targetCollections[0] = 'TestSanPedroData'
            speciesName = setName.replace('San Pedro', '').slice(0, -7);
        }
        else if (setName.includes('Virgin River')) {
            targetCollections[0] = 'TestVirginRiverData';
            speciesName = setName.replace('Virgin River', '').slice(0, -7);
        } else {
            targetCollections.push(
                'TestGatewayData', 'TestSanPedroData', 'TestVirginRiverData');
            speciesName = setName.slice(0, -7);
        }

        let dataToUpdate = null;
        if (speciesName !== 'Arthropod') {
            dataToUpdate = {
                speciesCode: formData.primary,
                species: formData.secondary.Species,
                genus: formData.secondary.Genus
            }
        } 

        const documentsToUpdate = [];
        for (const targetCollection of targetCollections) {
            if (speciesName === 'Arthropod') {
                const querySnapshot = await getDocs(query(
                    collection(db, targetCollection),
                    where('taxa', '==', 'N/A'),
                    where('speciesCode', '==', 'N/A')
                ))
                documentsToUpdate.push(...querySnapshot.docs)
            } else {
                const querySnapshot = await getDocs(query(
                    collection(db, targetCollection),
                    where('taxa', '==', speciesName),
                    where('speciesCode', '==', activeDocumentDataPrimary)
                ))
                documentsToUpdate.push(...querySnapshot.docs)
            }
        }

        while (documentsToUpdate.length > 0) {
            const batch = new writeBatch(db);
            for (let i = 0; i < BATCH_WRITE_LIMIT; i++) {
                const documentToUpdate = documentsToUpdate.pop();
                if (documentToUpdate === undefined) break;
                if (speciesName !== 'Arthropod') {
                    batch.update(
                        doc(
                            db, 
                            documentToUpdate.ref.parent.id, 
                            documentToUpdate.id
                        ), dataToUpdate
                    )
                } else {
                    const speciesData = documentToUpdate.data()[activeDocumentDataPrimary.toLowerCase()];
                    let newDocumentDataToUpdate = structuredClone(documentToUpdate.data());
                    delete newDocumentDataToUpdate[activeDocumentDataPrimary.toLowerCase()]
                    newDocumentDataToUpdate[formData.primary.toLowerCase()] = speciesData;
                    batch.set(
                        doc(
                            db, 
                            documentToUpdate.ref.parent.id, 
                            documentToUpdate.id
                        ), newDocumentDataToUpdate
                    )
                }
            }
            await batch.commit();
        }
        notify(Type.success, 'Successfully changed corresponding entries!')
        triggerRerender()
        setEditAllEntriesModal(false);
    }

    const addDocToFirestore = async () => {
        if (activeCollection === 'AnswerSet') {
            const d = new Date();
            await addDoc(collection(db, activeCollection), {
                ...formData,
                date_modified: d.getTime(),
            })
                .then((doc) => {
                    notify(Type.success, 'New document successfully written to database!')
                    setChangeBoxTitle('Edit Data');
                    console.log(doc);
                    setDocumentSnapshots([...documentSnapshots, doc])
                })
                .catch((e) => {
                    notify(Type.error, `Error writing to database: ${e}`);
                });
        }
    }

    const updateUI = () => {
        let tempDataPrimaries = documentDataPrimaries;
        for (let i = 0; i < activeDocument.answers.length; i++) {
            if (activeDocument.answers[i].primary === activeDocumentDataPrimary) {
                documents[activeDocumentIndex].answers[i] = formData;
                tempDataPrimaries[i] = formData.primary;
            }
        }
        setDocumentDataPrimaries(tempDataPrimaries);
        setActiveDocumentDataPrimary(formData.primary);
    };

    const submitChanges = (
        options
    ) => {
        if (changeBoxTitle === 'Edit Data') {
            updateUI();
            pushChangesToFirestore();
            options === 'andUpdateAllDocuments' && andUpdateAllDocuments();
        } else if (changeBoxTitle === 'Add New Data') {
            activeDocument.answers.push(formData);
            documents[activeDocumentIndex] = activeDocument;
            setDocumentDataPrimaries([...documentDataPrimaries, formData.primary]);
            pushChangesToFirestore();
        } else if (changeBoxTitle === 'Add New Document') {
            setDocuments([...documents, formData])
            addDocToFirestore();
        }
    };

    const renderDataForm = () => {
        let output = [];
        if (activeCollection === 'AnswerSet') {
            output.push(
                <div key={'primaryForm'}>
                    <label key="primaryLabel" htmlFor="primary" className="text-xl">
                        Primary:{' '}
                    </label>

                    <input
                        key="primaryInput"
                        id="primary"
                        type="text"
                        className="border-gray-800 border-2 m-2 rounded text-xl p-1"
                        value={formData.primary}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                primary: e.target.value,
                            })
                        }
                    />
                </div>
            );
            if (formData.secondary) {
                for (const key in formData.secondary) {
                    output.push(
                        <div key={`${key}form`}>
                            <label key={`${key}label`} htmlFor={`${key}input`} className="text-xl">
                                {`${key}: `}
                            </label>
                            <input
                                key={`${key}input`}
                                id={`${key}input`}
                                type="text"
                                className="border-gray-800 border-2 m-2 rounded text-xl p-1"
                                value={formData.secondary[key]}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        secondary: {
                                            ...formData.secondary,
                                            [key]: e.target.value,
                                        },
                                    })
                                }
                            />
                        </div>
                    );
                }
            }
        }
        return (
            <form className="flex flex-col items-center">
                {output}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setEditAllEntriesModal(true)
                    }}
                    className="border-gray-800 border-2 m-2 rounded text-xl py-1 px-4 w-min cursor-pointer hover:bg-blue-400 active:bg-blue-500"
                >
                    Submit
                </button>
                <AnimatePresence>{
                    editAllEntriesModal && 
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: '10%'
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: .25
                            }
                        }}
                        exit={{
                            opacity: 0,
                            y: '-10%',
                            transition: {
                                duration: .25
                            }
                        }}
                        className='absolute inset-0 m-40 flex flex-col items-center justify-around p-4 bg-white border-2 border-black rounded'
                    >
                        <p className='text-4xl'>Where would you like to update this data?</p>
                        <button
                            className='text-xl p-4 hover:scale-105 transition hover:brightness-110'
                            onClick={(e) => {
                                e.preventDefault();
                                submitChanges()
                            }}
                        >Change just this collection</button>
                        <button
                            className='text-xl p-4 hover:scale-105 transition hover:brightness-110'
                            onClick={(e) => {
                                e.preventDefault();
                                submitChanges('andUpdateAllDocuments')
                            }}
                        >Change this collection and everywhere this data is used (expensive operation)</button>
                        <button
                            className='text-xl p-4 hover:scale-105 transition hover:brightness-110'
                            onClick={(e) => {
                                e.preventDefault();
                                setEditAllEntriesModal(false)
                            }}    
                        >
                            Cancel
                        </button>
                    </motion.div>
                }</AnimatePresence>
            </form>
        );
    };

    const addNewData = () => {
        setChangeBoxTitle('Add New Data');
        setActiveDocumentDataPrimary('');
        let formTemplate = {};
        if (activeCollection === 'AnswerSet') {
            formTemplate.primary = '';
            let keyArray = [];
            if (activeDocument.secondary_keys) {
                formTemplate.secondary = {}
                for (let i = 0; i < activeDocument.secondary_keys.length; i++) {
                    formTemplate.secondary[activeDocument.secondary_keys[i]] = '';
                    keyArray.push(activeDocument.secondary_keys[i])
                }
            }
        }
        setFormData(formTemplate);
    };

    const addNewDocument = () => {
        setChangeBoxTitle('Add New Document')
        if (activeCollection === 'AnswerSet') {
            setFormData({ set_name: '', secondary_keys: [], answers: [] })
        }
    }

    return (
        <div className="flex flex-col items-start p-2 text-center">
            <div className="grid grid-cols-3 w-full gap-1">
                <div className="border-gray-800 border-2 rounded">
                    <h2 className="text-2xl">Collection</h2>
                    <ReusableUnorderedList
                        listItemArray={['AnswerSet']}
                        clickHandler={(listItem) => {
                            if (listItem === activeCollection) setActiveCollection('');
                            else setActiveCollection(listItem);
                        }}
                        selectedItem={activeCollection}
                    />
                </div>
                <div className="border-gray-800 border-2 h-[calc(100vh-21em)] rounded">
                    <div className="flex justify-around items-center">
                        <h2 className="text-2xl">Document</h2>
                        {activeCollection && (
                            <AddNewButton
                                clickHandler={() => addNewDocument()}
                            />
                        )}
                    </div>
                    <ReusableUnorderedList
                        listItemArray={documents}
                        clickHandler={(listItem, index) => {
                            if (listItem === activeDocument) setActiveDocument('');
                            else {
                                setActiveDocument(listItem);
                                setActiveDocumentIndex(index);
                            }
                        }}
                        selectedItem={activeDocument}
                    />
                </div>
                <div className="grid grid-rows-2 border-gray-800 border-2 h-[calc(100vh-21em)] rounded">
                    <div className="border-gray-800 border-b-2 flex flex-col">
                        <div className="flex justify-around items-center">
                            <h2 className="text-2xl">Data</h2>
                            {activeDocument && (
                                <AddNewButton clickHandler={() => addNewData()} />
                            )}
                        </div>
                        <ReusableUnorderedList
                            listItemArray={documentDataPrimaries}
                            clickHandler={(listItem, index) => {
                                if (listItem === activeDocumentDataPrimary) {
                                    setActiveDocumentDataPrimary('');
                                    setFormData('');
                                } else {
                                    setActiveDocumentDataPrimary(listItem);
                                    setFormData(activeDocument.answers[index]);
                                    setChangeBoxTitle('Edit Data');
                                }
                            }}
                            selectedItem={activeDocumentDataPrimary}
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl">{changeBoxTitle}</h2>
                        {(activeDocumentDataPrimary || changeBoxTitle === 'Add New Data') &&
                            renderDataForm()}
                        {changeBoxTitle === 'Add New Document' &&
                            <NewDocumentForm
                                formData={formData}
                                setFormData={setFormData}
                                activeCollection={activeCollection}
                                submitChanges={submitChanges}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

const ReusableUnorderedList = ({ listItemArray, clickHandler, selectedItem }) => {
    return (
        <ul className="h-[calc(100%-4em)] overflow-y-auto">
            {listItemArray.map((listItem, index) => (
                <ReusableListItem
                    key={index}
                    listItem={listItem}
                    clickHandler={clickHandler}
                    selectedItem={selectedItem}
                    index={index}
                />
            ))}
        </ul>
    );
};

const ReusableListItem = ({ listItem, clickHandler, selectedItem, index }) => {
    let displayText = listItem;
    if (typeof listItem !== 'string') displayText = listItem.set_name;

    return (
        <li
            onClick={() => clickHandler(listItem, index)}
            className={
                listItem === selectedItem
                    ? 'border-2 border-black m-2 p-2 text-xl hover:bg-blue-400 active:bg-blue-500 bg-blue-300 cursor-pointer sticky top-0 rounded'
                    : 'border-2 border-black m-2 p-2 text-xl hover:bg-blue-400 active:bg-blue-500 cursor-pointer rounded'
            }
        >
            {displayText}
        </li>
    );
};

const AddNewButton = ({ clickHandler }) => {
    return (
        <motion.button
            layout
            onClick={() => clickHandler()}
            className="border-2 border-black m-2 p-2 text-xl hover:bg-blue-400 active:bg-blue-500  cursor-pointer rounded"
        >
            Add new
        </motion.button>
    );
};

const NewDocumentForm = ({
    formData,
    setFormData,
    activeCollection,
    submitChanges,
}) => {

    if (activeCollection === 'AnswerSet') {
        return (
            <form className='flex flex-col items-center h-[calc(100%-2em)] overflow-y-auto'>
                <div>
                    <label htmlFor='setName' className='text-xl'>Answer Set Name:</label>
                    <input
                        id='setName'
                        type='text'
                        className='border-gray-800 border-2 m-2 rounded text-xl p-1'
                        value={formData.set_name}
                        onChange={e => setFormData({ ...formData, set_name: e.target.value })}
                    />
                </div>
                {formData.secondary_keys.map((secondaryKey, index) => (
                    <div key={index} className='text-xl'>
                        <label>{`Secondary Key ${index + 1}: `}</label>
                        <input
                            type='text'
                            className='border-gray-800 border-2 m-2 rounded p-1'
                            value={secondaryKey}
                            onChange={e => {
                                const newKeys = formData.secondary_keys.map((key, i) => {
                                    return i === index ? e.target.value : key;
                                })
                                setFormData({ ...formData, secondary_keys: newKeys })
                            }}
                        />
                    </div>
                ))}
                <button
                    className="border-gray-800 border-2 m-2 rounded text-xl py-1 px-4 w-max cursor-pointer hover:bg-blue-400 active:bg-blue-500"
                    onClick={e => {
                        e.preventDefault();
                        let tempKeysArray = [...formData.secondary_keys];
                        tempKeysArray.push('')
                        setFormData({ ...formData, secondary_keys: tempKeysArray })
                    }}
                >Add Secondary Key</button>
                <button
                    onClick={e => {
                        e.preventDefault();
                        submitChanges();
                    }}
                    className="border-gray-800 border-2 m-2 rounded text-xl py-1 px-4 w-min cursor-pointer hover:bg-blue-400 active:bg-blue-500"
                >Submit</button>
            </form>
        )
    }
}