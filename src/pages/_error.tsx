import React from 'react'
//import ErrorPage from 'next/error'
import { NextPageContext } from 'next'

type Props = {
    statusCode: number
}

type SSProps = {
    props: Props
}

export async function getStaticProps(ctx: NextPageContext): Promise<SSProps> {
    const { res, err } = ctx
    const statusCode = res ? res.statusCode : err ? err.statusCode ?? 404 : 404

    return {
        props: {
            statusCode: statusCode,
        },
    }
}

const ErrorPage = (props: Props) => {
    const { statusCode } = props
    return <>{statusCode}</>
}

export default ErrorPage
