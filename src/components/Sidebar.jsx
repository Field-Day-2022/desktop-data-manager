import {AiFillInfoCircle,AiFillTool} from 'react-icons/ai'
import {HiDocument} from 'react-icons/hi'
export default function Sidebar() {
    return (
        <div className="w-72 max-w-72 bg-white flex-col max-h-[calc(100vh-64px)] divide-y overflow-scroll">
            <div>
                <SidebarHeaderElement>Documentation</SidebarHeaderElement>
                <SidebarElement><AiFillInfoCircle className='text-2xl mr-5'/>About</SidebarElement>
            </div>
            <div>
                <SidebarHeaderElement>Export Data</SidebarHeaderElement>
                <SidebarElement><HiDocument className='text-2xl mr-5'/>Export To CSV</SidebarElement>
            </div>
            <div>
                <SidebarHeaderElement>Critter Data</SidebarHeaderElement>
                <SidebarElement><HiDocument className='text-2xl mr-5'/>Turtle</SidebarElement>
                <SidebarElement><HiDocument className='text-2xl mr-5'/>Lizard</SidebarElement>
                <SidebarElement><HiDocument className='text-2xl mr-5'/>Mammal</SidebarElement>
                <SidebarElement><HiDocument className='text-2xl mr-5'/>Snake</SidebarElement>
                <SidebarElement><HiDocument className='text-2xl mr-5'/>Arthropod</SidebarElement>
                <SidebarElement><HiDocument className='text-2xl mr-5'/>Amphibian</SidebarElement>
            </div>
            <div>
                <SidebarHeaderElement>Session Entries</SidebarHeaderElement>
                <SidebarElement><HiDocument className='text-2xl mr-5'/>Session</SidebarElement>
            </div>
            <div>
                <SidebarHeaderElement>Enter Data</SidebarHeaderElement>
                <SidebarElement><HiDocument className='text-2xl mr-5'/>New Session</SidebarElement>
                <SidebarElement><HiDocument className='text-2xl mr-5'/>New Data Entry</SidebarElement>
            </div>
            <div>
                <SidebarHeaderElement>Manage Forms</SidebarHeaderElement>
                <SidebarElement><AiFillTool className='text-2xl mr-5'/>Form Builder</SidebarElement>
            </div>
        </div>
    );
}

function SidebarHeaderElement({ children }) {
    return (
        <div className="px-4 py-3 uppercase text-xs">{children}</div>
    )
}

function SidebarElement({ children }) {
    return (
        <div className="px-4 py-3 flex items-center cursor-pointer hover:bg-neutral-100">{children}</div>
    )
}