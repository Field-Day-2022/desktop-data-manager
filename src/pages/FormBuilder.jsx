import PageWrapper from './PageWrapper';
import { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { notify, Type } from '../components/Notifier';

export default function FormBuilder() {
    const [activeCollection, setActiveCollection] = useState('');
    const [documents, setDocuments] = useState([]);
    const [activeDocument, setActiveDocument] = useState();
    const [documentData, setDocumentData] = useState([]);
    const [activeDocumentData, setActiveDocumentData] = useState();
    const [formData, setFormData] = useState();

    useEffect(() => {
        const getAllDocs = async () => {
            const querySnapshot = await getDocs(collection(db, activeCollection));
            let tempDocArray = [];
            querySnapshot.forEach((doc) => tempDocArray.push(doc));
            setDocuments(tempDocArray);
        };
        if (activeCollection) getAllDocs();
        else {
            setDocuments([]);
            setDocumentData([]);
        }
        setActiveDocument('');
        setActiveDocumentData('');
        setFormData('');
    }, [activeCollection]);

    useEffect(() => {
        if (activeDocument) {
            let tempDataArray = [];
            if (activeDocument.data().answers) {
                for (const answer of activeDocument.data().answers) {
                    tempDataArray.push(answer.primary);
                }
            }
            setDocumentData(tempDataArray);
        } else {
            setDocumentData([]);
        }
        setActiveDocumentData('');
        setFormData('');
    }, [activeDocument]);

    const pushChangesToFirestore = async (newData) => {
        await setDoc(doc(db, activeCollection, activeDocument.id), newData)
            .then(() => {
                notify(Type.success, 'Changes successfully written to database!');
            })
            .catch((e) => {
                notify(Type.error, `Error writing to database: ${e}`);
            });
        setActiveCollection('');
    };

    const submitChanges = () => {
        let tempDataObj = activeDocument.data();
        for (let i = 0; i < activeDocument.data().answers.length; i++) {
            if (activeDocument.data().answers[i].primary === activeDocumentData) {
                tempDataObj.answers[i] = formData;
            }
        }

        pushChangesToFirestore(tempDataObj);
    };

    const renderForm = () => {
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
                        submitChanges();
                    }}
                    className="border-gray-800 border-2 m-2 rounded text-xl py-1 px-4 w-min cursor-pointer hover:bg-blue-400 active:bg-blue-500"
                >
                    Submit
                </button>
            </form>
        );
    };

    return (
        <PageWrapper>
            <div className="flex flex-col items-start p-2">
                <h1 className="text-3xl text-left w-full px-6 py-2">Form Builder</h1>
                <div className="grid grid-cols-3 w-full gap-1">
                    <div className="border-gray-800 border-2 rounded">
                        <h2 className="text-2xl">Collection</h2>
                        <ReusableUnorderedList
                            listItemArray={['AnswerSet', 'DynamicForms']}
                            clickHandler={(listItem) => {
                                if (listItem === activeCollection) setActiveCollection('');
                                else setActiveCollection(listItem);
                            }}
                            selectedItem={activeCollection}
                        />
                    </div>
                    <div className="border-gray-800 border-2 h-[calc(100vh-12em)] rounded">
                        <h2 className="text-2xl">Document</h2>
                        <ReusableUnorderedList
                            listItemArray={documents}
                            clickHandler={(listItem) => {
                                if (listItem === activeDocument) setActiveDocument('');
                                else setActiveDocument(listItem);
                            }}
                            selectedItem={activeDocument}
                        />
                    </div>
                    <div className="grid grid-rows-2 border-gray-800 border-2 h-[calc(100vh-12em)] rounded">
                        <div className="border-gray-800 border-b-2 flex flex-col">
                            <h2 className="text-2xl">Data</h2>
                            <ReusableUnorderedList
                                listItemArray={documentData}
                                clickHandler={(listItem, index) => {
                                    if (listItem === activeDocumentData) {
                                        setActiveDocumentData('');
                                        setFormData('');
                                    } else {
                                        setActiveDocumentData(listItem);
                                        setFormData(activeDocument.data().answers[index]);
                                    }
                                }}
                                selectedItem={activeDocumentData}
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl">Change</h2>
                            {activeDocumentData && renderForm()}
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

const ReusableUnorderedList = ({ listItemArray, clickHandler, selectedItem }) => {
    return (
        <ul className="h-[calc(100%-2em)] overflow-y-auto">
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
    if (typeof listItem !== 'string') displayText = listItem.data().set_name;

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
