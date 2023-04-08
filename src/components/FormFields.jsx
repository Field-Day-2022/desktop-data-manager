import { useEffect } from "react";
import { getArraysForSite, getFenceTraps, getSexes, getSitesForProject, getSpeciesCodesForProjectByTaxa, getTrapStatuses } from "../utils/firestore";
import { useState } from "react";
import classNames from "classnames";
import { SearchIcon } from "../assets/icons";
import InputLabel from "./InputLabel";

export const YearField = ({ year, setYear, layout }) => {
    const currentYear = new Date().getFullYear();
    const getYearOptions = () => {
        const years = [];
        for (let i = 1969; i <= currentYear; i++) {
            years.push(i.toString());
        }
        return years;
    }

    return (
        <InputLabel
            label='Year'
            layout={layout}
            input={
                <select
                    value={year}
                    onChange={(e) => {
                        setYear(e.target.value);
                    }}
                >
                    {getYearOptions().map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            }
        />
    );
}

export const ProjectField = ({ project, setProject, layout }) => {
    return (
        <InputLabel
            label='Project'
            layout={layout}
            input={
                <select
                    value={project}
                    onChange={(e) => {
                        setProject(e.target.value);
                    }}
                >
                    <option value='Gateway'>Gateway</option>
                    <option value='San Pedro'>San Pedro</option>
                    <option value='Virgin River'>Virgin River</option>
                </select>
            }
        />
    );
}

const DateField = ({ date, setDate, layout, disabled }) => {
    return (
        <InputLabel
            label='Date'
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type='date'
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value);
                    }
                    }
                />
            }
        />
    )
}

const TimeField = ({ time, setTime, layout, disabled }) => {
    return (
        <InputLabel
            label='Time'
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type='time'
                    value={time}
                    onChange={(e) => {
                        setTime(e.target.value);
                    }
                    }
                />
            }
        />
    )
}

const DateTimeField = ({ dateTime, setDateTime, layout, disabled }) => {
    const [date, setDate] = useState(dateTime?.split('T')[0] || '');
    const [time, setTime] = useState(dateTime?.split('T')[1]?.split('.')[0] || '');

    useEffect(() => {
        console.log(date, time);
        setDateTime(`${date}T${time}`);
    }, [date, time]);

    return (
        <div className='flex space-x-2'>
            <DateField date={date} setDate={setDate} layout={layout} disabled={disabled} />
            <TimeField time={time} setTime={setTime} layout={layout} disabled={disabled} />
        </div>
    );
};


const RecorderField = ({ recorder, setRecorder, layout, disabled }) => {
    return (
        <InputLabel
            label='Recorder'
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type='text'
                    maxLength={3}
                    value={recorder}
                    onChange={(e) => {
                        if (e.target.value.match(/^[a-zA-Z]*$/))
                            setRecorder(e.target.value.toUpperCase())
                    }}
                />
            }
        />
    );
}

const HandlerField = ({ handler, setHandler, layout, disabled }) => {
    return (
        <InputLabel
            label='Handler'
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type='text'
                    maxLength={3}
                    value={handler}
                    onChange={(e) => {
                        if (e.target.value.match(/^[a-zA-Z]*$/))
                            setHandler(e.target.value.toUpperCase())
                    }}
                />
            }
        />
    );
}

const SiteField = ({ site, setSite, project, layout, disabled }) => {
    const [siteOptions, setSiteOptions] = useState([]);

    useEffect(() => {
        getSitesForProject(project).then((sites) => {
            setSiteOptions(sites);
            setSite(sites[0]);
        });
    }, [project])

    return (
        <InputLabel
            label='Site'
            layout={layout}
            input={
                <select
                    disabled={disabled}
                    value={site}
                    onChange={(e) => {
                        setSite(e.target.value);
                    }}
                >
                    {siteOptions.map((site) => {
                        return (
                            <option key={site} value={site}>{site}</option>
                        );
                    })}
                </select>
            }
        />
    );
}

