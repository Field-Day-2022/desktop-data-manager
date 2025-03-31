import { SortAscIcon, SortDescIcon } from '../assets/icons';
import '../styles/Table.css';
import React from 'react';

export const TableHeading = ({ label, active, sortDirection, onClick }) => {
    const getSortIcon = () => {
        if (active && sortDirection) {
            return sortDirection === 'asc' ? <SortAscIcon /> : <SortDescIcon />;
        }
    };

    return (
        <span className="flex items-center justify-start pl-2" onClick={onClick}>
            <span className="flex-1 mr-1 whitespace-nowrap">{label}</span>
            <span className="flex-4 text-xl ml-1">{getSortIcon()}</span>
        </span>
    );
};
