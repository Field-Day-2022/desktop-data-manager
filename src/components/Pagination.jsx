import { useState } from "react";
import Dropdown from "./Dropdown";

export const Pagination = ({
    batchSize,
    changeBatchSize,
    loadNextBatch,
    loadPrevBatch
}) => {
    const [batchSizeOptionsShown, setBatchSizeOptionsShown] = useState(false);

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
                <Dropdown
                    onClickHandler={(selectedOption) => onClickHandler(selectedOption.replace(' Rows', ''))}
                    options={['15 Rows', '50 Rows', '100 Rows']}
                />
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer hover:scale-125 transition active:scale-100"
                onClick={() => loadNextBatch()}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>

        </div>
    )
}