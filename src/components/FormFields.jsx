import {
    getArraysForSite,
    getFenceTraps,
    getSexes,
    getSitesForProject,
    getSpeciesCodesForProjectByTaxa,
    getStandardizedDateTimeString,
    getTrapStatuses,
} from '../utils/firestore';
import classNames from 'classnames';
import { SearchIcon } from '../assets/icons';
import InputLabel from './InputLabel';
import { Type, notify } from './Notifier';
import { appMode } from '../utils/jotai';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useState, useEffect } from 'react';
import React from 'react';
import { useAtomValue } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';

export const YearField = ({ setYear, layout }) => {
    const currentYear = new Date().getFullYear();
    const getYearOptions = () => {
        const years = [];
        for (let i = 1969; i <= currentYear; i++) {
            years.unshift(i.toString());
        }
        return years;
    };

    return (
        <InputLabel
            label="Year"
            layout={layout}
            input={
                <select
                    defaultValue="Select an option"
                    onChange={(e) => {
                        setYear(e.target.value);
                    }}
                >
                    <option value="Select an option" disabled hidden>
                        Select an option
                    </option>
                    {getYearOptions().map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            }
        />
    );
};

export const ProjectField = ({ project, setProject, layout }) => {
    return (
        <InputLabel
            label="Project"
            layout={layout}
            input={
                <select
                    value={project}
                    onChange={(e) => {
                        setProject(e.target.value);
                    }}
                >
                    <option value="Gateway">Gateway</option>
                    <option value="San Pedro">San Pedro</option>
                    <option value="Virgin River">Virgin River</option>
                </select>
            }
        />
    );
};

const DateField = ({ date, setDate, layout, disabled }) => {
    return (
        <InputLabel
            label="Date"
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type="date"
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value);
                    }}
                />
            }
        />
    );
};

const TimeField = ({ time, setTime, layout, disabled }) => {
    return (
        <InputLabel
            label="Time"
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type="time"
                    value={time}
                    onChange={(e) => {
                        setTime(e.target.value);
                    }}
                />
            }
        />
    );
};

const DateTimeField = ({ dateTime, setDateTime, layout, disabled }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (dateTime) {
            setDate(getStandardizedDateTimeString(dateTime).split(' ')[0].replace(/\//g, '-'));
            setTime(getStandardizedDateTimeString(dateTime).split(' ')[1]);
        }
    }, [dateTime]);

    useEffect(() => {
        if (date !== '' && time !== '') {
            const newDate = new Date(`${date} ${time}`);
            setDateTime(getStandardizedDateTimeString(newDate));
        }
    }, [date, time]);

    return (
        <div className="flex space-x-2">
            <DateField date={date} setDate={setDate} layout={layout} disabled={disabled} />
            <TimeField time={time} setTime={setTime} layout={layout} disabled={disabled} />
        </div>
    );
};

const RecorderField = ({ recorder, setRecorder, layout, disabled }) => {
    return (
        <InputLabel
            label="Recorder"
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type="text"
                    maxLength={3}
                    value={recorder}
                    onChange={(e) => {
                        if (e.target.value.match(/^[a-zA-Z]*$/))
                            setRecorder(e.target.value.toUpperCase());
                    }}
                />
            }
        />
    );
};

