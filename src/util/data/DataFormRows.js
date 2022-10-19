/*
 * File: DataFormRows.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Creates references for different fields for inputting information from a new session and capture.
 */
module.exports = [
    {
        formId: 1,
        formName: 'Session',
        dateModified: 1546457085,
        isSessionForm: true,
        templateJson: {
            start: {
                title: 'Enter Session Info',
                showConfirmation: false,
                fields: [
                    {
                        prompt: 'Recorder',
                        type: 'SHORT_TEXT',
                        regex: '^[A-Z]{2,3}$',
                        required: true,
                    },
                    {
                        prompt: 'Handler',
                        type: 'SHORT_TEXT',
                        regex: '^[A-Z]{2,3}$',
                        required: true,
                    },
                    {
                        prompt: 'Site',
                        type: 'COMBO_BOX',
                        identifying: true,
                        required: true,
                        answer_set: '{Project}Sites',
                    },
                    {
                        prompt: 'Array',
                        type: 'COMBO_BOX',
                        required: true,
                        relies_on: ['Site'],
                        answer_set: '{Project}{Site}Array',
                    },
                    {
                        prompt: 'No Captures',
                        type: 'CHECKBOX',
                        required: true,
                    },
                ],
                next: [
                    {
                        predicate: 'No Captures == "true"',
                        nextPage: 'FieldDayEndSessionForm',
                    },
                    {
                        predicate: 'true',
                        nextPage: 'FieldDayFormSelectionForm',
                    },
                ],
            },
            end: {
                title: 'Trap Status',
                showConfirmation: false,
                fields: [
                    {
                        prompt: 'Trap Status',
                        type: 'COMBO_BOX',
                        answer_set: 'trap statuses',
                        required: true,
                    },
                    {
                        prompt: 'Comments about the array',
                        type: 'LONG_TEXT',
                        required: false,
                    },
                ],
                next: [
                    {
                        predicate: 'true',
                        nextPage: 'FieldDayHome',
                    },
                ],
            },
        },
    },
    {
        formId: 2,
        formName: 'Mammal',
        dateModified: 1546457085,
        isSessionForm: false,
        templateJson: {
            showConfirmation: true,
            fields: [
                {
                    prompt: 'Species Code',
                    type: 'COMBO_BOX',
                    answer_set: '{Project}MammalSpecies',
                    required: true,
                },
                {
                    prompt: 'Fence Trap',
                    type: 'COMBO_BOX',
                    answer_set: 'Fence Traps',
                    required: true,
                },
                {
                    prompt: 'Mass(g)',
                    type: 'NUMBER',
                    required: false,
                    regex: '^[0-9]*(|\\.)[0-9]{0,1}$',
                },
                {
                    prompt: 'Sex',
                    type: 'COMBO_BOX',
                    answer_set: 'Sexes',
                    required: true,
                },
                {
                    prompt: 'Dead?',
                    type: 'CHECKBOX',
                    required: true,
                },
                {
                    prompt: 'Comments',
                    type: 'LONG_TEXT',
                    required: false,
                },
            ],
            next: [{ predicate: true, nextPage: 'FieldDayFormSelectionForm' }],
        },
    },
    {
        formId: 3,
        formName: 'Lizard',
        dateModified: 1547159863,
        isSessionForm: false,
        templateJson: {
            title: 'Lizard',
            showConfirmation: true,
            fields: [
                {
                    prompt: 'Species Code',
                    type: 'COMBO_BOX',
                    answer_set: '{Project}LizardSpecies',
                    identifying: true,
                    required: true,
                },
                {
                    prompt: 'Fence Trap',
                    type: 'COMBO_BOX',
                    answer_set: 'Fence Traps',
                    required: true,
                },
                {
                    prompt: 'Recapture',
                    type: 'CHECKBOX',
                    required: true,
                },
                {
                    prompt: 'Toe-clip Code',
                    answer_set: 'toe clip codes',
                    unique: true,
                    unique_on_false: 'Recapture',
                    type: 'SHORT_TEXT',
                    identifying: true,
                    required: false,
                    regex: '^(A[1-5]){0,5}(B[1-5]){0,5}(C[1-5]){0,5}(D[1-5]){0,5}$',
                },
                {
                    prompt: 'Capture History',
                    type: 'HIST_BUTTON',
                    relies_on: ['Recapture'],
                    required: false,
                },
                {
                    prompt: 'SVL(mm)',
                    type: 'NUMBER',
                    required: false,
                    regex: '^[0-9]*(|\\.)[0-9]{0,1}$',
                },
                {
                    prompt: 'VTL(mm)',
                    type: 'NUMBER',
                    required: false,
                    regex: '^[0-9]*(|\\.)[0-9]{0,1}$',
                },
                {
                    prompt: 'Regen Tail?',
                    type: 'CHECKBOX',
                    required: true,
                },
                {
                    prompt: 'OTL(mm)',
                    type: 'NUMBER',
                    required: false,
                    relies_on: ['Regen Tail?'],
                    regex: '^[0-9]*(|\\.)[0-9]{0,1}$',
                },
                {
                    prompt: 'Hatchling?',
                    type: 'CHECKBOX',
                    required: true,
                },
                {
                    prompt: 'Mass(g)',
                    type: 'NUMBER',
                    required: false,
                    regex: '^[0-9]*(|\\.)[0-9]{0,1}$',
                },
                {
                    prompt: 'Sex',
                    type: 'COMBO_BOX',
                    answer_set: 'Sexes',
                    required: true,
                },
                {
                    prompt: 'Dead?',
                    type: 'CHECKBOX',
                    required: true,
                },
                {
                    prompt: 'Comments about this animal',
                    type: 'LONG_TEXT',
                    required: false,
                },
            ],
            next: [
                {
                    predicate: true,
                    nextPage: 'FieldDayFormSelectionForm',
                },
            ],
        },
    },
    {
        formId: 4,
        formName: 'Snake',
        dateModified: 1546457085,
        isSessionForm: false,
        templateJson: {
            showConfirmation: true,
            fields: [
                {
                    prompt: 'Species Code',
                    type: 'COMBO_BOX',
                    answer_set: '{Project}SnakeSpecies',
                    required: true,
                },
                {
                    prompt: 'Fence Trap',
                    type: 'COMBO_BOX',
                    answer_set: 'Fence Traps',
                    required: true,
                },
                {
                    prompt: 'SVL(mm)',
                    type: 'NUMBER',
                    required: false,
                    regex: '^[0-9]*(|\\.)[0-9]{0,1}$',
                },
                {
                    prompt: 'VTL(mm)',
                    type: 'NUMBER',
                    required: false,
                    regex: '^[0-9]*(|\\.)[0-9]{0,1}$',
                },
                {
                    prompt: 'Mass(g)',
                    type: 'NUMBER',
                    required: false,
                    regex: '^[0-9]*(|\\.)[0-9]{0,1}$',
                },
                {
                    prompt: 'Sex',
                    type: 'COMBO_BOX',
                    answer_set: 'Sexes',
                    required: true,
                },
                {
                    prompt: 'Dead?',
                    type: 'CHECKBOX',
                    required: true,
                },
                {
                    prompt: 'Comments',
                    type: 'LONG_TEXT',
                    required: false,
                },
            ],
            next: [{ predicate: true, nextPage: 'FieldDayFormSelectionForm' }],
        },
    },
    {
        formId: 5,
        formName: 'Amphibian',
        dateModified: 1546457085,
        isSessionForm: false,
        templateJson: {
            showConfirmation: true,
            fields: [
                {
                    prompt: 'Species Code',
                    type: 'COMBO_BOX',
                    answer_set: '{Project}AmphibianSpecies',
                    required: true,
                },
                {
                    prompt: 'Fence Trap',
                    type: 'COMBO_BOX',
                    answer_set: 'Fence Traps',
                    required: true,
                },
                {
                    prompt: 'HD-body',
                    type: 'NUMBER',
                    required: false,
                    regex: '^[0-9]*(|\\.)[0-9]{0,1}$',
                },
                {
                    prompt: 'Mass(g)',
                    type: 'NUMBER',
                    required: false,
                    regex: '^[0-9]*(|\\.)[0-9]{0,1}$',
                },
                {
                    prompt: 'Sex',
                    type: 'COMBO_BOX',
                    answer_set: 'Sexes',
                    required: true,
                },
                {
                    prompt: 'Dead?',
                    type: 'CHECKBOX',
                    required: true,
                },
                {
                    prompt: 'Comments',
                    type: 'LONG_TEXT',
                    required: false,
                },
            ],
            next: [{ predicate: true, nextPage: 'FieldDayFormSelectionForm' }],
        },
    },
    {
        formId: 6,
        formName: 'Arthropod',
        dateModified: 1546457085,
        isSessionForm: false,
        templateJson: {
            showConfirmation: true,
            fields: [
                {
                    prompt: 'Fence Trap',
                    type: 'COMBO_BOX',
                    answer_set: 'Fence Traps',
                    required: true,
                },
                {
                    prompt: 'Predator?',
                    type: 'CHECKBOX',
                    required: true,
                },
                {
                    prompt: 'ARAN',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'AUCH',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'BLAT',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'CHIL',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'COLE',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'CRUS',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'DERM',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'DIEL',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'DIPT',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'HETE',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'HYMA',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'HYMB',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'LEPI',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'MANT',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'ORTH',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'PSEU',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'SCOR',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'SOLI',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'THYS',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'UNKI',
                    type: 'COUNTER',
                    required: true,
                },
                {
                    prompt: 'Comment',
                    type: 'LONG_TEXT',
                    required: false,
                },
            ],
            next: [{ predicate: true, nextPage: 'FieldDayFormSelectionForm' }],
        },
    },
];
