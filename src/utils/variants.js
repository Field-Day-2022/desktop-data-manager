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
            delay: i * 0.05,
        },
    }),
};

export const tableBody = {
    hidden: {
        opacity: 0,
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