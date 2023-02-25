export default function Button({ className, text, onClick, disabled, icon }) {

    const baseClass = 'flex rounded-md p-2 text-white'
    const activeClass = 'bg-asu-maroon cursor-pointer border-transparent border-2 active:border-asu-gold'
    const inactiveClass = 'bg-neutral-800'

    return (
        <div className={(disabled ? inactiveClass : activeClass) + ' ' + baseClass + '  ' + className}
            onClick={onClick}>
            {icon && <ButtonIcon>{icon}</ButtonIcon>}
            <ButtonText>{text}</ButtonText>
        </div>

    )
}

function ButtonIcon({ children }) {
    return (<div className='flex-none text-2xl m-auto px-1'>{children}</div>)
}

function ButtonText({children}) {
    return (<div className="flex-grow">{children}</div>);
}