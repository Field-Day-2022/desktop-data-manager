import pkg from '@eslint/js';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import globals from 'globals';

const { configs: eslintRecommended } = pkg;

export default [
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true, // Ensure JSX is enabled
                },
            },
            globals: {
                ...Object.keys(globals.browser).reduce((acc, key) => {
                    acc[key.trim()] = globals.browser[key]; // Trim whitespace from keys
                    return acc;
                }, {}),
            },
        },
        plugins: {
            react: reactRecommended, // Add React plugin to recognize JSX
        },
        ...eslintRecommended.recommended,
        ...reactRecommended,
        rules: {
            'no-unused-vars': [
                'warn',
                {
                    varsIgnorePattern: 'React', // Ignore React import in React 17+
                },
            ],
            'react/react-in-jsx-scope': 'off', // Disable the need for React to be in scope
            'react/jsx-uses-vars': 'error', // Ensure variables used in JSX are marked as used
        },
    },
];
