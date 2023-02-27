import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useAnimationControls } from 'framer-motion';

export default function TextRevealIconButton({ icon, text, onClick }) {
    const [showText, setShowText] = useState(false);
    const controls = useAnimationControls();

    return (
        <LayoutGroup>
            <motion.button
                layout
                key="motionbutton"
                className="button"
                onMouseEnter={() => {
                    controls.start({
                        width: '10em',
                    })
                    setShowText(true)
                }}
                onMouseLeave={() => {
                    controls.start({
                        width: '2.5em'
                    })
                    setShowText(false)
                }}
                onClick={() => onClick()}
                animate={controls}
            >
                <motion.div layout key="icon" className="text-2xl rounded-md">
                    {icon}
                </motion.div>
                {showText ? <SlideInFromLeft>{text}</SlideInFromLeft> : null}
            </motion.button>
        </LayoutGroup>
    );
}

function SlideInFromLeft({ children }) {
    return (
        <AnimatePresence>
            <motion.div
                className="pl-2"
                key="formbuildertext"
                initial={{
                    opacity: 0,
                    x: '-25%',
                    // borderRadius: '.375rem',
                }}
                animate={{
                    opacity: 1,
                    x: 0,
                    // borderRadius: '.375rem',
                }}
                exit={{ 
                    opacity: 0, 
                    x: '-25%',
                    // borderRadius: '.375rem',
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
