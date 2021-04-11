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
    APP_ID: process.env.APP_ID || '2db99191-2143-4b20-9833-a79c1dc0dbfb',
    APP_SIGNING_KEY: process.env.APP_SIGNING_KEY || 'hxC8gCHoGHUH5ajzugTPyGfw5gHutxEJtLnyZbdti4ctfejPpB',
}
