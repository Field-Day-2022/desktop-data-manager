/*
 * File: inputSchemas-cjs.js
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

module.exports.SCHEMAS = {
    TEXT_FIELD,
    TEXT_AREA,
    NUMBER,
    RADIO_BUTTON,
    CHECK_BOXES,
    COMBO_BOXES,
    DATE,
};

module.exports.INPUT_TYPES = {
    TEXT_FIELD: 'Text Field',
    TEXT_AREA: 'Text Area',
    NUMBER: 'Number',
    RADIO_BUTTON: 'Radio Buttons',
    CHECK_BOXES: 'Check Boxes',
    COMBO_BOXES: 'Combo Box',
    DATE: 'Date',
};
