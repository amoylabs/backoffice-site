import React from 'react'
import { NextPageContext } from 'next'

type Props = {
    statusCode: number
}

function ErrorPage({ statusCode }: Props) {
    return <p>{statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}</p>
}

ErrorPage.getInitialProps = ({ res, err } : NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default ErrorPage
