type ThenArg<T> = T extends Promise<infer U> ? U : T // "Unwrap" promise type
type MyRuntimeConfig = ThenArg<typeof import('../runtimeConfig')>
type Config = {
	publicRuntimeConfig: MyRuntimeConfig['publicRuntimeConfig']
	serverRuntimeConfig: MyRuntimeConfig['serverRuntimeConfig']
}

declare module 'next/config' {
	export default function(): Config
}