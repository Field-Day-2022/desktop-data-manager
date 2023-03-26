import { useEffect } from "react";
import { useState } from "react";
import Dropdown from "../components/Dropdown"
import TextInput from "../components/TextInput"

export default function NewSessionTool({setData}) {

    const [sessionData, setSessionData] = useState({
        date: '',
        time: '',
        recorder: '',
        handler: '',
        site: '',
        array: '',
        captures: '',
        trapStatus: '',
        comments: '',
    });

    const setField = (field, value) => {
        setSessionData({
            ...sessionData,
            [field]: value,
        });
    };

    useEffect(() => {
        setData(sessionData);
    }, [sessionData]);

    //function that returns a field for entering a date
    const dateField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Date:</div>
                <input type='date' className='input' onChange={(e) => setField('date', e.target.value)} />
            </div>
        )
    }

    //Function that returns a field for entering a time
    const timeField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Time:</div>
                <input type='time' className='input' onChange={(e) => setField('time', e.target.value)} />
            </div>
        )
    }

    // Function that returns a field for entering a recorder
    const recorderField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Recorder:</div>
                <TextInput placeholder='Recorder' maxLength={3} onChange={(e) => setField('recorder', e.target.value)} />
            </div>
        )
    }

    // Function that returns a field for entering a handler
    const handlerField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Handler:</div>
                <TextInput placeholder='Handler' maxLength={3} onChange={(e) => setField('handler', e.target.value)} />
            </div>
        )
    }

    // Function that returns a field for entering a site
    const siteField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Site:</div>
                <TextInput placeholder='Site' onChange={(e) => setField('site', e.target.value)} />
            </div>
        )
    }

    // Function that returns a field for entering an array
    const arrayField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Array:</div>
                <TextInput placeholder='Array' onChange={(e) => setField('array', e.target.value)} />
            </div>
        )
    }

    // Function that returns two radio buttons to indicated whether there were captures
    const capturesField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Captures:</div>
                <div className='flex space-x-2 accent-asu-maroon'>

                    <input type='radio' name='captures' value='yes' onChange={(e) => setField('captures', e.target.value)} />
                    <label>Yes</label>

                    <input type='radio' name='captures' value='no' onChange={(e) => setField('captures', e.target.value)} />
                    <label>No</label>
                </div>
            </div>
        )
    }

    // Function that returns a dropdown with the options, 'OPEN', 'CLOSED', and 'CHECKED & CLOSED' to indicate trap status
    const trapStatusField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Trap Status:</div>
                <Dropdown
                    options={['OPEN', 'CLOSED', 'CHECKED & CLOSED']}
                    value={'OPEN'}
                    onClickHandler={(e) => setField('trapStatus', e.target.value)}
                />
            </div>
        )
    }

    // Function that returns a field to enter comments
    const commentsField = () => {
        return (
            <div className="flex-col p-2">
                <div className="text-sm font-medium">Comments:</div>
                <textarea className="p-2 mt-1 block w-full rounded-lg border border-neutral-200 resize-none h-24" onChange={(e) => setField('comments', e.target.value) } />
            </div>
        );
    };


    return (
        <div className='flex-co p-4'>
            <h1 className='heading'>Add New Session</h1>
            <div className='flex'>
                {dateField()}
                {timeField()}
            </div>
            <div className='grid grid-cols-2'>
                {recorderField()}
                {handlerField()}
                {siteField()}
                {arrayField()}
                {capturesField()}
                {trapStatusField()}
                {commentsField()}
            </div>
        </div>
    );
}