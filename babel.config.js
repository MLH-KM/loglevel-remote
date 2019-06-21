module.exports = {
    plugins: [
        '@babel/plugin-proposal-class-properties',
        ['transform-remove-console', { exclude: ['error', 'warn', 'debug'] }],
        [
            'minify-replace',
            {
                replacements: [
                    {
                        identifierName: '__VERSION__',
                        replacement: {
                            type: 'stringLiteral',
                            value: require('./package.json').version
                        }
                    }
                ]
            }
        ]
    ],
    presets: [
        // 'minify',
        [
            '@babel/env',
            {
                targets: {
                    edge: '17',
                    firefox: '60',
                    chrome: '67',
                    ie: '11',
                    safari: '11.1'
                },
                useBuiltIns: 'usage',
                corejs: { version: 3 }
            }
        ]
    ]
};
