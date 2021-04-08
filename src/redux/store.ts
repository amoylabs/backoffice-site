import _ from 'lodash'
import { createStore, applyMiddleware, combineReducers, Middleware } from 'redux'
import { HYDRATE, createWrapper, MakeStore, Context } from 'next-redux-wrapper'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { composeWithDevTools as composeWithDevTools4Production } from 'redux-devtools-extension/logOnlyInProduction'
import user from './user/reducer'
import token from './token/reducer'

const STATE_KEY = '__state'

const loadState = () => {
    try {
        const serializedState = sessionStorage.getItem(STATE_KEY)
        if (serializedState === null) {
            return undefined
        }
        return JSON.parse(serializedState)
    } catch (err) {
        return undefined
    }
}

const saveState = (state: any) => {
    try {
        const serializedState = JSON.stringify(state)
        sessionStorage.setItem(STATE_KEY, serializedState)
    } catch {
        // ignore write errors
    }
}

const isProduction = process.env.NODE_ENV === 'production'

const bindMiddleware = (middleware: Middleware[]) => {
    if (isProduction) {
        return composeWithDevTools4Production(applyMiddleware(...middleware))
    }

    return composeWithDevTools(applyMiddleware(...middleware))
}

const combinedReducer = combineReducers({
    user,
    token,
})

const reducer = (state: any, action: any) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        }

        return nextState
    } else {
        return combinedReducer(state, action)
    }
}

const store = createStore(reducer, loadState(), bindMiddleware([thunkMiddleware]))

function handleStoreChange() {
    const currentState = store.getState()
    saveState(currentState)
}
store.subscribe(_.throttle(handleStoreChange))

export interface State {
    tick: string
}

// create a makeStore function
const makeStore: MakeStore<State> = (_context: Context) => store

// export an assembled wrapper
export const wrapper = createWrapper<State>(makeStore, { debug: !isProduction })