import classNames from 'classnames';

export default function Tab({ text, icon, active, onClick }) {
    const background = classNames({
        'bg-white': active,
        'bg-neutral-200': !active,
    });
    const containerClasses = classNames(
        background,
        'max-w-fit flex py-2 px-4 rounded-t-2xl text-lg items-center item cursor-pointer hover:border-asu-gold border-transparent border-b-2',
        { 'active:bg-neutral-300': active }
    );

    return (
        <div className={containerClasses} onClick={onClick}>
            {[
                <div key="icon" className="text-2xl mr-2">
                    {icon}
                </div>,
                <div key="text">{text}</div>,
            ]}
        </div>
    );
}