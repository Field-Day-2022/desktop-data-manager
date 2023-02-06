/*
 * File: entryBuilder.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Creates a datatable which imports mock-data.
 */

import mock from 'mock-data';

const typeGenerators = {
    SHORT_TEXT: mock.string(10, 30, 'aA'),
    LONG_TEXT: mock.string(20, 100, 'aA'),
    NUMBER: mock.integer(0, 9999),
    COUNTER: mock.integer(0, 100),
    CHECKBOX: mock.string(1, 10, 'aA'),
    COMBO_BOX: mock.string(1, 10, 'aA'),
    DATE: mock.date(2010, 2018, 'YYYY-MM-DD HH:MM', false),
};

export const generateDataFormRows = (fields, rows) => generateRows(fields, rows);

const generateRows = (fields, rows) => {
    const dataRows = [];

    for (let i = 0; i < rows; i++) {
        const row = {};

        fields.forEach((field) => {
            row[field.prompt] = typeGenerators[field.type].generate();
        });

        dataRows.push(row);
    }

    return dataRows;
};
