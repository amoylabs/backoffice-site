import { createStore, applyMiddleware, combineReducers, Middleware } from 'redux'
import { createWrapper, MakeStore } from 'next-redux-wrapper'
import { persistStore, persistReducer } from 'redux-persist'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { composeWithDevTools as composeWithDevTools4Production } from 'redux-devtools-extension/logOnlyInProduction'
import logger from 'redux-logger'
// import storage from 'redux-persist/lib/storage'
import storageSession from 'redux-persist/lib/storage/session'

import State from '../interfaces/State'
import user from './user/reducer'
import token from './token/reducer'

const isProduction = process.env.NODE_ENV === 'production'

const bindMiddleware = (middleware: Middleware[]) => {
    if (isProduction) {
        return composeWithDevTools4Production(applyMiddleware(...middleware))
    }

    return composeWithDevTools(applyMiddleware(logger, ...middleware))
}

const combinedReducer = combineReducers({
    user,
    token,
})

// create a makeStore function
const makeStore: MakeStore<State> = () => {
    if (typeof window === 'undefined') {
        // If it's on server side, create a store
        return createStore(combinedReducer, bindMiddleware([thunkMiddleware]))
    } else {
        // If it's on client side, create a store which will persist
        const persistConfig = {
            key: '_foobar',
            whitelist: ['user', 'token'], // adding reducers which will be persisted
            storage: storageSession, // if needed, use a safer storage
        }

        // Create a new reducer with our existing reducer
        const persistedReducer = persistReducer(persistConfig, combinedReducer)
        // Creating the store again
        const store = createStore(persistedReducer, bindMiddleware([thunkMiddleware])) as any
        // This creates a persistor object & push that persisted object to .__persistor
        // So that we can avail the persistability feature
        store.__persistor = persistStore(store)

        return store
    }
}

// export an assembled wrapper
export const wrapper = createWrapper<State>(makeStore, { debug: !isProduction })
