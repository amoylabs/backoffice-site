const withImages = require('next-images')
const withPlugins = require('next-compose-plugins')
const optimizedImages = require('next-optimized-images')
const runtimeConfig = require('./runtimeConfig')

// Establish external asset directory if necessary
const assetPrefix = process.env.ASSET_PREFIX || ''

module.exports = withPlugins([[optimizedImages, {}]])

module.exports = withImages({
    assetPrefix: assetPrefix,
    publicRuntimeConfig: runtimeConfig.publicRuntimeConfig,
    serverRuntimeConfig: runtimeConfig.serverRuntimeConfig,
    webpack: function (cfg) {
        if (cfg.target === 'node') {
            cfg.node = {
                __dirname: false, // provide dirname for compiled files
            }
        }

        return cfg
    },
    future: {
        webpack5: true,
    },
})
