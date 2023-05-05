import { useState } from "react";
import { getSessionsByProjectAndYear, getSpeciesCodesForProjectByTaxa, uploadNewEntry } from "../utils/firestore";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { appMode } from "../utils/jotai";
import TabBar from "./TabBar";
import { AmphibianIcon, ArthropodIcon, LizardIcon, MammalIcon, SnakeIcon, TurtleIcon } from "../assets/icons";
import { TABLE_KEYS } from "../const/tableLabels";
import { FormField, ProjectField, YearField } from "./FormFields";
import InputLabel from "./InputLabel";
import { Type, notify } from "./Notifier";

export default function NewEntryForm({ setData }) {
    const environment = useAtomValue(appMode);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
    const [project, setProject] = useState('Gateway');
    const [year, setYear] = useState('');
    const [selectedCritter, setSelectedCritter] = useState('');

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
        return session.data().dateTime;
    });

    const selectedSession = sessions[selectedSessionIndex]?.data() || {
        dateTime: 'Default',
        recorder: '',
        handler: '',
        site: '',
        array: '',
        commentsAboutTheArray: '',
    };

    useEffect(() => {
        setSelectedCritter('')
    }, [selectedSession.dateTime])

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
                                {activeSessions.map((session, index) => (
                                    <option key={index} value={session}>{session}</option>
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
                {selectedCritter && <CritterForm critter={selectedCritter} project={project} session={selectedSession} />}
            </div>

        </div>
    )
}

const CritterForm = ({ critter, project, session }) => {
    const [entry, setEntry] = useState({});
    const [speciesArrayPromise, setSpeciesArrayPromise] = useState();
    const environment = useAtomValue(appMode);

   useEffect(() => {
        // console.log(entry)
   }, [entry])

   // TODO: dynamically fetch arthopod labels and use those instead of the hardcoded ones!

   const dataObjTemplate = {
        aran: '',
        array: '',
        auch: '',
        blat: '',
        cclMm: '',
        chil: '',
        cole: '',
        comments: '',
        crus: '',
        dateTime: '',
        dead: '',
        derm: '',
        diel: '',
        dipt: '',
        fenceTrap: '',
        genus: '',
        hatchling: '',
        hdBody: '',
        hete: '',
        hyma: '',
        hymb: '',
        lepi: '',
        mant: '',
        massG: '',
        micro: '',
        orth: '',
        otlMm: '',
        plMm: '',
        predator: '',
        pseu: '',
        recapture: '',
        regenTail: '',
        scor: '',
        sessionDateTime: '',
        sex: '',
        site: '',
        soli: '',
        species: '',
        speciesCode: '',
        svlMm: '',
        taxa: '',
        thys: '',
        toeClipCode: '',
        unki: '',
        vtlMm: '',
        year: '',
        noCapture: '',
        lastEdit: '',
    };


    useEffect(() => {
        console.log(session);
        let tempEntry = dataObjTemplate
        tempEntry.sessionDateTime = session.dateTime;
        tempEntry.sessionId = session.sessionId;
        tempEntry.dateTime = session.dateTime;
        tempEntry.site = session.site;
        tempEntry.array = session.array;
        tempEntry.taxa = critter;
        tempEntry.year = session.year;
        setEntry(tempEntry);
        hydrateSpeciesArrays(project, critter)
    }, [critter])
    
    const setField = (key, value) => {
        setEntry(entry => ({
            ...entry,
            [key]: value
        }))
    }

    const hydrateSpeciesArrays = async (project, taxa) => {
        setSpeciesArrayPromise(getSpeciesCodesForProjectByTaxa(project, taxa));
    }

    const verifyForm = (species, data) => {
        console.log({
            species,
            data,
            keys: TABLE_KEYS[species]
        })
        return true;
    }

    const addEntry = async () => {
        if(verifyForm(critter, entry)) {
            if (await uploadNewEntry(entry, project, environment)) {
                notify(Type.success, 'Successfully uploaded entry to session')
            }
        }
    }

    return (
        <div className='flex flex-col space-y-1 items-center'>
            <div className='grid grid-cols-3'>
                {TABLE_KEYS[critter].map((key, index) => {
                    const disabled = session[key]
                    return (
                        <FormField
                            key={index}
                            disabled={disabled}
                            fieldName={key}
                            layout='vertical'
                            value={entry[key]}
                            setValue={(value) => { 
                                setField(key, value)
                            }}
                            site={session.site}
                            array={session.array}
                            project={project}
                            taxa={critter}
                            entry={entry}
                            addEntry={addEntry}
                            speciesArray={speciesArrayPromise}
                        />
                    )
                })
                }
            </div>
            <button 
                className='button flex-col items-center w-1/2 text-xl p-2'
                onClick={() => addEntry()}
            >Add entry?</button>
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