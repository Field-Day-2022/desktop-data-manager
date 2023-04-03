import { BiExport } from 'react-icons/bi';
import { MdViewColumn } from 'react-icons/md'
import { TableEntry } from '../components/TableEntry';
import { CSVLink } from "react-csv";
import Button from "./Button";

export default function DataTable({ name, labels, entries }) {
    let csvData = [];
	//check for labels
	if(labels) {
		let labelNum;
		let labelArray = [];
		for(labelNum = 0; labelNum < labels.length; labelNum++) {
			labelArray.push(labels[labelNum]);
		}
		csvData.push(labelArray);
		//check if table filled in
		const tableData = document.getElementById('data_table')
		if(tableData) {
			for(let row = 0; row < tableData.rows.length; row++) {
				let newRow = [];
				for(let cell = 0; cell < tableData.rows[row].cells.length; cell++) {
					newRow.push(tableData.rows[row].cells[cell].innerHTML);
				}
				csvData.push(newRow);
			}
		}
	}
	
    return (
        <div className='bg-white'>
            <div className='flex justify-between px-5 space-x-5 items-center'>
                <h1 className='heading pt-4'>{name} - Entries</h1>
                <div className='flex px-5 space-x-5 items-center'>
                    <input className='border-b border-neutral-800 p-2' type="text" name="search" />
                    <MdViewColumn className='text-2xl' />
					<CSVLink data={csvData} filename={name}>
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