import { GiTurtle, GiFrog, GiSpottedBug, GiSandSnake, GiSquirrel } from 'react-icons/gi';
import Logo from './Logo';

import { useAtom } from 'jotai';
import { currentPageName } from '../utils/jotai';

function Tab({ text, icon, active, onClick }) {
    const background = (active)? 'bg-white ' : 'bg-neutral-200 '
    return (
        <div className={background + 'max-w-fit flex py-2 px-4 rounded-t-2xl text-lg items-center item cursor-pointer  hover:border-asu-gold border-transparent border-b-2 active:bg-neutral-300'}
        onClick={() => onClick()}>
            {[<div className='text-2xl mr-2'>{icon}</div>, text]}
        </div>
    );
}

export default function TabBar() {
    const [currentPage, setCurrentPage] = useAtom(currentPageName);

    return (
        <div className='flex pt-4'>
            <Tab active={currentPage === 'Turtle'} text='Turtle' icon={<GiTurtle />} onClick={() => setCurrentPage('Turtle')} />
            <Tab active={currentPage === 'Lizard'} text='Lizard' icon={<Logo className="h-6" />} onClick={ () => setCurrentPage('Lizard')} />
            <Tab active={currentPage === 'Mammal'} text='Mammal' icon={<GiSquirrel />} onClick={ () => setCurrentPage('Mammal')} />
            <Tab active={currentPage === 'Snake'} text='Snake' icon={<GiSandSnake />} onClick={ () => setCurrentPage('Snake')} />
            <Tab active={currentPage === 'Arthropod'} text='Arthropod' icon={<GiSpottedBug />} onClick={ () => setCurrentPage('Arthropod')} />
            <Tab active={currentPage === 'Amphibian'} text='Amphibian' icon={<GiFrog />} onClick={ () => setCurrentPage('Amphibian')} />
        </div>
    );
}