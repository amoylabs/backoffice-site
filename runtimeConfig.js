/***
 * Environment variable configuration. These are here rather than directly in next.config.js
 * because we need to extract type information from them in types/next-config.d.ts.
 */
exports.publicRuntimeConfig = {
    API_URL: process.env.API_URL || 'http://localhost:8080',
    CANONICAL_URL: process.env.CANONICAL_URL || 'http://localhost:3000',
    HTTPS_ENABLED: process.env.HTTPS_ENABLED != null,
    ALLOW_CRAWL: process.env.ALLOW_CRAWL != null,
}

exports.serverRuntimeConfig = {
    API_ID: process.env.API_ID || 'bo-site',
}
