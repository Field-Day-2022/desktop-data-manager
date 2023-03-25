import classNames from 'classnames';

export default function Tab({ text, icon, active, onClick }) {
    const bgClass =
        classNames(
            'max-w-fit', 'flex', 'py-1', 'px-4', 'rounded-t-2xl', 'text-lg', 'items-center', 'item', 'cursor-pointer', 'hover:border-asu-gold', 'border-transparent', 'border-b-2', 'active:bg-neutral-300', {
            'bg-white': active,
            'bg-neutral-200': !active,
        });

    return (
        <div
            className={bgClass}
            onClick={onClick}
            role="tab"
            aria-selected={active}
        >
            <div className='text-2xl mr-2'>{icon}</div>
            <div>{text}</div>
        </div>
    );
}