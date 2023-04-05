import { useState } from "react";
import Dropdown from "./Dropdown";

export default function NewEntryForm() {
    const [project, setProject] = useState('Gateway');

    const getYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 1969; i <= currentYear; i++) {
            years.push(i.toString());
        }
        return years;
    }

    return (
        <div className='flex-col p-4 space-y-1'>
            <div className='flex justify-between'>
                <h1 className='heading'>Add New Critter Entry</h1>
                <Dropdown
                    label='Project'
                    value={project}
                    onClickHandler={setProject}
                    options={['Gateway', 'San Pedro', 'Virgin River']}
                />
            </div>
            <div className='grid grid-cols-2'>
                <Dropdown
                    label='Year'
                    layout='vertical'
                    value='2021'
                    onClickHandler={() => { }}
                    options={getYearOptions()}
                />
                <Dropdown
                    label='Session'
                    layout='vertical'
                    value='1'
                    onClickHandler={() => { }}
                    options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                />
            </div>
            <h1 className='heading'>Session Summary</h1>
            
        </div>
    )
}