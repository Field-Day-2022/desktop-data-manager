import { useAtom } from "jotai";
import { ArrowIcon } from "../assets/icons";
import { currentBatchSize } from "../utils/jotai";
import { notify, Type } from "./Notifier";

export const Pagination = ({
    loadNextBatch,
    loadPrevBatch
}) => {
    const [batchSize, setBatchSize] = useAtom(currentBatchSize);

    return (
        <div className="w-full p-2 flex justify-end items-center">
            <div
                className="w-6 h-6 cursor-pointer hover:scale-125 transition active:scale-100"
                onClick={async () => {
                    if (await loadPrevBatch() === false) notify(Type.error, 'No more data to load')
                }
                }>
                <ArrowIcon direction='left' />
            </div>

            <div className='relative p-2'>
                <select
                    onChange={
                        (e) => setBatchSize(e.target.value.replace(' Rows', ''))
                    }
                    value={`${batchSize} Rows`}>
                    <option>15 Rows</option>
                    <option>50 Rows</option>
                    <option>100 Rows</option>
                </select>
            </div>

            <div
                className="w-6 h-6 cursor-pointer hover:scale-125 transition active:scale-100"
                onClick={async () => {
                    if (await loadNextBatch() === false) notify(Type.error, 'No more data to load')
                }}>
                <ArrowIcon direction='right' />
            </div>
        </div>
    )
}