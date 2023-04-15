// TODO : add button for uploading session to firestore

import { FormField, ProjectField } from './FormFields';
import { TABLE_KEYS } from '../const/tableLabels';
import { useEffect } from 'react';

export default function NewSessionForm({ session, setField, project, setProject }) {
    useEffect(() => {
        // console.log(session)
    }, [session])
    return (
        <div className='flex-col p-4 space-y-1'>
            <div className='flex justify-between'>
                <h1 className='heading'>Add New Session</h1>
                <ProjectField
                    project={project}
                    setProject={setProject}
                />
            </div>
            <div className='grid grid-cols-2 space-x-2'>
                {TABLE_KEYS['Session'].map((key) => {
                    const colSpan = (key === 'dateTime' || key === 'commentsAboutTheArray') ? 'col-span-2' : 'col-span-1';
                    return (
                        <div key={key} className={colSpan}>
                            <FormField
                                fieldName={key}
                                value={session[key]}
                                setValue={(e) => setField(key, e)}
                                layout='vertical'
                                project={project}
                                site={session.site}
                            />
                        </div>

                    )
                })}
            </div>

        </div>
    )
}