const ArrayField = ({ array, setArray, project, site, layout, disabled }) => {
    const [arrayOptions, setArrayOptions] = useState([]);

    useEffect(() => {
        getArraysForSite(project, site).then((arrays) => {
            setArrayOptions(arrays);
            setArray(arrays[0]);
        });
    }, [site])

    return (
        <InputLabel
            label='Array'
            layout={layout}
            input={
                <select
                    disabled={disabled}
                    value={array}
                    onChange={(e) => {
                        setArray(e.target.value);
                    }}
                >
                    {arrayOptions.map((array) => {
                        return (
                            <option key={array} value={array}>{array}</option>
                        );
                    })}
                </select>
            }
        />
    );
}

const NoCapturesField = ({ noCaptures, setNoCaptures, layout, disabled }) => {
    return (
        <InputLabel
            label='No Captures'
            layout={layout}
            input={
                <TrueFalseToggle
                    disabled={disabled}
                    value={noCaptures}
                    setValue={(e) => {
                        setNoCaptures(e.target.value);
                    }}
                />
            }
        />
    );
}

const TrueFalseToggle = ({ disabled, value, setValue }) => {
    return (
        <div className='flex'>
            <div className='flex'>
                <label className='text-sm w-full text-left p-2'>True</label>
                <input disabled={disabled} type='radio' name={`${value}`} value='true' checked={value === 'true'} onChange={setValue} />
            </div>
            <div className='flex'>
                <label className='text-sm w-full text-left p-2'>False</label>
                <input disabled={disabled} type='radio' name={`${value}`} value='false' checked={value === 'false'} onChange={setValue} />
            </div>
        </div>
    )
}

const DeadField = ({ dead, setDead, layout, disabled }) => {
    return (
        <InputLabel
            label='Dead'
            layout={layout}
            input={
                <TrueFalseToggle
                    disabled={disabled}
                    value={dead}
                    setValue={(e) => {
                        setDead(e.target.value);
                    }}
                />
            }
        />
    )
}

const SexField = ({ sex, setSex, layout, disabled }) => {
    const [sexOptions, setSexOptions] = useState([]);
    useEffect(() => {
        getSexes().then((sexes) => {
            setSexOptions(sexes)
            setSex(sexes[0])
        })
    }, [])
    return (
        <InputLabel
            label={'Sex'}
            layout={layout}
            input={
                <select
                    disabled={disabled}
                    value={sex}
                    onChange={(e) => {
                        setSex(e);
                    }}
                >
                    {sexOptions.map((option) => {
                        return (
                            <option key={option} value={option}>{option}</option>
                        )
                    })}
                </select>
            }
        />
    );
}

const TrapStatusField = ({ trapStatus, setTrapStatus, layout, disabled }) => {
    const [trapStatusOptions, setTrapStatusOptions] = useState([]);
    useEffect(() => {
        getTrapStatuses().then((statuses) => {
            setTrapStatusOptions(statuses);
            setTrapStatus(statuses[0]);
        })
    }, [])
    return (
        <InputLabel
            label={'Trap Status'}
            layout={layout}
            input={
                <select
                    disabled={disabled}
                    value={trapStatus}
                    onChange={(e) => {
                        setTrapStatus(e);
                    }}
                >
                    {trapStatusOptions.map((option) => {
                        return (
                            <option key={option} value={option}>{option}</option>
                        )
                    })}
                </select>
            }
        />
    );
}

