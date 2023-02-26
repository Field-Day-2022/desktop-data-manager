import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

export default function TextRevealIconButton({ icon, text, onClick }) {
    const [showText, setShowText] = useState(false);
    return (
        <LayoutGroup>
            <motion.button
                layout
                key='motionbutton'
                className="button"
                onMouseEnter={() => setShowText(true)}
                onMouseLeave={() => setShowText(false)}
                onClick={() => onClick()}>
                <motion.div layout key='icon' className="text-2xl">{icon}</motion.div>
                {(showText) ?
                    <SlideInFromLeft>{text}</SlideInFromLeft> : null}


            </motion.button>
        </LayoutGroup>
    );
}

function SlideInFromLeft({ children }) {
    return (
        <AnimatePresence>
            <motion.div
                className="pl-2"
                key='formbuildertext'
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '-100%' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>

    );
}