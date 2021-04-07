import _ from 'lodash'
import { createStore } from 'redux'
import { MakeStore, createWrapper, Context } from 'next-redux-wrapper'
import reducers from './reducers'

export const loadState = () => {
    try {
        const serializedState = sessionStorage.getItem('state')
        if (serializedState === null) {
            return undefined
        }
        return JSON.parse(serializedState)
    } catch (err) {
        return undefined
    }
}

export const saveState = (state: any) => {
    try {
        const serializedState = JSON.stringify(state)
        sessionStorage.setItem('state', serializedState)
    } catch {
        // ignore write errors
    }
}

function handleChange() {
    let currentState = store.getState()
    saveState(currentState)
    console.log('Saved State')
    // console.log(loadState())
}

const store = createStore(reducers, loadState())
store.subscribe(_.throttle(handleChange))

export interface State {
    tick: string
}

// create a makeStore function
const makeStore: MakeStore<State> = (_context: Context) => createStore(reducers, loadState())

// export an assembled wrapper
export const wrapper = createWrapper<State>(makeStore, { debug: true })

export default store
