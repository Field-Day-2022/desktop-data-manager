import { useState } from 'react';
import {
    getSessionsByProjectAndYear,
    getSpeciesCodesForProjectByTaxa,
    uploadNewEntry,
} from '../utils/firestore';
import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { appMode } from '../utils/jotai';
import TabBar from './TabBar';
import {
    AmphibianIcon,
    ArthropodIcon,
    LizardIcon,
    MammalIcon,
    SnakeIcon,
    TurtleIcon,
} from '../assets/icons';
import { TABLE_KEYS } from '../const/tableLabels';
import { FormField, ProjectField, YearField } from './FormFields';
import InputLabel from './InputLabel';
import { Type, notify } from './Notifier';
import React from 'react';

export default function NewEntryForm() {
    const environment = useAtomValue(appMode);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
    const [project, setProject] = useState('Gateway');
    const [year, setYear] = useState('');
    const [selectedCritter, setSelectedCritter] = useState('');

    const sessionIndexMap = sessions.map((index) => index);

    useEffect(() => {
        console.log('Getting sessions for:', environment, project.replace(/\s/g, ''), year);
        getSessionsByProjectAndYear(environment, project.replace(/\s/g, ''), year).then(
            (sessions) => {
                console.log('Retrieved sessions:', sessions);
                if (sessions.length > 0) {
                    console.log('First session data:', sessions[0].data());
                    setSessions(sessions);
                    setSelectedSessionIndex(0);
                } else {
                    console.log('No sessions found');
                    setSessions([]);
                    setSelectedSessionIndex(null);
                }
            },
        );
    }, [project, year]);
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
    console.log('Current selected session:', selectedSession);
    useEffect(() => {
        setSelectedCritter('');
    }, [selectedSession.dateTime]);

    const critterTabs = [
        { text: 'Turtle', icon: <TurtleIcon /> },
        { text: 'Lizard', icon: <LizardIcon className={'h-6'} /> },
        { text: 'Arthropod', icon: <ArthropodIcon /> },
        { text: 'Amphibian', icon: <AmphibianIcon /> },
        { text: 'Mammal', icon: <MammalIcon /> },
        { text: 'Snake', icon: <SnakeIcon /> },
    ];

    return (
        <div className="flex-col space-y-1 h-tab-modal-content">
            <div className="p-4">
                <div className="flex justify-between">
                    <h1 className="heading">Add New Critter Entry</h1>
                    <ProjectField project={project} setProject={setProject} />
                </div>
                <div className="grid grid-cols-2">
                    <YearField year={year} setYear={setYear} layout="vertical" />
                    <InputLabel
                        label="Session"
                        layout="vertical"
                        input={
                            <select
                                disabled={sessions.length === 0}
                                value={activeSessions[selectedSessionIndex] || 'No sessions found.'}
                                onChange={(e) => {
                                    setSelectedSessionIndex(
                                        sessionIndexMap[activeSessions.indexOf(e.target.value)],
                                    );
                                }}
                            >
                                {activeSessions.map((session, index) => (
                                    <option key={index} value={session}>
                                        {session}
                                    </option>
                                ))}
                            </select>
                        }
                    />
                </div>
                <SessionSummary session={selectedSession} />
            </div>
            <div className="bg-neutral-100 dark:bg-neutral-700 ">
                <h1 className="heading p-4">Choose a Critter</h1>
                <div className="overflow-x-auto ">
                    <TabBar
                        tabs={critterTabs.map((tab) => ({
                            ...tab,
                            active: tab.text === selectedCritter,
                            onClick: () => setSelectedCritter(tab.text),
                        }))}
                    />
                </div>
            </div>
            <div className="p-4">
                {selectedCritter && (
                    <CritterForm
                        critter={selectedCritter}
                        project={project}
                        session={selectedSession}
                        reset={() => {
                            setSelectedCritter('');
                        }}
                    />
                )}
            </div>
        </div>
    );
}