const HandlerField = ({ handler, setHandler, layout, disabled }) => {
    return (
        <InputLabel
            label="Handler"
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type="text"
                    maxLength={3}
                    value={handler}
                    onChange={(e) => {
                        if (e.target.value.match(/^[a-zA-Z]*$/))
                            setHandler(e.target.value.toUpperCase());
                    }}
                />
            }
        />
    );
};
const SiteField = ({ site, setSite, project }) => {
    const [siteOptions, setSiteOptions] = useState([]);

    const populateSiteOptions = async () => {
        setSiteOptions(await getSitesForProject(project));
    };

    useEffect(() => {
        populateSiteOptions();
    }, [project]); // Trigger re-fetch when project or triggerRerender changes

    return (
        <InputLabel
            label={'Site'}
            layout={'vertical'}
            input={
                <select
                    value={site || 'Select an option'}
                    onChange={(e) => {
                        setSite(e.target.value);
                    }}
                >
                    <option value="Select an option" disabled hidden>
                        Select an option
                    </option>
                    {siteOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            }
        />
    );
};

const ReadOnlyField = ({ label, value }) => {
    return (
        <div className="flex items-center m-2">
            <p className="text-black">
                {label}: {value}
            </p>
        </div>
    );
};

const ArrayField = ({ array, setArray, disabled, site, project }) => {
    if (disabled) return <ReadOnlyField label="Array" value={array} />;
    const [arrayOptions, setArrayOptions] = useState([]);
    const populateArrayOptions = async () => {
        setArrayOptions(await getArraysForSite(project, site));
    };
    useEffect(() => {
        populateArrayOptions();
    }, [site]);
    return (
        <InputLabel
            label={'Array'}
            layout={'vertical'}
            input={
                <select
                    value={array || 'Select an option'}
                    onChange={(e) => {
                        setArray(e.target.value);
                    }}
                >
                    <option value="Select an option" disabled hidden>
                        {site === '' ? 'Select a site' : 'Select an option'}
                    </option>
                    {arrayOptions.map((option) => {
                        return (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        );
                    })}
                </select>
            }
        />
    );
};

const NoCapturesField = ({ noCaptures, setNoCaptures }) => (
    <Checkbox label={'No Captures?'} setValue={setNoCaptures} value={noCaptures} />
);

const PredatorField = ({ pred, setPred }) => (
    <Checkbox label={'Predator?'} setValue={setPred} value={pred} />
);

const HdBodyField = ({ value, setValue }) => (
    <InputLabel
        label="Hd Body"
        layout="vertical"
        input={<input type="number" value={value} onChange={(e) => setValue(e.target.value)} />}
    />
);

const Checkbox = ({ value, setValue, label }) => {
    useEffect(() => {
        if (value === undefined || value === '') setValue('false');
    }, [value]);
    return (
        <div
            className="flex items-center ml-2"
            onClick={() => {
                if (value === 'true') setValue('false');
                else if (value === '' || value === undefined || value === 'false') setValue('true');
            }}
        >
            <label className="cursor-pointer">{label}</label>
            <input
                readOnly
                className="ml-2 w-4 cursor-pointer"
                type="checkbox"
                checked={value === 'true'}
            />
        </div>
    );
};

const DeadField = ({ dead, setDead }) => (
    <Checkbox label={'Dead?'} setValue={setDead} value={dead} />
);

const SexField = ({ sex, setSex, layout, disabled }) => {
    const [sexOptions, setSexOptions] = useState([]);
    useEffect(() => {
        getSexes().then((sexes) => {
            setSexOptions(sexes);
        });
    }, []);
    return (
        <InputLabel
            label={'Sex'}
            layout={layout}
            input={
                <select
                    disabled={disabled}
                    value={sex || 'Select an option'}
                    onChange={(e) => {
                        setSex(e.target.value);
                    }}
                >
                    <option value="Select an option" disabled hidden>
                        Select an option
                    </option>
                    {sexOptions.map((option) => {
                        return (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        );
                    })}
                </select>
            }
        />
    );
};

const TrapStatusField = ({ trapStatus, setTrapStatus, layout, disabled }) => {
    const [trapStatusOptions, setTrapStatusOptions] = useState([]);
    useEffect(() => {
        getTrapStatuses().then((statuses) => {
            setTrapStatusOptions(statuses);
        });
    }, []);
    return (
        <InputLabel
            label={'Trap Status'}
            layout={layout}
            input={
                <select
                    disabled={disabled}
                    value={trapStatus || 'Select an option'}
                    onChange={(e) => {
                        setTrapStatus(e.target.value);
                    }}
                >
                    <option value="Select an option" disabled hidden>
                        Select an option
                    </option>
                    {trapStatusOptions.map((option) => {
                        return (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        );
                    })}
                </select>
            }
        />
    );
};

export const SearchField = ({ search, setSearch }) => {
    const inputClass = classNames({
        'pl-10': true,
        'pl-4': false,
    });

    const iconContainerClass = classNames(
        'absolute inset-y-0 left-0 pl-3 flex items-center',
        'pointer-events-none',
        'text-neutral-400 text-xl',
    );

    return (
        <div className="relative">
            <input
                className={inputClass}
                type="search"
                value={search}
                onChange={setSearch}
                placeholder={'Search'}
            />
            <div className={iconContainerClass}>
                <SearchIcon />
            </div>
        </div>
    );
};

const CommentsField = ({ setComments, layout, disabled }) => (
    <InputLabel
        label="Comments"
        layout={layout}
        input={
            <textarea
                disabled={disabled}
                className="resize-none border border-gray-300 rounded-md p-2 col-span-2 max-w-full"
                placeholder="Comments"
                onChange={(e) => setComments(e.target.value)}
            />
        }
    />
);

const FenceTrapField = ({ fenceTrap, setFenceTrap, layout, disabled }) => {
    const [fenceTrapOptions, setFenceTrapOptions] = useState([]);
    useEffect(() => {
        getFenceTraps().then((fenceTraps) => {
            setFenceTrapOptions(fenceTraps);
        });
    }, []);
    return (
        <InputLabel
            label="Fence Trap"
            layout={layout}
            input={
                <select
                    disabled={disabled}
                    value={fenceTrap || 'Select an option'}
                    onChange={(e) => {
                        setFenceTrap(e.target.value);
                    }}
                >
                    <option value="Select an option" disabled hidden>
                        Select an option
                    </option>
                    {fenceTrapOptions.map((option) => {
                        return (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        );
                    })}
                </select>
            }
        />
    );
};

const TaxaField = ({ taxa }) => <ReadOnlyField label="Taxa" value={taxa} />;

const SpeciesCodeField = ({ species, setSpecies, project, taxa, layout, disabled }) => {
    const [speciesOptions, setSpeciesOptions] = useState([]);

    useEffect(() => {
        getSpeciesCodesForProjectByTaxa(project, taxa).then((species) => {
            if (species.length) {
                setSpeciesOptions([...new Set(species.map((s) => s.code))]); // Ensure uniqueness
                setSpecies('');
            }
        });
    }, [taxa, project]);

    return (
        <InputLabel
            label="Species Code"
            layout={layout}
            input={
                <select
                    value={species || 'Select an option'}
                    disabled={disabled}
                    onChange={(e) => {
                        setSpecies(e.target.value);
                    }}
                >
                    <option value="Select an option" disabled hidden>
                        Select an option
                    </option>
                    {[...new Set(speciesOptions)].map((option, index) => (
                        <option key={`${option}-${index}`} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            }
        />
    );
};

const SpeciesField = ({ species, setSpecies, entry, speciesArray }) => {
    const [speciesText, setSpeciesText] = useState('Select species code');
    useEffect(() => {
        if (species !== '' && species !== undefined) setSpeciesText(species);
    }, [species]);
    useEffect(() => {
        speciesArray &&
            speciesArray.then((speciesArray) => {
                speciesArray &&
                    setSpecies(
                        speciesArray.filter((species) => species.code === entry.speciesCode)[0]
                            ?.species || '',
                    );
            });
    }, [entry.speciesCode, speciesArray]);
    return <ReadOnlyField label="Species" value={speciesText} />;
};

const GenusField = ({ genus, setGenus, entry, speciesArray }) => {
    const [genusText, setGenusText] = useState('Select species code');
    useEffect(() => {
        if (genus !== '' && genus !== undefined) setGenusText(genus);
    }, [genus]);
    useEffect(() => {
        speciesArray &&
            speciesArray.then((speciesArray) => {
                speciesArray &&
                    setGenus(
                        speciesArray.filter((species) => species.code === entry.speciesCode)[0]
                            ?.genus || '',
                    );
            });
    }, [entry.speciesCode, speciesArray]);
    return <ReadOnlyField label={'Genus'} value={genusText} />;
};

const VTLField = ({ vtl, setVTL, layout, disabled }) => (
    <InputLabel
        label="VTL (mm)"
        layout={layout}
        input={
            <input
                disabled={disabled}
                type="number"
                value={vtl || ''}
                onChange={(e) => {
                    setVTL(e.target.value);
                }}
            />
        }
    />
);

const SVLField = ({ svl, setSVL, layout, disabled }) => (
    <InputLabel
        label="SVL (mm)"
        layout={layout}
        input={
            <input
                disabled={disabled}
                type="number"
                value={svl || ''}
                onChange={(e) => {
                    setSVL(e.target.value);
                }}
            />
        }
    />
);

const HatchlingField = ({ hatchling, setHatchling }) => (
    <Checkbox label="Hatchling?" value={hatchling} setValue={setHatchling} />
);

const OTLField = ({ otl, setOTL, layout, disabled }) => {
    return (
        <InputLabel
            label="OTL (mm)"
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type="number"
                    value={otl || ''}
                    onChange={(e) => {
                        setOTL(e.target.value);
                    }}
                />
            }
        />
    );
};

const MassField = ({ mass, setMass, layout, disabled }) => {
    return (
        <InputLabel
            label="Mass (g)"
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type="number"
                    value={mass || ''}
                    onChange={(e) => {
                        setMass(e.target.value);
                    }}
                />
            }
        />
    );
};

const RecaptureField = ({ recapture, setRecapture }) => {
    return <Checkbox label="Recapture?" value={recapture} setValue={setRecapture} />;
};

const RegenTailField = ({ regenTail, setRegenTail }) => {
    return <Checkbox label="Regen tail?" value={regenTail} setValue={setRegenTail} />;
};

export const checkToeCodeValidity = async (
    toeCode,
    environment,
    project,
    site,
    speciesCode,
    recapture,
) => {
    if (toeCode === undefined) toeCode = '';
    if (toeCode.includes('C4') || toeCode.includes('D4')) {
        notify(Type.error, 'Warning: C4 or D4 toes should not be clipped');
    }
    if (toeCode.length < 2) {
        notify(Type.error, 'Toe Clip Code needs to be at least 2 characters long');
        return false;
    } else if (toeCode.length % 2) {
        notify(Type.error, 'Toe Clip Code must have an even number of characters');
        return false;
    } else {
        const collectionName =
            environment === 'live'
                ? `${project.replace(/\s/g, '')}Data`
                : `Test${project.replace(/\s/g, '')}Data`;
        const lizardSnapshot = await getDocs(
            query(
                collection(db, collectionName),
                where('toeClipCode', '==', toeCode),
                where('site', '==', site),
                where('speciesCode', '==', speciesCode),
            ),
        );
        if (recapture === 'true') {
            if (lizardSnapshot.size > 0) {
                return true;
            } else {
                notify(
                    Type.error,
                    'Toe Clip Code is not previously recorded, please uncheck the recapture box to record a new entry',
                );
                return false;
            }
        } else {
            if (lizardSnapshot.size > 0) {
                notify(
                    Type.error,
                    'Toe Clip Code is already taken, choose another or check recapture box',
                );
                return false;
            } else {
                return true;
            }
        }
    }
};

const ToeClipCodeField = ({ toeCode, setToeCode, project, site, speciesCode, recapture }) => {
    const environment = useAtomValue(appMode);
    const [buttonText, setButtonText] = useState('Generate');
    const [recaptureHistoryIsOpen, setRecaptureHistoryIsOpen] = useState(false);
    const [previousLizardEntries, setPreviousLizardEntries] = useState([]);
    const [toeCodeIsValid, setToeCodeIsValid] = useState(undefined);

    useEffect(() => {
        if (recapture === 'true') setButtonText('History');
        else setButtonText('Generate');
        setToeCode('');
        setToeCodeIsValid(undefined);
    }, [recapture, speciesCode]);

    const generateNewToeCode = async () => {
        if (!(speciesCode === '' || speciesCode === null || speciesCode === undefined)) {
            if (!toeCode) toeCode = '';
            const collectionName =
                environment === 'live'
                    ? `${project.replace(/\s/g, '')}Data`
                    : `Test${project.replace(/\s/g, '')}Data`;
            const lizardSnapshot = await getDocs(
                query(
                    collection(db, collectionName),
                    where('site', '==', site),
                    where('speciesCode', '==', speciesCode),
                ),
            );
            const toeCodesArray = lizardSnapshot.docs.map((doc) => doc.data().toeClipCode);
            const toeCodesTemplateSnapshot = await getDocs(
                query(collection(db, 'AnswerSet'), where('set_name', '==', 'toe clip codes')),
            );
            let workingToeCode = toeCode;

            if (workingToeCode === '') {
                for (const templateToeCode of toeCodesTemplateSnapshot.docs[0].data().answers) {
                    if (!toeCodesArray.includes(templateToeCode.primary)) {
                        workingToeCode = templateToeCode.primary;
                        break;
                    }
                }
            } else if (toeCodesArray.includes(workingToeCode)) {
                let toeCodeChars = workingToeCode.split(/\d+/).filter(Boolean);
                for (const templateToeCode of toeCodesTemplateSnapshot.docs[0].data().answers) {
                    if (!toeCodeChars.some((char) => templateToeCode.primary.includes(char))) {
                        let tempToeCode = templateToeCode.primary + workingToeCode;
                        let tempToeArray = tempToeCode.split(/([a-zA-Z]\d)/).filter(Boolean);
                        tempToeArray.sort();
                        tempToeCode = tempToeArray.join('');
                        if (!toeCodesArray.includes(tempToeCode)) {
                            workingToeCode = tempToeCode;
                            break;
                        }
                    }
                }
            }
            setToeCode(workingToeCode);
            setToeCodeIsValid(true);
        } else {
            notify(Type.error, 'Must selsect a species first.');
        }
    };

    const findPreviousLizardEntries = async () => {
        setButtonText('Querying...');
        const collectionName =
            environment === 'live'
                ? `${project.replace(/\s/g, '')}Data`
                : `Test${project.replace(/\s/g, '')}Data`;
        const lizardDataRef = collection(db, collectionName);
        const q = query(
            lizardDataRef,
            where('toeClipCode', '==', toeCode),
            where('site', '==', site),
            where('speciesCode', '==', speciesCode),
        );
        const lizardEntriesSnapshot = await getDocs(q);
        let tempArray = [];
        for (const doc of lizardEntriesSnapshot.docs) {
            console.log(doc.data());
            tempArray.push(doc.data());
        }
        setPreviousLizardEntries(tempArray);
        setRecaptureHistoryIsOpen(true);
        setButtonText('History');
    };

    return (
        <div className="flex flex-col">
            <label>Toe Clip Code</label>
            <input
                className={
                    toeCodeIsValid === true
                        ? 'border-green-500 border-2'
                        : toeCodeIsValid === false
                          ? 'border-red-500 border-2'
                          : 'border-gray-500 border-2'
                }
                type="text"
                value={toeCode || ''}
                onChange={(e) => setToeCode(e.target.value.toUpperCase())}
                onBlur={async () => {
                    if (toeCode.length > 0)
                        setToeCodeIsValid(
                            await checkToeCodeValidity(
                                toeCode,
                                environment,
                                project,
                                site,
                                speciesCode,
                                recapture,
                            ),
                        );
                }}
            />
            <button
                className="w-min mt-1 button"
                onClick={() => {
                    if (buttonText === 'Generate') generateNewToeCode();
                    else if (buttonText === 'History') {
                        findPreviousLizardEntries();
                    }
                }}
            >
                {buttonText}
            </button>
            <AnimatePresence>
                {recaptureHistoryIsOpen && (
                    <LandscapeTable
                        site={site}
                        speciesCode={speciesCode}
                        toeCode={toeCode}
                        previousLizardEntries={previousLizardEntries}
                        setRecaptureHistoryIsOpen={setRecaptureHistoryIsOpen}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const LandscapeTable = ({
    site,
    speciesCode,
    toeCode,
    previousLizardEntries,
    setRecaptureHistoryIsOpen,
}) => {
    const lizardHistoryLabelArray = [
        'Date',
        'Array',
        'Recapture',
        'SVL',
        'VTL',
        'OTL',
        'Mass',
        'Sex',
        'Dead',
        'Comments',
    ];

    const lizardHistoryLabelKeys = [
        'dateTime',
        'array',
        'recapture',
        'svlMm',
        'vtlMm',
        'otlMm',
        'massG',
        'sex',
        'dead',
        'comments',
    ];

    return (
        <motion.div
            className="absolute h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] shadow-2xl top-0 left-0 bg-white border-2 border-asu-maroon rounded-2xl m-5 p-1 flex flex-col items-center portrait:hidden z-50"
            initial={{ opacity: 0, y: '50%' }}
            animate={{ opacity: 1, y: '0', transition: { duration: 0.15 } }}
            exit={{ opacity: 0, y: '25%', transition: { duration: 0.05 } }}
        >
            <h1 className="text-3xl  text-black">Recapture History</h1>

            <motion.div className="flex items-center space-x-2 justify-center w-full border-black border-0 justify-items-center max-w-md">
                <motion.div className="flex w-16 flex-col items-center">
                    <p className="text-sm text-black/75 italic leading-none">Site</p>
                    <motion.div className="w-full bg-black h-[1px]" />
                    <p className="text-md text-black font-semibold leading-tight">{site}</p>
                </motion.div>
                <motion.div className="flex w-20 flex-col items-center">
                    <p className="text-sm text-black/75 italic leading-none">Species</p>
                    <motion.div className="w-full bg-black h-[1px]" />
                    <p className="text-md text-black font-semibold leading-tight">
                        {speciesCode ?? 'N/A'}
                    </p>
                </motion.div>
                <motion.div className="flex w-28 flex-col items-center">
                    <p className="text-sm text-black/75 italic leading-none">Toe Clip Code</p>
                    <motion.div className="w-full bg-black h-[1px]" />
                    <p className="text-md text-black font-semibold leading-tight">{toeCode}</p>
                </motion.div>
            </motion.div>

            <motion.div className="border-2 border-black w-full h-full mb-2 rounded-xl shadow-lg overflow-y-auto">
                <table className="text-center text-sm w-full table-auto border-collapse">
                    <thead className="text-black">
                        <tr className="text-black">
                            {lizardHistoryLabelArray.map((label, index, array) => (
                                <td
                                    key={label}
                                    className={
                                        index < array.length - 1
                                            ? 'border-r-[1px] border-b-2 border-black text-black'
                                            : 'border-r-0 border-b-2 border-black text-black'
                                    }
                                >
                                    {label}
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {previousLizardEntries.map((entry, index) => {
                            return (
                                <tr key={index}>
                                    {lizardHistoryLabelKeys.map((key, index, array) => {
                                        let itemToDisplay = entry[key] ?? 'N/A';
                                        if (key === 'dateTime') {
                                            const date = new Date(entry[key]).toLocaleDateString();
                                            itemToDisplay = date;
                                        }
                                        if (itemToDisplay === 'false') {
                                            itemToDisplay = 'No';
                                        }
                                        if (itemToDisplay === 'true') {
                                            itemToDisplay = 'Yes';
                                        }
                                        return (
                                            <td
                                                key={`${itemToDisplay}${index}`}
                                                className={
                                                    index < array.length - 1
                                                        ? 'border-r-[1px] border-b-[1px] border-black'
                                                        : 'border-b-[1px] border-black'
                                                }
                                            >
                                                {itemToDisplay}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </motion.div>
            <button
                className="button border-2 text-xl border-asu-maroon rounded-xl w-1/2 px-4 py-1 mb-2 mt-auto"
                onClick={() => setRecaptureHistoryIsOpen(false)}
            >
                Close
            </button>
        </motion.div>
    );
};

const ArthropodDataField = ({ label, value, setValue }) => {
    return (
        <InputLabel
            layout="vertical"
            label={label.toUpperCase()}
            input={
                <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => setValue(e.target.value)}
                />
            }
        />
    );
};

const EntryYearField = ({ year }) => <p>Year: {year}</p>;

export function FormField({
    fieldName,
    value,
    setValue,
    site,
    project,
    taxa,
    layout,
    disabled,
    entry,
    array,
    speciesArray,
}) {
    switch (fieldName) {
        case 'dateTime':
            return (
                <DateTimeField
                    dateTime={value}
                    setDateTime={setValue}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'recorder':
            return (
                <RecorderField
                    recorder={value}
                    setRecorder={setValue}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'handler':
            return (
                <HandlerField
                    handler={value}
                    setHandler={setValue}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'site':
            return (
                <SiteField
                    site={value}
                    setSite={setValue}
                    project={project}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'array':
            return (
                <ArrayField
                    array={value}
                    setArray={setValue}
                    site={site}
                    project={project}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'noCaptures':
            return (
                <NoCapturesField
                    noCaptures={value}
                    setNoCaptures={setValue}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'trapStatus':
            return (
                <TrapStatusField
                    trapStatus={value}
                    setTrapStatus={setValue}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'comments':
        case 'commentsAboutTheArray':
            return (
                <CommentsField
                    comments={value}
                    setComments={setValue}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'fenceTrap':
            return (
                <FenceTrapField
                    fenceTrap={value}
                    setFenceTrap={setValue}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'dead':
            return (
                <DeadField dead={value} setDead={setValue} layout={layout} disabled={disabled} />
            );
        case 'sex':
            return <SexField sex={value} setSex={setValue} layout={layout} disabled={disabled} />;
        case 'taxa':
            return <TaxaField taxa={value} />;
        case 'speciesCode':
            return (
                <SpeciesCodeField
                    project={project}
                    species={value}
                    setSpecies={setValue}
                    taxa={taxa}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'species':
            return (
                <SpeciesField
                    project={project}
                    species={value}
                    setSpecies={setValue}
                    taxa={taxa}
                    layout={layout}
                    disabled={disabled}
                    entry={entry}
                    speciesArray={speciesArray}
                />
            );
        case 'genus':
            return (
                <GenusField
                    project={project}
                    genus={value}
                    setGenus={setValue}
                    taxa={taxa}
                    layout={layout}
                    disabled={disabled}
                    entry={entry}
                    speciesArray={speciesArray}
                />
            );
        case 'svlMm':
            return <SVLField svl={value} setSVL={setValue} layout={layout} disabled={disabled} />;
        case 'vtlMm':
            return <VTLField vtl={value} setVTL={setValue} layout={layout} disabled={disabled} />;
        case 'recapture':
            return (
                <RecaptureField
                    recapture={value}
                    setRecapture={setValue}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'otlMm':
            return <OTLField otl={value} setOTL={setValue} layout={layout} disabled={disabled} />;
        case 'hatchling':
            return (
                <HatchlingField
                    hatchling={value}
                    setHatchling={setValue}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'massG':
            return (
                <MassField mass={value} setMass={setValue} layout={layout} disabled={disabled} />
            );
        case 'regenTail':
            return (
                <RegenTailField
                    regenTail={value}
                    setRegenTail={setValue}
                    layout={layout}
                    disabled={disabled}
                />
            );
        case 'toeClipCode':
            return (
                <ToeClipCodeField
                    toeCode={value}
                    setToeCode={setValue}
                    site={site}
                    project={project}
                    array={array}
                    speciesCode={entry.speciesCode}
                    recapture={entry.recapture}
                />
            );
        case 'aran':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'auch':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'blat':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'chil':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'cole':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'crus':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'derm':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'diel':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'dipt':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'hete':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'hyma':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'hymb':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'lepi':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'mant':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'orth':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'pseu':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'scor':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'soli':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'thys':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'unki':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'micro':
            return <ArthropodDataField label={fieldName} value={value} setValue={setValue} />;
        case 'predator':
            return <PredatorField pred={value} setPred={setValue} />;
        case 'hdBody':
            return <HdBodyField value={value} setValue={setValue} />;
        case 'year':
            return <EntryYearField year={value} />;
        default:
            return <div>{`Field not found: ${fieldName}`}</div>;
    }
}
