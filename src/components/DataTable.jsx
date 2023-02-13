import { TableEntry } from '../components/TableEntry';

export default function DataTable({ name, labels, entries }) {
    return (
        <div>
            <h1 className='heading pt-4 bg-white'>{name} - Entries</h1>
            <div className='overflow-auto w-full h-full-table'>
                <table className='w-full table-auto border-separate border-spacing-0'>
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