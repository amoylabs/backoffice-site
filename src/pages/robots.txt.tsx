import { NextPageContext } from 'next'
import getConfig from 'next/config'
import React from 'react'

const { publicRuntimeConfig } = getConfig()

const ALLOW_TEXT = `Sitemap: ${publicRuntimeConfig.CANONICAL_URL}/api/sitemap.xml
User-agent: *
Disallow: /catalogsearch/
`

const DISALLOW_TEXT = `User-agent: web-ceo
Disallow:

User-agent: Mediapartners-Google
Disallow:

User-agent: *
Disallow: /
`

export default class RobotsTxt extends React.Component {
    static getInitialProps(ctx: NextPageContext) {
        ctx.res?.setHeader('Content-Type', 'text-plain')

        if (publicRuntimeConfig.ALLOW_CRAWL) {
            ctx.res?.end(ALLOW_TEXT)
        } else {
            ctx.res?.end(DISALLOW_TEXT)
        }

        return {}
    }

    render() {
        return null
    }
}
