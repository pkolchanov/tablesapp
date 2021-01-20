import {observer} from "mobx-react";
import React from "react";
import {authStore} from "../stores/AuthStore";
import '../styles/loiginForm.css';

@observer
class LoginForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='loginForm'>
                <div>Log in to sync your content</div>
                <input type="text"
                       onChange={this.onChange}
                       value={authStore.enteredEmail}
                       className="loginForm__emailInput"
                       placeholder="Email"
                />
                <button onClick={() => authStore.login()}>Do it</button>
                <div>If you don’t have an account we will create one.</div>
            </div>
        )
    }

    onChange(e) {
        authStore.setEmail(e.target.value)
    }
}

export default LoginForm;