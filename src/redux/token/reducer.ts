import { ActionType } from './action'
import Token from '../../interfaces/Token'

const tokenInitialState: Token = {
    access: '',
    refresh: '',
}

export default function reducer(state = tokenInitialState, action: { type: string, token: Token }) {
    switch (action.type) {
        case ActionType.UPDATE:
            console.log('Updating Token')
            return Object.assign({}, state, action.token)
        default:
            return state
    }
}