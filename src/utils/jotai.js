import { atomWithStorage } from 'jotai/utils';

export const currentSessionData = atomWithStorage('currentSessionData', {
    captureStatus: '',
    array: '',
    project: '',
    site: '',
    handler: '',
    recorder: '',
    arthropod: [],
    amphibian: [],
    lizard: [],
    mammal: [],
    snake: [],
});

export const currentFormName = atomWithStorage('currentFormName', 'New Data');

export const pastSessionData = atomWithStorage('pastSessionData', []);

export const currentPageName = atomWithStorage('currentPageName', 'Home');

export const currentTableName = atomWithStorage('currentTableName', 'Turtle');

export const editingPrevious = atomWithStorage('editingPrevious', false);

export const pastEntryIndex = atomWithStorage('pastEntryIndex', -1);

export const notificationText = atomWithStorage('notificationText', '');

export const currentProjectName = atomWithStorage('currentProject', 'Gateway');

export const currentBatchSize = atomWithStorage('currentBatchSize', 15);

export const appMode = atomWithStorage('appMode', 'test');
