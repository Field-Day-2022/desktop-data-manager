import { GiTurtle, GiFrog, GiSpottedBug, GiSandSnake, GiSquirrel } from 'react-icons/gi';
import { FaClipboard } from 'react-icons/fa'
import LizardIcon from '../assets/LizardIcon';

import { useAtom } from 'jotai';
import { currentTableName } from '../utils/jotai';

function Tab({ text, icon, active, onClick }) {
    const background = (active) ? 'bg-white ' : 'bg-neutral-200 '
    return (
        <div className={background + 'max-w-fit flex py-2 px-4 rounded-t-2xl text-lg items-center item cursor-pointer  hover:border-asu-gold border-transparent border-b-2 active:bg-neutral-300'}
            onClick={() => onClick()}>
            {[<div key='icon' className='text-2xl mr-2'>{icon}</div>, <div key='text'>{text}</div>]}
        </div>
    );
}

export default function TabBar() {
    const [currentTable, setCurrentTable] = useAtom(currentTableName);

    return (
        <div className='flex pt-4 px-2'>
            <Tab key='Turtle' active={currentTable === 'Turtle'} text='Turtle' icon={<GiTurtle />} onClick={() => setCurrentTable('Turtle')} />
            <Tab key='Lizard' active={currentTable === 'Lizard'} text='Lizard' icon={<LizardIcon className="h-6" />} onClick={() => setCurrentTable('Lizard')} />
            <Tab key='Mammal' active={currentTable === 'Mammal'} text='Mammal' icon={<GiSquirrel />} onClick={() => setCurrentTable('Mammal')} />
            <Tab key='Snake' active={currentTable === 'Snake'} text='Snake' icon={<GiSandSnake />} onClick={() => setCurrentTable('Snake')} />
            <Tab key='Arthropod' active={currentTable === 'Arthropod'} text='Arthropod' icon={<GiSpottedBug />} onClick={() => setCurrentTable('Arthropod')} />
            <Tab key='Amphibian' active={currentTable === 'Amphibian'} text='Amphibian' icon={<GiFrog />} onClick={() => setCurrentTable('Amphibian')} />
            <Tab key='Session' active={currentTable === 'Session'} text='Session' icon={<FaClipboard />} onClick={() => setCurrentTable('Session')} />
        </div>
    );
}