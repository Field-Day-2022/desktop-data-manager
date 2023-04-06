const keyLabelMap = {
    dateTime: 'Date & Time',
    recorder: 'Recorder',
    handler: 'Handler',
    site: 'Site',
    hdBody: 'HD-Body',
    array: 'Array',
    noCaptures: 'No Captures',
    trapStatus: 'Trap Status',
    comments: 'Comments',
    commentsAboutTheArray: 'Comments',
    fenceTrap: 'Fence Trap',
    taxa: 'Taxa',
    speciesCode: 'Species Code',
    genus: 'Genus',
    species: 'Species',
    massG: 'Mass(g)',
    dead: 'Dead?',
    toeClipCode: 'Toe-clip Code',
    recapture: 'Recapture',
    svlMm: 'SVL(mm)',
    vtlMm: 'VTL(mm)',
    regenTail: 'Regen Tail?',
    otlMm: 'OTL(mm)',
    hatchling: 'Hatchling?',
    predator: 'Predator?',
    sex: 'Sex',
    aran: 'ARAN',
    auch: 'AUCH',
    blat: 'BLAT',
    chil: 'CHIL',
    cole: 'COLE',
    crus: 'CRUS',
    derm: 'DERM',
    diel: 'DIEL',
    dipt: 'DIPT',
    hete: 'HETE',
    hyma: 'HYMA',
    hymb: 'HYMB',
    lepi: 'LEPI',
    mant: 'MANT',
    orth: 'ORTH',
    pseu: 'PSEU',
    scor: 'SCOR',
    soli: 'SOLI',
    thys: 'THYS',
    unki: 'UNKI',
    micro: 'MICRO',
};

const sessionLabels = [
    'Date & Time',
    'Recorder',
    'Handler',
    'Site',
    'Array',
    'No Captures',
    'Trap Status',
    'Comments',
];

const turtleLabels = [
    'Date & Time',
    'Site',
    'Array',
    'Fence Trap',
    'Taxa',
    'Species Code',
    'Genus',
    'Species',
    'Mass(g)',
    'Sex',
    'Dead?',
    'Comments',
];

const lizardLabels = [
    'Date & Time',
    'Site',
    'Array',
    'Fence Trap',
    'Taxa',
    'Species Code',
    'Genus',
    'Species',
    'Toe-clip Code',
    'Recapture',
    'SVL(mm)',
    'VTL(mm)',
    'Regen Tail?',
    'OTL(mm)',
    'Hatchling?',
    'Mass(g)',
    'Sex',
    'Dead?',
    'Comments',
];

const mammalLabels = [
    'Date & Time',
    'Site',
    'Array',
    'Fence Trap',
    'Taxa',
    'Species Code',
    'Genus',
    'Species',
    'Mass(g)',
    'Sex',
    'Dead?',
    'Comments',
];

const snakeLabels = [
    'Date & Time',
    'Site',
    'Array',
    'Fence Trap',
    'Taxa',
    'Species Code',
    'Genus',
    'Species',
    'SVL(mm)',
    'VTL(mm)',
    'Mass(g)',
    'Sex',
    'Dead?',
    'Comments',
];

const arthropodLabels = [
    'Date & Time',
    'Site',
    'Array',
    'Fence Trap',
    'Predator?',
    'ARAN',
    'AUCH',
    'BLAT',
    'CHIL',
    'COLE',
    'CRUS',
    'DERM',
    'DIEL',
    'DIPT',
    'HETE',
    'HYMA',
    'HYMB',
    'LEPI',
    'MANT',
    'ORTH',
    'PSEU',
    'SCOR',
    'SOLI',
    'THYS',
    'UNKI',
    'MICRO',
    'Comments',
];

const amphibianLabels = [
    'Date & Time',
    'Site',
    'Array',
    'Fence Trap',
    'Taxa',
    'Species Code',
    'Genus',
    'Species',
    'HD-Body',
    'Mass(g)',
    'Sex',
    'Dead?',
    'Comments',
];

export const getLabel = (key) => keyLabelMap[key];

export const getKey = (label, tableName) => {
    if (label === 'Comments' && tableName === 'Session') {
        return 'commentsAboutTheArray';
    }
    return Object.keys(keyLabelMap).find((key) => keyLabelMap[key] === label);
};

export const getKeys = (tableName) => {
    const labels = TABLE_LABELS[tableName];
    return labels.map((label) => getKey(label, tableName));
};

export const TABLE_LABELS = {
    Session: sessionLabels,
    Turtle: turtleLabels,
    Lizard: lizardLabels,
    Mammal: mammalLabels,
    Snake: snakeLabels,
    Arthropod: arthropodLabels,
    Amphibian: amphibianLabels,
};

export const TABLE_KEYS = {
    Session: getKeys('Session'),
    Turtle: getKeys('Turtle'),
    Lizard: getKeys('Lizard'),
    Mammal: getKeys('Mammal'),
    Snake: getKeys('Snake'),
    Arthropod: getKeys('Arthropod'),
    Amphibian: getKeys('Amphibian'),
};
