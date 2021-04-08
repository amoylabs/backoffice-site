import { Dispatch, Action } from 'redux'
import Token from '../../interfaces/Token'

export enum ActionType {
    UPDATE = 'UPDATE',
}

export const updateToken = (token: Token) => (dispatch: Dispatch<Action>) => {
    return dispatch({ type: ActionType.UPDATE, token })
}