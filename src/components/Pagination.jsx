import { useState } from "react";

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