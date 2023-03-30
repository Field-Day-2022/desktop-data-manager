import { useAtom } from "jotai";
import { ArrowIcon } from "../assets/icons";
import { currentBatchSize } from "../utils/jotai";
import Dropdown from "./Dropdown";
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
                <Dropdown
                    onClickHandler={(selectedOption) => setBatchSize(selectedOption.replace(' Rows', ''))}
                    options={['15 Rows', '50 Rows', '100 Rows']}
                    value={`${batchSize} Rows`}
                />
            </div>

            <div
                className="w-6 h-6 cursor-pointer hover:scale-125 transition active:scale-100"
                onClick={async () => {
                    if(await loadNextBatch() === false) notify(Type.error, 'No more data to load')
                }}>
                <ArrowIcon direction='right' />
            </div>
        </div>
    )
}