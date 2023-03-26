import { useEffect } from "react";
import { useState } from "react";
import Dropdown from "../components/Dropdown"
import TextInput from "../components/TextInput"
import { sites } from "../const/projects"

export default function NewSessionTool({ setData }) {

    const [sessionData, setSessionData] = useState({
        project: 'Gateway',
        date: '',
        time: '',
        dateTime: '',
        recorder: '',
        handler: '',
        site: 'GWA1',
        array: '',
        noCaptures: '',
        trapStatus: 'OPEN',
        commentsAboutTheArray: '',
        year: '',
    });

    const setField = (field, value) => {
        setSessionData({
            ...sessionData,
            [field]: value
        });
    }

    const setTime = (time) => {
        setSessionData({
            ...sessionData,
            time: time,
            dateTime: sessionData.date + ' ' + time
        })
    }

    const setDate = (date) => {
        setSessionData({
            ...sessionData,
            date: date,
            dateTime: date + ' ' + sessionData.time,
            year: date.split('-')[0]
        })
    }

    useEffect(() => {
        setData(sessionData);
    }, [sessionData]);

    const dateField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Date:</div>
                <input type='date' className='input' onChange={(e) => {
                    setDate(e.target.value)
                }} />
            </div>
        )
    }

    const timeField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Time:</div>
                <input type='time' className='input' onChange={(e) => {
                    setTime(e.target.value)
                }} />
            </div>
        )
    }

    const recorderField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Recorder:</div>
                <TextInput placeholder='Recorder' maxLength={3} onChange={(e) => setField('recorder', e.target.value)} />
            </div>
        )
    }

    const handlerField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Handler:</div>
                <TextInput placeholder='Handler' maxLength={3} onChange={(e) => setField('handler', e.target.value)} />
            </div>
        )
    }

    const projectField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Project:</div>
                <Dropdown
                    options={['Gateway', 'SanPedro', 'VirginRiver']}
                    value={sessionData.project}
                    onClickHandler={(option) => setField('project', option)}
                />
            </div>
        )
    }

    const siteField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Site:</div>
                <Dropdown
                    options={sites[sessionData.project]}
                    value={sessionData.site}
                    onClickHandler={(e) => setField('site', e)}
                />
            </div>
        )
    }

    const arrayField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Array:</div>
                <TextInput placeholder='Array' onChange={(e) => setField('array', e.target.value)} />
            </div>
        )
    }

    const noCapturesField = () => {
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

    const trapStatusField = () => {
        return (
            <div className='flex-col p-2'>
                <div className='text-sm'>Trap Status:</div>
                <Dropdown
                    options={['OPEN', 'CLOSED', 'CHECKED & CLOSED']}
                    value={sessionData.trapStatus}
                    onClickHandler={(e) => setField('trapStatus', e)}
                />
            </div>
        )
    }

    const commentsField = () => {
        return (
            <div className="flex-col p-2">
                <div className="text-sm font-medium">Comments:</div>
                <textarea className="p-2 mt-1 block w-full rounded-lg border border-neutral-200 resize-none h-24" onChange={(e) => setField('commentsAboutTheArray', e.target.value)} />
            </div>
        );
    };

    return (
        <div className='flex-co p-4'>
            <div className='flex justify-between'>
                <h1 className='heading'>Add New Session</h1>
                {projectField()}
            </div>
            <div className='flex'>
                {dateField()}
                {timeField()}
            </div>
            <div className='grid grid-cols-2'>
                {recorderField()}
                {handlerField()}
                {siteField()}
                {arrayField()}
                {noCapturesField()}
                {trapStatusField()}
                {commentsField()}
            </div>
        </div>
    );
}