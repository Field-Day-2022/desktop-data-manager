import Tab from "./Tab";

export default function TabBar({ tabs }) {
    return (
        <div className='flex pt-2 px-2'>
            {tabs.map(({ text, icon, active, onClick }) => (
                <Tab
                    key={text}
                    text={text}
                    icon={icon}
                    active={active}
                    onClick={onClick}
                />
            ))}
        </div>
    );
}