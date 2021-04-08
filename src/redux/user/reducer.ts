import { ActionType } from './action'
import User from '../../interfaces/User'

const userInitialState: User = {
    username: 'anonymous',
    password: '',
}

export default function reducer(state = userInitialState, action: { type: string, user: User }) {
    switch (action.type) {
        case ActionType.UPDATE:
            console.log('Updating User')
            return Object.assign({}, state, action.user)
        default:
            return state
    }
}