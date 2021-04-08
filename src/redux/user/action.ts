import { Dispatch, Action } from 'redux'
import User from '../../interfaces/User'

export enum ActionType {
    UPDATE = 'UPDATE',
}

export const updateUser = (user: User) => (dispatch: Dispatch<Action>) => {
    return dispatch({ type: ActionType.UPDATE, user })
}