import { useState, useRef, forwardRef } from 'react';
import { AnimatePresence, LayoutGroup, motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';

export default function TextRevealIconButton({ icon, text, onClick }) {
    const buttonControls = useAnimationControls();
    const textControls = useAnimationControls();
    const ref = useRef(null);

    const calculateWidth = () => `${ref.current.getBoundingClientRect().width + 40}px`;

    const expand = () => {
        buttonControls.start({ width: `${calculateWidth()}` })
        textControls.start('visible');
    }

    const contract = () => {
        buttonControls.start({ width: '40px' })
        textControls.start('hidden')
    }

    useEffect(() => {
        textControls.set('hidden')
    }, [])
    

    return (
        <LayoutGroup>
            <motion.button
                layout
                key="motionbutton"
                className="icon-button"
                onMouseEnter={() => expand()}
                onMouseLeave={() => contract()}
                onClick={() => onClick()}
                animate={buttonControls}
            >
                <motion.div layout key="icon" className="text-2xl rounded-md">
                    {icon}
                </motion.div>
                <SlideInFromLeft controls={textControls} ref={ref}>{text}</SlideInFromLeft>
            </motion.button>
        </LayoutGroup>
    );
}

const SlideInFromLeft = forwardRef((props, ref) => {
    const slideInVariant = {
        hidden: {
            visibility: 'hidden',
            opacity: 0,
            x: '-25%',
        },
        visible: {
            visibility: 'visible',
            opacity: 1,
            x: 0,
        }
    }
    const {children, controls} = props;
    return (
        <motion.div
            variants={slideInVariant}
            ref={ref}
            className="pl-2"
            key="formbuildertext"
            animate={controls}
        >
            {children}
        </motion.div>
    );
})
