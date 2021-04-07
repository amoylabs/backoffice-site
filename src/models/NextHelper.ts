import { NextPageContext } from 'next'
import Router from 'next/router'
import qs from 'qs'
import * as URI from 'uri-js'

export function parseQuery(ctx: NextPageContext) {
    return qs.parse(URI.parse(ctx.asPath ?? '').query ?? '', { allowDots: true })
}

export function redirectKeepQuery(ctx: NextPageContext, path: string, code: 301 | 302 | 307 = 302) {
    const newLocation = URI.serialize({
        ...URI.parse(ctx.asPath ?? ''),
        path: path,
    })
    // console.log("New location")
    // console.log(newLocation)
    if (ctx.res) {
        ctx.res.writeHead(code, {
            Location: newLocation,
        })
        ctx.res.end()
    } else {
        Router.push(newLocation)
    }
}

export function redirect(ctx: NextPageContext, url: string, code: 301 | 302 | 307 = 302) {
    if (ctx.res) {
        ctx.res.writeHead(code, {
            Location: url,
        })
        ctx.res.end()
    } else {
        Router.push(url)
    }
}

export function isServer() {
    return typeof window === 'undefined'
}
