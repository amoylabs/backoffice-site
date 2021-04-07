import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { Provider } from 'react-redux'
import getConfig from 'next/config'
import store, { wrapper } from '../models/redux/store'
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
            <Provider store={store}>
                <Head>
                    <link rel="canonical" href={canonicalHref} key="canonical" />
                </Head>
                <Component {...pageProps} />
            </Provider>
        )
    }
}

export default wrapper.withRedux(MyApp)
