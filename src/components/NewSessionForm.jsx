import { FormField } from './FormFields';
import { TABLE_KEYS } from '../const/tableLabels';
import { useEffect } from 'react';


export default function NewSessionForm({ session, setField, project, setProject }) {
    useEffect(() => {
        console.log(session)
    }, [session])
    return (
        <div className='flex-col p-4 space-y-1'>
            <div className='flex justify-between'>
                <h1 className='heading'>Add New Session</h1>
                <FormField fieldName={'project'} value={project} setValue={setProject} layout='horizontal' />
            </div>
            <div className='grid grid-cols-2 space-x-2'>
                {TABLE_KEYS['Session'].map((key) => {
                    const colSpan = (key === 'dateTime' || key === 'commentsAboutTheArray') ? 'col-span-2' : 'col-span-1';
                    return (
                        <div className={colSpan}>
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