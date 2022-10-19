/*
 * File: fieldSchemas-esm.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Sets references for different inputs and options on the webpage.
 */

const SHORT_TEXT = {
    label: 'string',
    required: 'boolean',
};

const LONG_TEXT = {
    label: 'string',
    required: 'boolean',
};

const NUMBER = {
    label: 'string',
    required: 'boolean',
};

const HIST_BUTTON = {
    label: 'string',
    required: 'boolean',
};

const CHECKBOX = {
    label: 'string',
    required: 'boolean',
};

const COMBO_BOX = {
    label: 'string',
    required: 'boolean',
    options: [
        {
            label: 'string',
        },
    ],
};

const COUNTER = {
    label: 'string',
    required: 'boolean',
};

export const SCHEMAS = {
    SHORT_TEXT,
    LONG_TEXT,
    NUMBER,
    CHECKBOX,
    COMBO_BOX,
    COUNTER,
    HIST_BUTTON,
};

export const FIELD_TYPES = {
    SHORT_TEXT: 'Text Field',
    LONG_TEXT: 'Text Area',
    NUMBER: 'Number',
    CHECKBOX: 'Check Box',
    COMBO_BOX: 'Combo Box',
    COUNTER: 'Counter',
    HIST_BUTTON: 'History Button',
};

export const REGEX = {
    AZ_2_3: {
        title: '2 to 3 Letters',
        regex: '^[A-Za-z]{2,3}$',
    },
    POS_NUM: {
        title: 'Positive Number',
        regex: '^[0-9]*(\\.|)[0-9]*$',
    },
    NEG_NUM: {
        title: 'Negative Number',
        regex: '^-[0-9]*(\\.|)[0-9]*|0$',
    },
    EMAIL: {
        title: 'Email',
        regex: '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$',
    },
    PHONE: {
        title: 'Phone Number',
        regex: '^[2-9]\\d{2}-\\d{3}-\\d{4}$',
    },
};
