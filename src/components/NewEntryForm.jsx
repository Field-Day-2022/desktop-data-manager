import { useState } from "react";
import { getSessionsByProjectAndYear } from "../utils/firestore";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { appMode } from "../utils/jotai";
import TabBar from "./TabBar";
import { AmphibianIcon, ArthropodIcon, LizardIcon, MammalIcon, SnakeIcon, TurtleIcon } from "../assets/icons";
import { TABLE_KEYS } from "../const/tableLabels";
import { FormField, ProjectField, YearField } from "./FormFields";
import InputLabel from "./InputLabel";

export default function NewEntryForm() {
    const environment = useAtomValue(appMode);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
    const [project, setProject] = useState('Gateway');
    const [year, setYear] = useState();
    const [selectedCritter, setSelectedCritter] = useState('Turtle');

    const sessionIndexMap = sessions.map((session, index) => index);

    useEffect(() => {
        getSessionsByProjectAndYear(environment, project.replace(/\s/g, ''), year).then((sessions) => {
            if (sessions.length > 0) {
                setSessions(sessions);
                setSelectedSessionIndex(0);
            } else {
                setSessions([]);
                setSelectedSessionIndex(null);
            }
        })
    }, [project, year])

    const activeSessions = sessions.map((session) => {
        const date = new Date(session.data().dateTime);
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${month} ${day}, ${year} ${time}`;
    });

    const selectedSession = sessions[selectedSessionIndex]?.data() || {
        dateTime: 'Default',
        recorder: '',
        handler: '',
        site: '',
        array: '',
        commentsAboutTheArray: '',
    };

    const critterTabs = [
        { text: 'Turtle', icon: <TurtleIcon /> },
        { text: 'Lizard', icon: <LizardIcon className={'h-6'} /> },
        { text: 'Arthropod', icon: <ArthropodIcon /> },
        { text: 'Amphibian', icon: <AmphibianIcon /> },
        { text: 'Mammal', icon: <MammalIcon /> },
        { text: 'Snake', icon: <SnakeIcon /> },
    ]


    return (
        <div className='flex-col space-y-1 h-tab-modal-content'>
            <div className="p-4">
                <div className='flex justify-between'>
                    <h1 className='heading'>Add New Critter Entry</h1>
                    <ProjectField
                        project={project}
                        setProject={setProject}
                    />
                </div>
                <div className='grid grid-cols-2'>
                    <YearField
                        year={year}
                        setYear={setYear}
                        layout='vertical'
                    />
                    <InputLabel
                        label='Session'
                        layout='vertical'
                        input={
                            <select
                                disabled={sessions.length === 0}
                                value={activeSessions[selectedSessionIndex] || 'No sessions found.'}
                                onChange={(e) => {
                                    setSelectedSessionIndex(sessionIndexMap[activeSessions.indexOf(e.target.value)])
                                }}
                            >
                                {activeSessions.map((session) => (
                                    <option value={session}>{session}</option>
                                ))}
                            </select>
                        }
                    />
                </div>
                <SessionSummary session={selectedSession} />
            </div>
            <div className="bg-white">
                <h1 className='heading p-4'>Choose a Critter</h1>
                <div className="overflow-x-auto">
                    <TabBar
                        tabs={critterTabs.map((tab) => ({
                            ...tab,
                            active: tab.text === selectedCritter,
                            onClick: () => setSelectedCritter(tab.text),
                        }))}
                    />
                </div>

            </div>
            <div className='p-4'>
                <CritterForm critter={selectedCritter} project={project} session={selectedSession} />
            </div>

        </div>
    )
}

const CritterForm = ({ critter, project, session }) => {
    const [entry, setEntry] = useState({});

    useEffect(() => {
        setEntry({
            ...TABLE_KEYS[critter].reduce((acc, key) => {
                acc[key] = session[key] || '';
                return acc;
            }, {})
        })
    }, [session, critter])
    
    useEffect(() => {
        console.log(entry);
    }, [entry])

    const setField = (key, value) => {
        setEntry({
            ...entry,
            [key]: value,
        })
    }

    return (
        <div className='flex-col space-y-1'>
            <div className='grid grid-cols-3'>
                {TABLE_KEYS[critter].map((key) => {
                    const disabled = session[key]
                    return (
                        <FormField
                            disabled={disabled}
                            fieldName={key}
                            layout='vertical'
                            value={entry[key]}
                            setValue={(e) => { 
                                setField(key, e)
                            }}
                            project={project}
                            site={session.site}
                            taxa={critter}
                        />
                    )
                })
                }
            </div>
        </div>
    )
}

const SessionSummary = ({ session }) => {
    const date = new Date(session.dateTime);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = `${month} ${day}, ${year} ${time}`;
    return (
        <div className='flex-col space-y-1'>
            <h1 className='heading'>Session Summary</h1>
            <div className='flex justify-between'>
                <p>Date Time</p>
                <p>{formattedDate}</p>
            </div>
            <div className='flex justify-between'>
                <p>Recorder</p>
                <p>{session.recorder}</p>
            </div>
            <div className='flex justify-between'>
                <p>Handler</p>
                <p>{session.handler}</p>
            </div>
            <div className='flex justify-between'>
                <p>Site</p>
                <p>{session.site}</p>
            </div>
            <div className='flex justify-between'>
                <p>Array</p>
                <p>{session.array}</p>
            </div>
            <div className='flex justify-between'>
                <p>No Captures</p>
                <p>{session.noCaptures}</p>
            </div>
            <div className='flex justify-between'>
                <p>Trap Status</p>
                <p>{session.trapStatus}</p>
            </div>
            <div className='flex justify-between'>
                <p>Comments</p>
                <p>{session.commentsAboutTheArray}</p>
            </div>
        </div>
    )
}