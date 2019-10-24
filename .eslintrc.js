module.exports = {
    parser: 'babel-eslint',
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:promise/recommended'
    ],
    env: {
        browser: true
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    globals: {
        __VERSION__: true
    }
};
