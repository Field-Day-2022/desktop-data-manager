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
