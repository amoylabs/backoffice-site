import Head from 'next/head'
import React from 'react'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

type Props = {
    meta: {
        title: string
        description?: string
        keywords?: string
    }
}

export default class HeadParts extends React.Component<Props> {
    render() {
        return (
            <Head>
                <title key="title">{this.props.meta.title}</title>
                {this.props.meta.description && <meta key="description" name="description" content={this.props.meta.description} />}
                {this.props.meta.keywords && <meta key="keywords" name="keywords" content={this.props.meta.keywords} />}
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
                    integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
                    crossOrigin="anonymous"
                />
                <link rel="preconnect" href={publicRuntimeConfig.API_URL}></link>
            </Head>
        )
    }
}
