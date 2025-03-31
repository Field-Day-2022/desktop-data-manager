import { useRef } from 'react';
import React from 'react';
import { LayoutGroup, motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';
import classNames from 'classnames';
import { slideInVariant } from '../utils/variants';

export default function Button({ className, flexible, text, onClick, disabled, icon }) {
    const offset = icon ? 40 : 0;

    const buttonControls = useAnimationControls();
    const textControls = useAnimationControls();
    const ref = useRef(null);

    const expand = () => {
        buttonControls.start({ width: `${ref.current?.getBoundingClientRect().width + offset}px` });
        textControls.start('visible');
    };

    const contract = () => {
        buttonControls.start({ width: `${offset}px` });
        textControls.start('hidden');
    };

    useEffect(
        () =>
            flexible
                ? (buttonControls.set({ width: `${offset}px` }), textControls.set('hidden'))
                : undefined,
        [],
    );

    const textClass = classNames('w-full text-center', {
        '-ml-5': icon,
        'ml-0': !icon,
    });

    return (
        <LayoutGroup>
            <motion.button
                layout
                text={text}
                key="motion"
                className={`${className} button`}
                onMouseEnter={() => flexible && expand()}
                onMouseLeave={() => flexible && contract()}
                onClick={onClick}
                disabled={disabled}
                animate={buttonControls}
            >
                {icon && (
                    <motion.div layout key="icon" className="text-2xl rounded-md">
                        {icon}
                    </motion.div>
                )}
                {flexible ? (
                    <motion.div
                        variants={slideInVariant}
                        ref={ref}
                        className="pl-2"
                        key="text"
                        animate={textControls}
                    >
                        {text}
                    </motion.div>
                ) : (
                    <div className={textClass}>{text}</div>
                )}
            </motion.button>
        </LayoutGroup>
    );
}
