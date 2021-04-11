import React from 'react'

import HeadParts from '../global/HeadParts'

export type Props = {
    meta: {
        title: string
        description?: string
        keywords?: string
    }
}

export default class RootLayout extends React.Component<Props> {
    render() {
        return (
            <>
                <HeadParts {...this.props} />
                {/* <Header /> */}
                {this.props.children}
                {/* <Footer /> */}
            </>
        )
    }
}
