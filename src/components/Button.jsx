import { motion } from "framer-motion"

export default function Button({ className, text, onClick, disabled, icon }) {

    return (
        <motion.button
            key={text}
            className={className}
            onClick={() => onClick()}
            disabled={disabled}
            >
            {icon && <ButtonIcon>{icon}</ButtonIcon>}
            <ButtonText>{(text) && text}</ButtonText>
        </motion.button>

    )
}

function ButtonIcon({ children }) {
    return (<div className='flex-none text-2xl m-auto px-1'>{children}</div>)
}

function ButtonText({ children }) {
    return (<div className="flex-grow">{children}</div>);
}