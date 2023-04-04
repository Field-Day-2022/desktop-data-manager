import { BiExport } from 'react-icons/bi';
import { MdViewColumn } from 'react-icons/md'
import { TableEntry } from '../components/TableEntry';
import { CSVLink } from "react-csv";
import Button from "./Button";

const generateCSV = (labels, entries) => {
    // Check that labels and entries exist first
    if (!labels || !entries) {
        return [];
    }
    let headings = labels.slice(1);
    let csvData = [];
    // push row of labels, excluding the actions column
    csvData.push(headings);
    // push each row of data 
    entries.forEach((entry) => {
        let row = [];
        headings.forEach((label) => {
            if (label !== 'Actions') {
                // convert each label to camelcase and remove spaces
                label = label.replace(/\s+/g, '');
                label = label.charAt(0).toLowerCase() + label.slice(1);
                console.log(entry.data())
                row.push(entry.data()[label]);
            }
        });
        csvData.push(row);
    });
    return csvData;
};

export default function DataTable({ name, labels, entries }) {
    let csvData = generateCSV(labels, entries);

    return (
        <div className='bg-white'>
            <div className='flex justify-between px-5 space-x-5 items-center'>
                <h1 className='heading pt-4'>{name} - Entries</h1>
                <div className='flex px-5 space-x-5 items-center'>
                    <input className='border-b border-neutral-800 p-2' type="text" name="search" />
                    <MdViewColumn className='text-2xl' />
                    <CSVLink
                        data={csvData}
                        filename={name}
                        onClick={() => {
                            console.log(csvData);
                        }}
                    >
                        <Button
                            enabled={true}
                            icon={<BiExport className='export' />}
                        />
                    </CSVLink>
                </div>
            </div>

            <div className='overflow-auto w-full h-full-table'>
                <table className='w-full table-auto border-separate border-spacing-0' id='data_table'>
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