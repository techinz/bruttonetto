module.exports = {
    input: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.test.{js,jsx,ts,tsx}',
        '!src/**/*.spec.{js,jsx,ts,tsx}',
        '!**/node_modules/**',
    ],
    output: './src/i18n/translations/',
    options: {
        debug: true,
        removeUnusedKeys: false,
        sort: true,
        func: {
            list: ['t'],
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        lngs: ['de', 'en', 'ru', 'uk'],
        defaultLng: 'de',
        defaultNs: 'translation',
        resource: {
            loadPath: '{{lng}}.json',
            savePath: '{{lng}}.json',
            jsonIndent: 2,
            lineEnding: '\n'
        },
        keySeparator: false,
        nsSeparator: false,
    }
};