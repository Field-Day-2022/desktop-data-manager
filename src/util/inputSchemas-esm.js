/*
 * File: inputSchemas-esm.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Creates references for inputting different types of information.
 */

const TEXT_FIELD = {
    label: 'string',
    required: 'boolean',
};

const TEXT_AREA = {
    label: 'string',
    required: 'boolean',
};

const NUMBER = {
    label: 'string',
    required: 'boolean',
};

const RADIO_BUTTON = {
    label: 'string',
    required: 'boolean',
    options: [
        {
            label: 'string',
        },
    ],
};

const CHECK_BOXES = {
    label: 'string',
    required: 'boolean',
    options: [
        {
            label: 'string',
        },
    ],
};

const COMBO_BOXES = {
    label: 'string',
    required: 'boolean',
    options: [
        {
            label: 'string',
        },
    ],
};

const DATE = {
    label: 'string',
    required: 'boolean',
};

export const SCHEMAS = {
    TEXT_FIELD,
    TEXT_AREA,
    NUMBER,
    RADIO_BUTTON,
    CHECK_BOXES,
    COMBO_BOXES,
    DATE,
};

export const INPUT_TYPES = {
    TEXT_FIELD: 'Text Field',
    TEXT_AREA: 'Text Area',
    NUMBER: 'Number',
    RADIO_BUTTON: 'Radio Buttons',
    CHECK_BOXES: 'Check Boxes',
    COMBO_BOXES: 'Combo Box',
    DATE: 'Date',
};

export const PATTERN_OPTIONS = {
    AZ_2_3: '2 to 3 Letters',
    POS_NUM: 'Positive Number',
    NEG_NUM: 'Negative Number',
    EMAIL: 'Email',
    PHONE: 'Phone Number',
};

export const REGEX_OPTIONS = {
    AZ_2_3: '^[A-Za-z]{2,3}$',
    POS_NUM: '^[0-9]*(\\.|)[0-9]*$',
    NEG_NUM: '^-[0-9]*(\\.|)[0-9]*|0$',
    EMAIL: '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$',
    PHONE: '^[2-9]\\d{2}-\\d{3}-\\d{4}$',
};
