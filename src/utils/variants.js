export const tableRows = {
    hidden: {
        opacity: 0,
    },
    visible: i => ({
        opacity: 1,
        transition: {
            delay: i * .05,
        }
    })
}

export const tableBody = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    }
}