const CritterForm = ({ critter, project, session, reset }) => {
    const [entry, setEntry] = useState({});
    const [speciesArrayPromise, setSpeciesArrayPromise] = useState();
    const environment = useAtomValue(appMode);

    useEffect(() => {
        // console.log(entry)
    }, [entry]);

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
        console.log('Initializing entry with session:', session);
        const tempEntry = {
            ...dataObjTemplate,
            sessionDateTime: session.dateTime, // This is what connects entry to session
            dateTime: session.dateTime,
            site: session.site,
            array: session.array,
            taxa: critter,
            year: session.year,
        };

        console.log('Created temp entry:', tempEntry);
        setEntry(tempEntry);
        hydrateSpeciesArrays(project, critter);
    }, [critter, session]);
    const hydrateSpeciesArrays = async (project, taxa) => {
        setSpeciesArrayPromise(getSpeciesCodesForProjectByTaxa(project, taxa));
    };

    const verifyForm = (species, data) => {
        console.log({
            species,
            data,
            keys: TABLE_KEYS[species],
        });
        return true;
    };

    const addEntry = async () => {
        console.log('Attempting to add entry:');
        console.log('- Entry data:', entry);
        console.log('- Project:', project);
        console.log('- Environment:', environment);
        console.log('- Session data:', session);
        if (verifyForm(critter, entry)) {
            if (await uploadNewEntry(entry, project, environment)) {
                notify(Type.success, 'Successfully uploaded entry to session');
                reset();
            }
        }
    };

    return (
        <div className="flex flex-col space-y-1 items-center">
            <div className="grid grid-cols-3">
                {TABLE_KEYS[critter].map((key, index) => {
                    const disabled = session[key];
                    return (
                        <FormField
                            key={index}
                            disabled={disabled}
                            fieldName={key}
                            layout="vertical"
                            value={entry[key]}
                            setValue={(value) => {
                                setEntry((prev) => ({
                                    ...prev,
                                    [key]: value,
                                }));
                            }}
                            site={session.site}
                            array={session.array}
                            project={project}
                            taxa={critter}
                            entry={entry}
                            addEntry={addEntry}
                            speciesArray={speciesArrayPromise}
                        />
                    );
                })}
            </div>
            <button
                className="button flex-col items-center w-1/2 text-xl p-2"
                onClick={() => addEntry()}
            >
                Add entry?
            </button>
        </div>
    );
};

const SessionSummary = ({ session }) => {
    if (!session || session.dateTime === 'Default') {
        return (
            <div className="flex-col space-y-1">
                <h1 className="heading">Session Summary</h1>
                <p>No session selected</p>
            </div>
        );
    }

    let formattedDate;
    try {
        const date = new Date(session.dateTime);
        if (!isNaN(date.getTime())) {
            // Check if date is valid
            const month = date.toLocaleString('default', { month: 'long' });
            const day = date.getDate();
            const year = date.getFullYear();
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            formattedDate = `${month} ${day}, ${year} ${time}`;
        } else {
            formattedDate = 'Invalid Date';
        }
    } catch (error) {
        formattedDate = 'Invalid Date';
    }

    return (
        <div className="flex-col space-y-1">
            <h1 className="heading">Session Summary</h1>
            <div className="flex justify-between">
                <p>Date Time</p>
                <p>{formattedDate}</p>
            </div>
            <div className="flex justify-between">
                <p>Recorder</p>
                <p>{session.recorder || 'Not set'}</p>
            </div>
            <div className="flex justify-between">
                <p>Handler</p>
                <p>{session.handler || 'Not set'}</p>
            </div>
            <div className="flex justify-between">
                <p>Site</p>
                <p>{session.site || 'Not set'}</p>
            </div>
            <div className="flex justify-between">
                <p>Array</p>
                <p>{session.array || 'Not set'}</p>
            </div>
            <div className="flex justify-between">
                <p>No Captures</p>
                <p>{session.noCaptures || 'Not set'}</p>
            </div>
            <div className="flex justify-between">
                <p>Trap Status</p>
                <p>{session.trapStatus || 'Not set'}</p>
            </div>
            <div className="flex justify-between">
                <p>Comments</p>
                <p>{session.commentsAboutTheArray || 'Not set'}</p>
            </div>
        </div>
    );
};
