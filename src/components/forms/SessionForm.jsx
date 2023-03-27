import {
    ProjectField,
    DateField,
    TimeField,
    RecorderField,
    HandlerField,
    SiteField,
    ArrayField,
    NoCapturesField,
    TrapStatusField,
    CommentsField
} from "./Fields"

export default function SessionForm({ session, setField }) {
    return (
        <div className='flex-co p-4'>
            <div className='flex justify-between'>
                <h1 className='heading'>Add New Session</h1>
                <ProjectField setField={setField} />
            </div>
            <div className='flex'>
                <DateField setField={setField} />
                <TimeField setField={setField} />
            </div>
            <div className='grid grid-cols-2'>
                <RecorderField setField={setField} />
                <HandlerField setField={setField} />
                <SiteField data={session} setField={setField} />
                <ArrayField setField={setField} />
                <NoCapturesField setField={setField} />
                <TrapStatusField setField={setField} />
                <CommentsField setField={setField} />
            </div>
        </div>
    )
}