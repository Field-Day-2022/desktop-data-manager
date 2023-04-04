import InputField from './InputField'
import Dropdown from './Dropdown'

export default function SessionForm({ session, setField, project, setProject }) {

    // Radio buttons to select No Captures:
    const NoCapturesField = () => {
        return (
            <div className='flex flex-col'>
                <label className='text-sm w-full text-left p-2'>No Captures:</label>
                <div className='flex'>
                    <div className='flex'>
                        <label className='text-sm w-full text-left p-2'>Yes</label>
                        <input type='radio' name='noCaptures' value='yes' />
                    </div>
                    <div className='flex'>
                        <label className='text-sm w-full text-left p-2'>No</label>
                        <input type='radio' name='noCaptures' value='no' />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-col p-4 space-y-1'>
            <div className='flex justify-between'>
                <h1 className='heading'>Add New Session</h1>
                <Dropdown
                    label='Project'
                    options={['Gateway', 'SanPedro', 'VirginRiver']}
                />
            </div>
            <div className='flex space-x-2'>
                <InputField type='date' label='Date' layout='vertical' />
                <InputField type='time' label='Time' layout='vertical' />
            </div>
            <div className='grid grid-cols-2 space-x-2'>
                <InputField type='text' label='Recorder' layout='vertical' />
                <InputField type='text' label='Handler' layout='vertical' />
                <Dropdown label='Site' layout='vertical' options={[]} />
                <Dropdown label='Array' layout='vertical' options={[]} />
                <NoCapturesField />
                <Dropdown label='Trap Status' layout='vertical' options={['OPEN', 'CHECKED', 'CHECKED & CLOSED']} />
                <textarea className='m-2 col-span-2 border border-gray-300 rounded-md p-2 w-full' placeholder='Comments' />
            </div>

        </div>
    )
}