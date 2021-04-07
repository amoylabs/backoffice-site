import { combineReducers } from 'redux'
import user from './user'

/**
 * PLEASE READ!!!
 *
 * You don't *have* to store your state in redux! In fact, most common state should not be put here, but instead be left
 * in the regular React state (for example UI state like checking a checkbox!)
 *
 * This is for *GLOBAL* state (i.e. state that spans all pages of the site). You should think carefully about whether
 * your state additions should be done here.
**/
const rootReducer = combineReducers({
    user,
})

export default rootReducer
