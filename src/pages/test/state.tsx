import React from 'react'
import { bindActionCreators, Dispatch, Action } from 'redux'
import { connect } from 'react-redux'
import { updateUser } from '../../redux/user/action'
import State from '../../interfaces/State'

type Props = {
    username: string
    updateUser: typeof updateUser
}

const TestStatePage = (props: Props) => {
    const handleBtnClick = (e: any) => {
        e.preventDefault()
        props.updateUser({
            username: "helloworld",
            password: "n/a",
        })
    }

    return <div>
        <h3>{props.username}</h3>
        <button onClick={handleBtnClick}>Update User State</button>
    </div>
}


const mapStateToProps = (state: State) => ({
    username: state.user.username,
})

const mapDispatchToProps = (dispatch: Dispatch<Action<State>>) => {
    return {
        updateUser: bindActionCreators(updateUser, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TestStatePage)
