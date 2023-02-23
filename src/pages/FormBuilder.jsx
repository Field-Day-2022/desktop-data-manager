import PageWrapper from './PageWrapper';
import { useState } from 'react';
import { useEffect } from 'react';

export default function FormBuilder() {
    const [activeCollection, setActiveCollection] = useState('AnswerSet');

    return (
        <PageWrapper>
            <div className="flex flex-col items-start">
                <h1 className="text-3xl text-left w-full px-6 py-2">Form Builder</h1>
                <div className="grid grid-cols-3 w-full">
                    <div>
                        <h2 className="text-2xl">Collection</h2>
                        <ReusableUnorderedList
                            listItemArray={['AnswerSet', 'DynamicForms']}
                            clickHandler={(listItem) => {
                                setActiveCollection(listItem);
                            }}
                            selectedItem={activeCollection}
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl">Document</h2>
                    </div>
                    <div>
                        <h2 className="text-2xl">Change</h2>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

const ReusableUnorderedList = ({ listItemArray, clickHandler, selectedItem }) => {
    return (
        <ul>
            {listItemArray.map((listItem) => (
                <ReusableListItem
                    key={listItem}
                    listItem={listItem}
                    clickHandler={clickHandler}
                    selectedItem={selectedItem}
                />
            ))}
        </ul>
    );
};

const ReusableListItem = ({ listItem, clickHandler, selectedItem }) => {
    return <li 
        onClick={() => clickHandler(listItem)}
        className={
            listItem === selectedItem ?
            'border-2 border-black m-2 p-2 text-xl hover:bg-blue-400 active:bg-blue-500 bg-blue-300 cursor-pointer'
            :
            'border-2 border-black m-2 p-2 text-xl hover:bg-blue-400 active:bg-blue-500 cursor-pointer'}
    >{listItem}</li>;
};
