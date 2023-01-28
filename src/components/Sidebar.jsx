import { useState } from 'react';
import { AiFillInfoCircle, AiFillTool } from 'react-icons/ai'
import { BiArrowFromTop, BiArrowToTop, BiExport } from 'react-icons/bi'
import { GiTurtle, GiFrog, GiSpottedBug, GiSandSnake, GiSquirrel } from 'react-icons/gi'
import { HiDocument } from 'react-icons/hi'
import Logo from './Logo';

export default function Sidebar() {
    return (
        <div className="min-w-64 w-72 max-w-64 bg-white flex-col max-h-[calc(100vh-64px)] divide-y overflow-scroll">
            <CollapsibleSidebarSection title="Documentation">
                <SidebarElement icon={<AiFillInfoCircle />}>
                    About
                </SidebarElement>
            </CollapsibleSidebarSection>
            <CollapsibleSidebarSection title="Export Data">
                <SidebarElement icon={<BiExport />}>
                    Export To CSV
                </SidebarElement>
            </CollapsibleSidebarSection>
            <CollapsibleSidebarSection title='Critter Data'>
                <SidebarElement icon={<GiTurtle />}>
                    Turtle
                </SidebarElement>
                <SidebarElement icon={<Logo className='text-neutral-800 h-6' />}>
                    Lizard
                </SidebarElement>
                <SidebarElement icon={<GiSquirrel />}>
                    Mammal
                </SidebarElement>
                <SidebarElement icon={<GiSandSnake />}>
                    Snake
                </SidebarElement>
                <SidebarElement icon={<GiSpottedBug />}>
                    Arthropod
                </SidebarElement>
                <SidebarElement icon={<GiFrog />}>
                    Amphibian
                </SidebarElement>
            </CollapsibleSidebarSection>
            <CollapsibleSidebarSection title='Session Entries'>
                <SidebarElement icon={<HiDocument />}>
                    Session
                </SidebarElement>
            </CollapsibleSidebarSection>
            <CollapsibleSidebarSection title='Enter Data'>
                <SidebarElement icon={<HiDocument />}>
                    New Session
                </SidebarElement>
                <SidebarElement icon={<HiDocument />}>
                    New Data Entry
                </SidebarElement>
            </CollapsibleSidebarSection>
            <CollapsibleSidebarSection title='Manage Forms'>
                <SidebarElement icon={<AiFillTool />}>
                    Form Builder
                </SidebarElement>
            </CollapsibleSidebarSection>

        </div>
    );
}

function CollapsibleSidebarSection({ title, children }) {
    const [collapsed, setCollapsed] = useState(false);

    function toggleCollapse() {
        console.log(collapsed)
        setCollapsed(!collapsed);
    }
    return (
        <div>
            <div className='flex items-center justify-between'>
                <SidebarSectionHeading>{title}</SidebarSectionHeading>
                <div className='text-xl cursor-pointer px-4 text-neutral-400' onClick={toggleCollapse}>
                    {(collapsed) ? <BiArrowFromTop /> : <BiArrowToTop />}
                </div>
            </div>
            {(!collapsed) ? children : null}
        </div>
    )
}

function SidebarSectionHeading({ children }) {
    return (
        <div className="px-4 py-3 uppercase text-xs" >{children}</div>
    )
}

function SidebarElement({ icon, children }) {
    return (
        <div className="px-4 py-3 flex items-center cursor-pointer hover:bg-neutral-100">
            <div className='text-2xl mr-5'>
                {icon}
            </div>{children}
        </div>
    )
}