export function SearchField({ search, setSearch }) {
    const inputClass = classNames({
        "pl-10": true,
        "pl-4": false,
    });

    const iconContainerClass = classNames(
        "absolute inset-y-0 left-0 pl-3 flex items-center",
        "pointer-events-none",
        "text-neutral-400 text-xl",
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
}

const CommentsField = ({ setComments, layout, disabled }) => {
    return (
        <InputLabel
            label='Comments'
            layout={layout}
            input={
                <textarea
                    disabled={disabled}
                    className='resize-none border border-gray-300 rounded-md p-2 col-span-2 max-w-full'
                    placeholder='Comments'
                    onChange={(e) => setComments(e.target.value)} />
            }
        />
    )
}

const FenceTrapField = ({ fenceTrap, setFenceTrap, layout, disabled }) => {
    const [fenceTrapOptions, setFenceTrapOptions] = useState([]);
    useEffect(() => {
        getFenceTraps().then((fenceTraps) => {
            setFenceTrapOptions(fenceTraps);
            setFenceTrap(fenceTraps[0]);
        })
    }, [])
    return (
        <InputLabel
            label='Fence Trap'
            layout={layout}
            input={
                <select
                    disabled={disabled}
                    value={fenceTrap}
                    onChange={(e) => {
                        setFenceTrap(e);
                    }}
                >
                    {fenceTrapOptions.map((option) => {
                        return (
                            <option key={option} value={option}>{option}</option>
                        )
                    })}
                </select>
            }
        />
    );
}

const TaxaField = ({ taxa, setTaxa, layout, disabled }) => {
    const [taxaOptions, setTaxaOptions] = useState([
        'Turtle',
        'Lizard',
        'Mammal',
        'Snake',
        'Amphibian',
    ]);
    return (
        <InputLabel
            label='Taxa'
            layout={layout}
            input={
                <select
                    disabled={disabled}
                    value={taxa}
                    onChange={(e) => {
                        setTaxa(e);
                    }}
                >
                    {taxaOptions.map((option) => {
                        return (
                            <option key={option} value={option}>{option}</option>
                        )
                    })}
                </select>
            }
        />
    );
}

const SpeciesCodeField = ({ species, setSpecies, project, taxa, layout, disabled }) => {
    const [speciesOptions, setSpeciesOptions] = useState([]);
    useEffect(() => {
        getSpeciesCodesForProjectByTaxa(project, taxa).then((species) => {
            setSpeciesOptions(species.map((s) => s.code));
            setSpecies(species[0].code);
        })
    }, [taxa, project])
    return (
        <InputLabel
            label='Species Code'
            layout={layout}
            input={
                <select
                    disabled={disabled}
                    value={species}
                    onChange={(e) => {
                        setSpecies(e);
                    }}
                >
                    {speciesOptions.map((option) => {
                        return (
                            <option key={option} value={option}>{option}</option>
                        )
                    })}
                </select>
            }
        />
    );
}

const SpeciesField = ({ species, setSpecies, project, taxa, layout, disabled }) => {
    const [speciesOptions, setSpeciesOptions] = useState([]);
    useEffect(() => {
        getSpeciesCodesForProjectByTaxa(project, taxa).then((species) => {
            setSpeciesOptions(species.map((s) => s.species));
            setSpecies(species[0].species);
            console.log(species);
        })
    }, [taxa, project])
    return (
        <InputLabel
            label='Species'
            layout={layout}
            input={
                <select
                    disabled={disabled}
                    value={species}
                    onChange={(e) => {
                        setSpecies(e);
                    }}
                >
                    {speciesOptions.map((option) => {
                        return (
                            <option key={option} value={option}>{option}</option>
                        )
                    })}
                </select>
            }
        />
    );
}

const GenusField = ({ genus, setGenus, project, taxa, layout, disabled }) => {
    const [genusOptions, setGenusOptions] = useState([]);
    useEffect(() => {
        getSpeciesCodesForProjectByTaxa(project, taxa).then((species) => {
            setGenusOptions(species.map((s) => s.genus));
            setGenus(species[0].genus);
        })
    }, [taxa, project])
    return (
        <InputLabel
            label='Genus'
            layout={layout}
            input={
                <select
                    disabled={disabled}
                    value={genus}
                    onChange={(e) => {
                        setGenus(e);
                    }}
                >
                    {genusOptions.map((option) => {
                        return (
                            <option key={option} value={option}>{option}</option>
                        )
                    })}
                </select>
            }
        />
    );
}

const VTLField = ({ vtl, setVTL, layout, disabled }) => {
    return (
        <InputLabel
            label='VTL (mm)'
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type='number'
                    value={vtl}
                    onChange={(e) => {
                        setVTL(e.target.value);
                    }}
                />
            }
        />
    );
}

const SVLField = ({ svl, setSVL, layout, disabled }) => {
    return (
        <InputLabel
            label='SVL (mm)'
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type='number'
                    value={svl}
                    onChange={(e) => {
                        setSVL(e.target.value);
                    }}
                />
            }
        />
    );
}

const HatchlingField = ({ hatchling, setHatchling, layout, disabled }) => {
    return (
        <InputLabel
            label='Hatchling'
            layout={layout}
            input={
                <TrueFalseToggle
                    disabled={disabled}
                    value={hatchling}
                    setValue={setHatchling}
                />
            }
        />
    );
}

