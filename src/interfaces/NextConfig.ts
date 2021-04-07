export interface PublicRuntimeConfig {
    CLOUDFRONT_SERVER: string
}

export interface ServerRuntimeConfig {}

export interface NextConfig {
    publicRuntimeConfig: PublicRuntimeConfig
    serverRuntimeConfig: ServerRuntimeConfig
}
