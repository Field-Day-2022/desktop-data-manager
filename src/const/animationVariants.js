export const tableRows = {
    initial: {
        opacity: 0,
    },
    exit: {
        opacity: 0,
    },
    visible: (i) => ({
        opacity: 1,
        transition: {
            delay: i * 0.02,
        },
    }),
};

export const tableBody = {
    hidden: {
        opacity: 1,
    },
    visible: {
        opacity: 1,
    },
};

export const modalVariant = {
    hidden: {
        opacity: 0,
        y: '100%',
        scaleX: 0,
        transition: {
            type: 'tween',
        },
    },
    visible: {
        opacity: 1,
        y: 0,
        scaleX: 1,
        transition: {
            type: 'tween',
        },
    },
};

export const slideInVariant = {
    hidden: {
        visibility: 'hidden',
        opacity: 0,
        x: '-25%',
    },
    visible: {
        visibility: 'visible',
        opacity: 1,
        x: 0,
    },
};

export const modalOverlayVariant = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 0.75,
    },
};

export const columnSelectorVariant = {
    hidden: {
        opacity: 0,
        x: '-100%',
        y: '-100%',
    },
    visible: {
        opacity: 1,
        x: '-100%',
        y: 0,
    },
};

export const deleteMessageVariant = {
    hidden: {
        opacity: 0,
        left: '-20rem',
    },
    visible: {
        opacity: 1,
        left: '2rem',
    },
};
