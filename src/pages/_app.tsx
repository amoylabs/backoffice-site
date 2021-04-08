import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import getConfig from 'next/config'
import { wrapper } from '../redux/store'
import '../styles/global.css'

const { publicRuntimeConfig } = getConfig()

type AppProps = {
    meta?: {
        canonicalPath?: string
    }
}

class MyApp extends App<AppProps> {
    render() {
        const { Component, pageProps, router } = this.props
        let canonicalHref = publicRuntimeConfig.CANONICAL_URL

        if (pageProps?.meta?.canonicalPath != null) {
            canonicalHref += pageProps.meta.canonicalPath
        } else {
            canonicalHref += router.pathname
        }

        return (
            <>
                <Head>
                    <link rel="canonical" href={canonicalHref} key="canonical" />
                </Head>
                <Component {...pageProps} />
            </>
        )
    }
}

export default wrapper.withRedux(MyApp)
