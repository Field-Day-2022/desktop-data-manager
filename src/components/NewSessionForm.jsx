import InputField from './InputField'
import Dropdown from './Dropdown'
import { useEffect } from 'react'
import { getArraysForSite, getSitesForProject, getTrapStatuses } from '../utils/firestore'
import { useState } from 'react';

export default function NewSessionForm({ session, setField, project, setProject }) {

    const [siteOptions, setSiteOptions] = useState([]);
    const [arrayOptions, setArrayOptions] = useState([]);
    const [trapStatusOptions, setTrapStatusOptions] = useState([]);

    const NoCapturesField = () => {
        return (
            <div className='flex flex-col'>
                <label className='text-sm w-full text-left p-2'>No Captures:</label>
                <div className='flex'>
                    <div className='flex'>
                        <label className='text-sm w-full text-left p-2'>True</label>
                        <input type='radio' name='noCaptures' value='true' checked={session.noCaptures === 'true'} onChange={(e) => setField('noCaptures', e.target.value)} />
                    </div>
                    <div className='flex'>
                        <label className='text-sm w-full text-left p-2'>False</label>
                        <input type='radio' name='noCaptures' value='false' checked={session.noCaptures === 'false'} onChange={(e) => setField('noCaptures', e.target.value)} />
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        getSitesForProject(project).then((sites) => {
            setSiteOptions(sites);
            setField('site', sites[0]);
        });
    }, [project])

    useEffect(() => {
        getArraysForSite(project, session.site).then((arrays) => {
            setArrayOptions(arrays);
            setField('array', arrays[0]);
        });
    }, [session.site])

    useEffect(() => {
        getTrapStatuses().then((statuses) => {
            setTrapStatusOptions(statuses);
            setField('trapStatus', statuses[0]);
        })
    }, [])

    return (
        <div className='flex-col p-4 space-y-1'>
            <div className='flex justify-between'>
                <h1 className='heading'>Add New Session</h1>
                <Dropdown
                    label='Project'
                    value={project}
                    onClickHandler={setProject}
                    options={['Gateway', 'San Pedro', 'Virgin River']}
                />
            </div>
            <div className='flex space-x-2'>
                <InputField type='date' label='Date' layout='vertical' onChange={(e) => setField('date', e.target.value)} />
                <InputField type='time' label='Time' layout='vertical' onChange={(e) => setField('time', e.target.value)} />
            </div>
            <div className='grid grid-cols-2 space-x-2'>
                <InputField
                    type='text'
                    maxLength={3}
                    label='Recorder'
                    value={session.recorder}
                    onChange={(e) => {
                        if (e.target.value.length === 0 || e.target.value.match(/^[a-zA-Z]+$/))
                            setField('recorder', (e.target.value.toString().toUpperCase()))
                    }}
                    layout='vertical' />
                <InputField
                    type='text'
                    maxLength={3}
                    label='Handler'
                    value={session.handler}
                    onChange={(e) => {
                        if (e.target.value.length === 0 || e.target.value.match(/^[a-zA-Z]+$/))
                            setField('handler', (e.target.value.toString().toUpperCase()))
                    }}
                    layout='vertical' />
                <Dropdown
                    className={'w-1/2'}
                    label='Site'
                    layout='vertical'
                    value={session.site}
                    onClickHandler={(e) => {
                        setField('site', e);
                    }}
                    options={siteOptions} />
                <Dropdown
                    className={'w-1/2'}
                    label='Array'
                    layout='vertical'
                    value={session.array}
                    onClickHandler={(e) => {
                        setField('array', e);
                    }}
                    options={arrayOptions} />
                <NoCapturesField />
                <Dropdown
                    className={'w-1/2'}
                    label='Trap Status'
                    layout='vertical'
                    value={session.trapStatus}
                    onClickHandler={(e) => {
                        setField('trapStatus', e);
                    }}
                    options={trapStatusOptions} />
                <div className='flex flex-col col-span-2'>
                    <label className='text-sm w-full text-left p-2'>Comments:</label>
                    <textarea className='resize-none border border-gray-300 rounded-md p-2 col-span-2 max-w-full' placeholder='Comments' onChange={(e) => setField('commentsAboutTheArray', e.target.value)} />
                </div>

            </div>

        </div>
    )
}