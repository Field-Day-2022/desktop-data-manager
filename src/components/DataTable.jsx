import { BiExport } from 'react-icons/bi';
import { MdViewColumn } from 'react-icons/md'
import { TableEntry } from '../components/TableEntry';
import { CSVLink } from "react-csv";
import Button from "./Button";

export default function DataTable({ name, labels, entries }) {
    const csvData = [
        ["val1", "val2", "val3"],
    ];
    return (
        <div className='bg-white'>
            <div className='flex justify-between px-5 space-x-5 items-center'>
                <h1 className='heading pt-4'>{name} - Entries</h1>
                <CSVLink data={csvData}>
                <div className='flex px-5 space-x-5 items-center'>
                    <input className='border-b border-neutral-800 p-2' type="text" name="search" />
                    <MdViewColumn className='text-2xl' />
                    <Button
                        enabled={true}
                        icon={<BiExport className='export' />}
                    />
                </div>
                </CSVLink>
            </div>

            <div className='overflow-auto w-full h-full-table'>
                <table className='w-full table-auto border-separate border-spacing-0' data={csvData}>
                    <thead>
                        <tr>
                            <TableHeading label="Actions" />
                            {labels && labels.map((label) => <TableHeading key={label} label={label} />)}
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry) => (
                            <TableEntry key={entry.id} entrySnapshot={entry} tableName={name} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}

const TableHeading = ({ label }) => {
    return <th className="sticky top-0 bg-white z-10 border-b border-neutral-800 p-2 text-sm text-gray-600 font-semibold">{label}</th>;
};