const OTLField = ({ otl, setOTL, layout, disabled }) => {
    return (
        <InputLabel
            label='OTL (mm)'
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type='number'
                    value={otl}
                    onChange={(e) => {
                        setOTL(e.target.value);
                    }}
                />
            }
        />
    );
}

const MassField = ({ mass, setMass, layout, disabled }) => {
    return (
        <InputLabel
            label='Mass (g)'
            layout={layout}
            input={
                <input
                    disabled={disabled}
                    type='number'
                    value={mass}
                    onChange={(e) => {
                        setMass(e.target.value);
                    }}
                />
            }
        />
    );
}

const RecaptureField = ({ recapture, setRecapture, layout, disabled }) => {
    return (
        <InputLabel
            label='Recapture'
            layout={layout}
            input={
                <TrueFalseToggle
                    disabled={disabled}
                    value={recapture}
                    setValue={setRecapture}
                />
            }
        />
    );
}

const RegenTailField = ({ regenTail, setRegenTail, layout, disabled }) => {
    return (
        <InputLabel
            label='Regen Tail'
            layout={layout}
            input={
                <TrueFalseToggle
                    disabled={disabled}
                    value={regenTail}
                    setValue={setRegenTail}
                />
            }
        />
    );
}

export const FormField = ({ fieldName, value, setValue, site, project, taxa, layout, disabled }) => {
    switch (fieldName) {
        case 'dateTime':
            return <DateTimeField dateTime={value} setDateTime={setValue} layout={layout} disabled={disabled} />
        case 'recorder':
            return <RecorderField recorder={value} setRecorder={setValue} layout={layout} disabled={disabled} />
        case 'handler':
            return <HandlerField handler={value} setHandler={setValue} layout={layout} disabled={disabled} />
        case 'site':
            return <SiteField site={value} setSite={setValue} project={project} layout={layout} disabled={disabled} />
        case 'array':
            return <ArrayField array={value} setArray={setValue} site={site} project={project} layout={layout} disabled={disabled} />
        case 'noCaptures':
            return <NoCapturesField noCaptures={value} setNoCaptures={setValue} layout={layout} disabled={disabled} />
        case 'trapStatus':
            return <TrapStatusField trapStatus={value} setTrapStatus={setValue} layout={layout} disabled={disabled} />
        case 'comments':
        case 'commentsAboutTheArray':
            return <CommentsField comments={value} setComments={setValue} layout={layout} disabled={disabled} />
        case 'fenceTrap':
            return <FenceTrapField fenceTrap={value} setFenceTrap={setValue} layout={layout} disabled={disabled} />
        case 'dead':
            return <DeadField dead={value} setDead={setValue} layout={layout} disabled={disabled} />
        case 'sex':
            return <SexField sex={value} setSex={setValue} layout={layout} disabled={disabled} />
        case 'taxa':
            return <TaxaField taxa={value} setTaxa={setValue} layout={layout} disabled={disabled} />
        case 'speciesCode':
            return <SpeciesCodeField project={project} species={value} setSpecies={setValue} taxa={taxa} layout={layout} disabled={disabled} />
        case 'species':
            return <SpeciesField project={project} species={value} setSpecies={setValue} taxa={taxa} layout={layout} disabled={disabled} />
        case 'genus':
            return <GenusField project={project} genus={value} setGenus={setValue} taxa={taxa} layout={layout} disabled={disabled} />
        case 'svlMm':
            return <SVLField svl={value} setSVL={setValue} layout={layout} disabled={disabled} />
        case 'vtlMm':
            return <VTLField vtl={value} setVTL={setValue} layout={layout} disabled={disabled} />
        case 'recapture':
            return <RecaptureField recapture={value} setRecapture={setValue} layout={layout} disabled={disabled} />
        case 'otlMm':
            return <OTLField otl={value} setOTL={setValue} layout={layout} disabled={disabled} />
        case 'hatchling':
            return <HatchlingField hatchling={value} setHatchling={setValue} layout={layout} disabled={disabled} />
        case 'massG':
            return <MassField mass={value} setMass={setValue} layout={layout} disabled={disabled} />
        case 'regenTail':
            return <RegenTailField regenTail={value} setRegenTail={setValue} layout={layout} disabled={disabled} />
        default:
            return <div>{`Field not found: ${fieldName}`}</div>
    }
}