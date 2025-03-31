export default {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    extensionsToTreatAsEsm: ['.jsx'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
    moduleDirectories: ['node_modules', '<rootDir>/src'],
};
