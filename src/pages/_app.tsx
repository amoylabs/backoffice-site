import App from 'next/app'
import Head from 'next/head'
import getConfig from 'next/config'
import React from 'react'
import { Spinner } from 'react-bootstrap'
import { ReactReduxContext } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
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
            <ReactReduxContext.Consumer>
                {({ store }: any) =>
                    <PersistGate persistor={store.__persistor} loading={<Spinner animation="border" variant="info" />}>
                        <Head>
                            <link rel="canonical" href={canonicalHref} key="canonical" />
                        </Head>
                        <Component {...pageProps} />
                    </PersistGate>
                }
            </ReactReduxContext.Consumer>
        )
    }
}

export default wrapper.withRedux(MyApp)