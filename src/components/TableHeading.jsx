import classNames from 'classnames';
import { useEffect } from 'react';
import { SortAscIcon, SortDescIcon } from "../assets/icons";

export const TableHeading = ({ label, active, sortDirection, onClick }) => {

    const getSortIcon = () => {
        if (active && sortDirection) {
          return sortDirection === "asc" ? <SortAscIcon /> : <SortDescIcon />;
        }
      };

    const thClasses = classNames(
        'sticky top-0 bg-white z-10 border-b border-neutral-800 p-2 text-gray-600 font-semibold cursor-pointer',
        { 'text-asu-maroon': active }
    );

    return (
        <th className={thClasses} onClick={onClick}>
            <div className="flex items-center justify-center">
                <span className="flex-1 mr-1 whitespace-nowrap">{label}</span>
                <span className="flex-4 text-xl">{getSortIcon()}</span>
            </div>
        </th>
    );
};