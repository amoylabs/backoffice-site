import _ from 'lodash'
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'
import getConfig from 'next/config'
import { redirectKeepQuery } from '../models/NextHelper'
const { publicRuntimeConfig } = getConfig()

export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        // redirect http to https. We may need to consider using a custom server (e.g. https://github.com/zeit/next.js/tree/canary/examples/custom-server-koa)
        // with true middleware if our middleware layer gets more complex.
        const { req, res, query } = ctx
        if (publicRuntimeConfig.HTTPS_ENABLED && req != null && res != null) {
            let protocol = req.headers['x-forwarded-proto'] // use header to determine if we're using https because we'll always be behind a proxy when using EBS
            let host = req.headers['host']
            if (protocol !== 'https') {
                res.writeHead(301, {
                    Location: `https://${host}${req.url}`,
                })
                res.end()
                return MyDocument.emptyPage()
            }
        }

        const path = ctx.asPath?.split('?')?.[0] || '' // split off query string (if any)
        // if the path ends with a trailing slash and didn't resolve, we need to try without a trailing slash
        if (path.length > 1 && path.endsWith('/')) {
            redirectKeepQuery(ctx, path.replace(/\/$/, ''), 301)
            return MyDocument.emptyPage()
        }

        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
                })

            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally {
            sheet.seal()
        }
    }

    static emptyPage(): DocumentInitialProps {
        return { html: '' }
    }

    render() {
        return (
            <Html lang="en">
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
