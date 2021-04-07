module.exports = (api) => {
    const config = {
        presets: [
            [
                'next/babel',
                {
                    'preset-env': {
                        targets: {
                            ie: 9,
                        },
                    },
                },
            ],
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
            'lodash',
            ['styled-components', { displayName: !api.env('production'), ssr: true }],
        ],
    }

    if (api.env('production')) {
        config.plugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }])
    } else {
        config.plugins.push('console')
    }

    return config
}
