import { NextPageContext } from 'next'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const ALLOW_TEXT = `Sitemap: ${publicRuntimeConfig.CANONICAL_URL}/sitemap.xml
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

export async function getServerSideProps(ctx: NextPageContext) {
    ctx.res?.setHeader('Content-Type', 'text-plain')
    if (publicRuntimeConfig.ALLOW_CRAWL) {
        ctx.res?.end(ALLOW_TEXT)
    } else {
        ctx.res?.end(DISALLOW_TEXT)
    }

    return {
        props: {}
    }
}

const RobotsTxtPage = () => {
    return null
}

export default RobotsTxtPage