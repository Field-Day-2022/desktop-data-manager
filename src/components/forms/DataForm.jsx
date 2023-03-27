import { YearField } from './Fields.jsx'

export default function DataForm() {
    return (
        <div className='flex-col p-4'>
            <h1 className='heading'>Add New Critter Data</h1>
            <h2>Choose a session:</h2>
            <div className='flex'>
                <YearField />
            </div>
        </div>
    )
}