import { ArrowIcon } from "../assets/icons";

export const TableHeading = ({ label, active, sortDirection, onClick }) => {

    const getArrow = () => {
        if (active) {
            return <ArrowIcon direction={(sortDirection === 'asc')?'up':'down'}/>;
        }
    };

    const getLabel = () => {
        return (
            <div className="flex items-center">
                <span>{label}</span>
                {getArrow()}
            </div>
        );
    };

    return (
        <th className="sticky top-0 bg-white z-10 border-b border-neutral-800 p-2 text-sm text-gray-600 font-semibold"
            onClick={onClick}>
            {getLabel()}
        </th>
    );
};
