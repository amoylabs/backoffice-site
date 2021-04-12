import crypto from 'crypto'
import { NextPageContext } from 'next'
import getConfig from 'next/config'
import axios from 'axios'

import React, { useState } from 'react'
import { bindActionCreators, Dispatch, Action } from 'redux'
import { connect } from 'react-redux'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

import RootLayout, { Props as RootLayoutProps } from '../../components/layouts/RootLayout'
import { updateToken } from '../../redux/token/action'
import State from '../../interfaces/State'

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

type Props = RootLayoutProps & {
    token: string
    updateToken: typeof updateToken
}

export async function getServerSideProps(_ctx: NextPageContext) {
    const hash = crypto.createHmac('sha256', serverRuntimeConfig.APP_SIGNING_KEY)
    const signature = hash.update(serverRuntimeConfig.APP_ID).digest('base64')
    const { data: token } = await axios.request<string>({
        url: `${publicRuntimeConfig.API_URL}/v1/auth/app/${serverRuntimeConfig.APP_ID}`,
        method: 'POST',
        headers: {
            hmac: signature,
        },
    })

    return {
        props: {
            meta: {
                title: "Auth Test",
            },
            token
        }
    }
}

const TestAuthPage = (props: Props) => {
    const [ name, setName ] = useState("")
    const [ pwd, setPwd ] = useState("")
    const [ userToken, setUserToken ] = useState("")

    const handleNameInput = (e : any) => {
        setName(e.target.value)
    }

    const handlePasswordInput = (e : any) => {
        setPwd(e.target.value)
    }

    const handleBtnClick = async (e: any) => {
        e.preventDefault()

        try {
            const { data: token } = await axios.post<string>(`${publicRuntimeConfig.API_URL}/v1/auth/user`, {
                un: name,
                pd: Buffer.from(pwd, 'utf-8').toString("base64"),
            })

            setUserToken(token)
        } catch (err) {
            console.log(err.response?.data?.errorMessages)
        }
    }

    return (
        <RootLayout {...props}>
            <Container>
                <Row>
                    <Col><pre>{props.token}</pre></Col>
                </Row>

                <Row>
                    <Col><pre>{userToken}</pre></Col>
                </Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="userName">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="userName" placeholder="User Name" value={name} onChange={handleNameInput} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={pwd} onChange={handlePasswordInput} />
                    </Form.Group>
                </Form.Row>

                <Row>
                    <Col md={6}><Button onClick={handleBtnClick}>Sign App</Button></Col>
                </Row>
            </Container>
        </RootLayout>
    )
}

const mapDispatchToProps = (dispatch: Dispatch<Action<State>>) => {
    return {
        updateUser: bindActionCreators(updateToken, dispatch),
    }
}

export default connect(null, mapDispatchToProps)(TestAuthPage)
