import { useRef, forwardRef } from 'react';
import { LayoutGroup, motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';
import classNames from 'classnames';

export default function Button({
    className,
    flexible,
    text,
    onClick,
    disabled,
    icon
}) {

    const offset = icon ? 40 : 0;

    const buttonControls = useAnimationControls();
    const textControls = useAnimationControls();
    const ref = useRef(null);

    const calculateWidth = () => `${ref.current.getBoundingClientRect().width + offset}px`;

    const expand = () => {
        buttonControls.start({ width: `${calculateWidth()}` })
        textControls.start('visible');
    }

    const contract = () => {
        buttonControls.start({ width: `${offset}px` })
        textControls.start('hidden')
    }

    useEffect(() => {
        if (flexible) {
            buttonControls.set({ width: `${offset}px` })
            textControls.set('hidden')
        }
    }, [])

    const textClass = classNames(
        'w-full text-center',
        {
            '-ml-5': icon,
            'ml-0': !icon,
        }
    )

    return (
        <LayoutGroup>
            <motion.button
                layout
                text={text}
                key="motionbutton"
                className={className}
                onMouseEnter={() => flexible && expand()}
                onMouseLeave={() => flexible && contract()}
                onClick={() => onClick()}
                disabled={disabled}
                animate={buttonControls}
            >
                {icon && <motion.div layout key="icon" className="text-2xl rounded-md">
                    {icon}
                </motion.div>}
                {flexible ? (
                    <SlideInFromLeft controls={textControls} ref={ref}>{text}</SlideInFromLeft>
                ) : (
                    <div className={textClass}>{text}</div>
                )}
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
    const { children, controls } = props;
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
