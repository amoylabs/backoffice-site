import User from '../../interfaces/User'

export enum ActionType {
    UPDATE_USER = 'UPDATE_USER',
}

export function updateUser(user: User) {
    return { type: ActionType.UPDATE_USER, user: user }
}
