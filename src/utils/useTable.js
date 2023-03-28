import { useCallback } from 'react';
import { keyLabelMap, TABLE_LABELS } from '../const/tableLabels';

export const useTable = () => {
    const getLabels = useCallback(
        (keys) => {
            return keys.map((key) => keyLabelMap[key]);
        }
    );

    const getKeys = useCallback(
        (tableName) => {
            return TABLE_LABELS[tableName].map((label) => getKey(label));
        }
    );

    const getKey = useCallback(
        (label) => {
            return Object.keys(keyLabelMap).find((key) => keyLabelMap[key] === label);
        }
    );

    const getLabel = useCallback(
        (key) => {
            return keyLabelMap[key];
        }
    );

    const getEntryValue = useCallback(
        // If there is no value return 'N/A'
        // Allow the user to pass in a key or a label
        (entry, keyOrLabel) => {
            const key = keyLabelMap[keyOrLabel] ? getKey(keyOrLabel) : keyOrLabel;
            return entry[key] ? entry[key] : 'N/A';
        }
    );

    return { getLabels, getKeys, getKey, getLabel, getEntryValue };
}