/***

Primary connector to API.  Sets up an AXIOS authenticated instance with API server that can
be used for all requests to the api.  Requests are either made on behalf of the application, or on
behalf of the user. ( That is, all api endpoints are assummed to be restricted.  Requests for the app are
authorized for the app to make, while requests on behalf of the user are typically limited to personal data
endpoints, and authorized only for that users private data.)

There are three areas of concern:

API Connection from server
- The authentication step is ONLY taken on the server side of the request in order to protect the
authentication signingKey from exposure on the client.  It is up to the client to obtain the resultant
jwt to establish the client Connection

API Connection from Client
- Setup the axios instance with a given JWT.  Client does not do authentication on its own in order to protect
the signingKey

Anonymous User Connection
- Setup or re-establish a connector for the user. The user connector will be used for all requests pertaining to user
specific data

Usage:

For both server and client, for the basic app connector, use static async function ApiConnector.connector() to get
the axios instance.  The JWT is exposed in getJWT(), but only on the server.  The client has the burden of
invoking setJWT(), without which the connector will never be established.

For the user connector, much like the client connector, it is necessary for something to set the userJWT to fully setup
the connector.  Thus, anything waiting on the promise of the user connector will block until setUserJwt() is invoked.  A
function createAnonymousUser() is provided for the construction of an anonymous user, but it is expected that a central
controller will decide to initialize the user JWT with either a new user or a user in session

***/

import crypto from 'crypto'
import getConfig from 'next/config'
import axios, { AxiosInstance } from 'axios'
import { isServer } from './NextHelper'

const { publicRuntimeConfig } = getConfig()

type ApiUserResponse = { access_token?: string } | undefined

type SignOptions = {
    signingKey: string
    url: string
    body: any
}

export default class ApiConnector {
    private static _instance: ApiConnector
    private connectorPromise: Promise<AxiosInstance>
    private axios: AxiosInstance | undefined
    private jwt: string
    private userJWT: string

    private userConnectorPromise: Promise<AxiosInstance>
    private userAxios: AxiosInstance | undefined

    private constructor() {
        this.jwt = ''
        this.userJWT = ''
        if (isServer()) {
            this.connectorPromise = this.establishServerUser()
            this.userConnectorPromise = Promise.resolve(axios)
            this.refreshToken() // kick off the token refresh
        } else {
            this.connectorPromise = this.establishClientUser()
            this.userConnectorPromise = this.establishAnonymousUser()
        }
    }

    // Refresh the the token periodically, hopefully before it expires
    private refreshToken() {
        const refreshInternal = parseInt('serverRuntimeConfig.API_TOKEN_REFRESH_INTERVAL_HOURS') * 1000 * 60 * 60
        const runRefresh = () => {
            this.connectorPromise = this.establishServerUser()
        }
        setInterval(runRefresh, refreshInternal)
    }

    private genSignature({ signingKey, url, body }: SignOptions): string {
        const hash = crypto.createHmac('sha1', signingKey)

        hash.update(url)
        hash.update(body)

        let signature = hash.digest('base64')
        //get rid of '=' padding on both
        signature = signature.replace('=', '')

        return signature
    }

    public setJWT(jwt: string) {
        if (!isServer()) {
            throw new Error(`${jwt} should not be set yet`)
        }
    }

    private async establishClientUser(): Promise<AxiosInstance> {
        return new Promise<AxiosInstance>((resolve) => {
            this.setJWT = (jwt: string) => {
                if (this.axios) {
                    resolve(this.axios)
                }

                this.axios = axios.create({
                    baseURL: publicRuntimeConfig.API_URL,
                    headers: {
                        authorization: `Bearer ${jwt}`,
                    },
                })

                resolve(this.axios)
            }
        })
    }

    private async establishServerUser(): Promise<AxiosInstance> {
        const signature = this.genSignature({
            signingKey: 'serverRuntimeConfig.API_SIGNING_KEY',
            url: `/auth/login?authId=serverRuntimeConfig.API_AUTH_ID`,
            body: '',
        })

        const { data: user } = await axios.request<ApiUserResponse>({
            url: `${publicRuntimeConfig.API_URL}/auth/login`,
            method: 'POST',
            headers: {
                hmac: signature,
            },
            params: {
                authId: 'serverRuntimeConfig.API_AUTH_ID',
            },
        })

        if (user?.access_token == null) {
            throw new Error('Bad response from login')
        }

        this.jwt = user.access_token

        return axios.create({
            baseURL: publicRuntimeConfig.API_URL,
            headers: {
                authorization: `Bearer ${this.jwt}`,
            },
        })
    }

    // Get the JWT of the server connection.  Waits for server connection.  Only available on server
    async getJWT(): Promise<string> {
        if (!isServer()) {
            throw new Error('Cannot Get JWT on Client')
        }
        await this.connectorPromise
        return this.jwt
    }

    public async createAnonymousUser(): Promise<any> {
        if (isServer()) {
            throw new Error('Cannot Create Anonymous User from Server')
        }
        const connector = await ApiConnector.connector()
        const { data: user } = await connector.post('/auth/register/anonymous')
        return user
    }

    // Given an AppId and a Nonce, establish the *user* connection as the user associated
    // with this application.
    //
    // Depends on having and established api connector()
    // @return a promise to the user
    public async loginUserWithAppNonce(appId: string, nonce: string): Promise<any> {
        const connector = await ApiConnector.connector()
        const { data: user } = await connector.get(`/user/forApp/${appId}?nonce=${nonce}`)
        return user
    }

    public setUserJWT(jwt: string) {
        if (!isServer()) {
            throw new Error(`${jwt} should not be set yet`)
        }
    }

    private async establishAnonymousUser(): Promise<AxiosInstance> {
        return new Promise<AxiosInstance>((resolve) => {
            this.setUserJWT = (jwt: string) => {
                if (this.userAxios && this.userJWT === jwt) {
                    resolve(this.userAxios)
                }

                this.userJWT = jwt
                this.userAxios = axios.create({
                    baseURL: publicRuntimeConfig.API_URL,
                    headers: {
                        authorization: `Bearer ${jwt}`,
                    },
                })

                resolve(this.userAxios)
            }
        })
    }

    static async userConnector(): Promise<AxiosInstance> {
        return ApiConnector.instance().userConnectorPromise
    }

    static async connector(): Promise<AxiosInstance> {
        return ApiConnector.instance().connectorPromise
    }

    static instance(): ApiConnector {
        if (ApiConnector._instance == null) {
            ApiConnector._instance = new ApiConnector()
        }
        return ApiConnector._instance
    }
}
