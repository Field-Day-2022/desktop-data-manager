import InputField from "./InputField"
import Dropdown from "./Dropdown"
import { useEffect } from "react";
import { getArraysForSite, getFenceTraps, getSexes, getSitesForProject, getTrapStatuses } from "../utils/firestore";
import { useState } from "react";
import classNames from "classnames";
import { SearchIcon } from "../assets/icons";

const ProjectField = ({ project, setProject, layout }) => {
    return (
        <Dropdown
            layout={layout}
            label='Project'
            value={project}
            onClickHandler={setProject}
            options={['Gateway', 'San Pedro', 'Virgin River']}
        />
    );
}

const DateField = ({ date, setDate, layout, disabled }) => {
    useEffect(() => {
        console.log(date);
    }, [date]);
    return (
        <InputField
            disabled={disabled}
            type='date'
            layout={layout}
            defaultValue={(disabled) && date}
            value={date}
            label='Date'
            onChange={(e) => {
                setDate(e.target.value);
            }
            }
        />
    )
}

const TimeField = ({ time, setTime, layout, disabled }) => {
    useEffect(() => {
        console.log(time);
    }, [time]);
    return (
        <InputField
            disabled={disabled}
            type='time'
            layout={layout}
            value={time}
            defaultValue={(disabled) && time}
            label='Time'
            onChange={(e) => {
                setTime(e.target.value);
            }
            }
        />
    )
}

const DateTimeField = ({ dateTime, setDateTime, layout, disabled }) => {
    console.log(dateTime);
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
        <InputField
            disabled={disabled}
            type='text'
            maxLength={3}
            label='Recorder'
            value={recorder}
            onChange={(e) => {
                if (e.target.value.match(/^[a-zA-Z]*$/))
                    setRecorder(e.target.value.toUpperCase())
            }}
            layout={layout} />
    );
}

const HandlerField = ({ handler, setHandler, layout, disabled }) => {
    return (
        <InputField
            disabled={disabled}
            type='text'
            maxLength={3}
            label='Handler'
            value={handler}
            onChange={(e) => {
                if (e.target.value.match(/^[a-zA-Z]*$/))
                    setHandler(e.target.value.toUpperCase())
            }}
            layout={layout} />
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
        <Dropdown
            disabled={disabled}
            label='Site'
            layout={layout}
            value={site}
            onClickHandler={(e) => {
                setSite(e);
            }}
            options={siteOptions} />
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
        <Dropdown
            disabled={disabled}
            label='Array'
            layout={layout}
            value={array}
            onClickHandler={(e) => {
                setArray(e);
            }}
            options={arrayOptions} />
    );
}

const NoCapturesField = ({ noCaptures, setNoCaptures, layout, disabled }) => {
    return (
        <div className='flex flex-col'>
            <label className='text-sm w-full text-left p-2'>No Captures:</label>
            <div className='flex'>
                <div className='flex'>
                    <label className='text-sm w-full text-left p-2'>True</label>
                    <input disabled={disabled} type='radio' name='noCaptures' value='true' checked={noCaptures === 'true'} onChange={(e) => setNoCaptures(e.target.value)} />
                </div>
                <div className='flex'>
                    <label className='text-sm w-full text-left p-2'>False</label>
                    <input disabled={disabled} type='radio' name='noCaptures' value='false' checked={noCaptures === 'false'} onChange={(e) => setNoCaptures(e.target.value)} />
                </div>
            </div>
        </div>
    )
}

const DeadField = ({ dead, setDead, layout, disabled }) => {
    return (
        <div className='flex flex-col'>
            <label className='text-sm w-full text-left p-2'>Dead:</label>
            <div className='flex'>
                <div className='flex'>
                    <label className='text-sm w-full text-left p-2'>True</label>
                    <input disabled={disabled} type='radio' name='dead' value='true' checked={dead === 'true'} onChange={(e) => setDead(e.target.value)} />
                </div>
                <div className='flex'>
                    <label className='text-sm w-full text-left p-2'>False</label>
                    <input disabled={disabled} type='radio' name='dead' value='false' checked={dead === 'false'} onChange={(e) => setDead(e.target.value)} />
                </div>
            </div>
        </div>
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
        <Dropdown
            disabled={disabled}
            label='Sex'
            layout={layout}
            value={sex}
            onClickHandler={(e) => {
                setSex(e);
            }}
            options={sexOptions} />
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
        <Dropdown
            disabled={disabled}
            label='Trap Status'
            layout={layout}
            value={trapStatus}
            onClickHandler={(e) => {
                setTrapStatus(e);
            }}
            options={trapStatusOptions} />
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
        <div className='flex flex-col col-span-2'>
            <label className='text-sm w-full text-left p-2'>Comments:</label>
            <textarea disabled={disabled} className='resize-none border border-gray-300 rounded-md p-2 col-span-2 max-w-full' placeholder='Comments' onChange={(e) => setComments(e.target.value)} />
        </div>
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
        <Dropdown
            disabled={disabled}
            label='Fence Trap'
            layout={layout}
            value={fenceTrap}
            onClickHandler={(e) => {
                setFenceTrap(e);
            }}
            options={fenceTrapOptions} />
    );
}

export const FormField = ({ fieldName, value, setValue, site, project, layout, disabled }) => {
    switch (fieldName) {
        case 'project':
            return <ProjectField project={value} setProject={setValue} layout={layout} disabled={disabled} />
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
        default:
            return <div>{`Field not found: ${fieldName}`}</div>
    }
}