import { ArrowIcon } from "../assets/icons";

export const TableHeading = ({ label, active, sortDirection, onClick }) => {

    const getArrow = () => {
        if (active) {
            return <ArrowIcon className='w-4 h-4' direction={(sortDirection === 'asc')?'up':'down'}/>;
        }
    };

    const getLabel = () => {
        return (
            <div className="flex items-center justify-center">
                <span className="flex-1 mr-1">{label}</span>
                <span className="flex-4">{getArrow()}</span>
            </div>
        );
    };

    return (
        <th className="sticky top-0 bg-white z-10 border-b border-neutral-800 p-2 text-sm text-gray-600 font-semibold cursor-pointer"
            onClick={onClick}>
            {getLabel()}
        </th>
    );
};
