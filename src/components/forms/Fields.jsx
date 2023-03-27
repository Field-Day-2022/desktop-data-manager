import Dropdown from "../Dropdown"
import Input from "../Input"
import { sites } from "../../const/projects"
import { useState } from "react"

const SearchField = ({ setField }) => {
    return (
        <Input
            type="search"
            placeholder='Search'
            onChange={(e) => setField(e.target.value)}
        />
    )
}

const DateField = ({ setField }) => {
    return (
        <div className='flex-col p-2'>
            <div className='text-sm'>Date:</div>
            <Input type='date' onChange={(e) => setField('date', e.target.value)} />
        </div>
    )
}

const TimeField = ({ setField }) => {
    return (
        <div className='flex-col p-2'>
            <div className='text-sm'>Time:</div>
            <Input type='time' onChange={(e) => setField('time', e.target.value)} />
        </div>
    )
}

const RecorderField = ({ setField }) => {
    return (
        <div className='flex-col p-2'>
            <div className='text-sm'>Recorder:</div>
            <Input placeholder='Recorder' maxLength={3} onChange={(e) => setField('recorder', e.target.value)} />
        </div>
    )
}

const HandlerField = ({ setField }) => {
    return (
        <div className='flex-col p-2'>
            <div className='text-sm'>Handler:</div>
            <Input placeholder='Handler' maxLength={3} onChange={(e) => setField('handler', e.target.value)} />
        </div>
    )
}

const ProjectField = ({ project, setProject }) => {
    return (
        <div className='flex items-center space-x-2'>
            <div className='text-sm'>Project:</div>
            <Dropdown
                options={['Gateway', 'SanPedro', 'VirginRiver']}
                value={project}
                onClickHandler={(option) => {
                    setProject(option)
                }}
            />
        </div>
    )
}

const SiteField = ({ project, site, setField }) => {
    return (
        <div className='flex-col p-2'>
            <div className='text-sm'>Site:</div>
            <Dropdown
                options={sites[project]}
                value={site}
                onClickHandler={(e) => setField('site', e)}
            />
        </div>
    )
}

const ArrayField = ({ setField }) => {
    return (
        <div className='flex-col p-2'>
            <div className='text-sm'>Array:</div>
            <Input placeholder='Array' onChange={(e) => setField('array', e.target.value)} />
        </div>
    )
}

const NoCapturesField = ({ setField }) => {
    return (
        <div className='flex-col p-2'>
            <div className='text-sm'>Captures:</div>
            <div className='flex space-x-2 accent-asu-maroon'>
                <input type='radio' name='captures' value='yes' onChange={() => setField('noCaptures', false)} />
                <label>Yes</label>
                <input type='radio' name='captures' value='no' onChange={() => setField('noCaptures', true)} />
                <label>No</label>
            </div>
        </div>
    )
}

const TrapStatusField = ({ setField }) => {
    return (
        <div className='flex-col p-2'>
            <div className='text-sm'>Trap Status:</div>
            <Dropdown
                options={['OPEN', 'CLOSED', 'CHECKED & CLOSED']}
                value={'OPEN'}
                onClickHandler={(e) => setField('trapStatus', e)}
            />
        </div>
    )
}

const CommentsField = ({ setField }) => {
    return (
        <div className="flex-col p-2">
            <div className="text-sm font-medium">Comments:</div>
            <textarea className="p-2 mt-1 block w-full rounded-lg border border-neutral-200 resize-none h-24" onChange={(e) => setField('commentsAboutTheArray', e.target.value)} />
        </div>
    );
};

const YearField = ({ setField }) => {

    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const years = [];
    const oldestYear = 1969

    for (let i = currentYear; i >= oldestYear; i--) {
        years.push(i)
    }

    return (
        <div className='flex-col p-2'>
            <div className='text-sm'>Year:</div>
            <Dropdown
                options={years}
                value={selectedYear}
                onClickHandler={(e) => {
                    setSelectedYear(e)
                }}
            />
        </div>
    )
}

export { DateField, TimeField, RecorderField, HandlerField, ProjectField, SiteField, ArrayField, NoCapturesField, TrapStatusField, CommentsField, SearchField, YearField }