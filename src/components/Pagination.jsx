import { useAtom } from "jotai";
import { LeftArrowIcon, RightArrowIcon } from "../assets/icons";
import { currentBatchSize } from "../utils/jotai";
import Dropdown from "./Dropdown";

export const Pagination = ({
    loadNextBatch,
    loadPrevBatch
}) => {
    const [batchSize, setBatchSize] = useAtom(currentBatchSize);
    const onClickHandler = (size) => {
        setBatchSize(size)
    }

    return (
        <div className="w-full p-2 flex justify-end items-center">
            <div
                className="w-6 h-6 cursor-pointer hover:scale-125 transition active:scale-100"
                onClick={() => loadPrevBatch()}>
                <LeftArrowIcon />
            </div>

            <div className='relative p-2'>
                <Dropdown
                    onClickHandler={(selectedOption) => onClickHandler(selectedOption.replace(' Rows', ''))}
                    options={['15 Rows', '50 Rows', '100 Rows']}
                />
            </div>

            <div
                className="w-6 h-6 cursor-pointer hover:scale-125 transition active:scale-100"
                onClick={() => loadNextBatch()}>
                <RightArrowIcon />
            </div>
        </div>
    )
}