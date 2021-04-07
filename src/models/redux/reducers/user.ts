import User from '../../../interfaces/User'

const userReducer = (state: User | null = null, action: { type: string, user: User }) => {
    switch (action.type) {
        case 'UPDATE_USER':
            console.log('Updating User')
            return Object.assign({}, state, action.user)
        default:
            return state
    }
}

export default userReducer
