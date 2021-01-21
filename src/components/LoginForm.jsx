import {observer} from "mobx-react";
import React from "react";
import {authStore} from "../stores/AuthStore";
import '../styles/loiginForm.css';
import arrowRightCircle from '../icons/arrowRightCircle.svg';
import spinner from '../icons/spinner.svg';

@observer
class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        const current = this.inputRef.current;
        if (current) {
            current.focus();
        }
    }

    render() {
        return (
            <div className='loginForm'>
                {
                    !authStore.loggedUser &&
                    !authStore.emailForSignIn &&
                    <div className="loginForm__firstStep">
                        <div className="loginForm__header">Log in to sync your content</div>
                        <div className='loginForm__email'>
                            <input type="text"
                                   onChange={this.onChange}
                                   value={authStore.enteredEmail}
                                   className="loginForm__emailInput"
                                   placeholder="Enter your email address..."
                                   ref={this.inputRef}
                            />
                            {
                                !authStore.isPending &&
                                <div className="loginForm__loginButton" onClick={() => authStore.login()}>
                                    <svg
                                        className={`loginForm__loginIcon ${!authStore.enteredEmail ? 'loginForm__loginIcon_inactive' : ''}`}>
                                        <use xlinkHref="#arrowRightCircle"></use>
                                    </svg>
                                </div>
                            }
                            {
                                authStore.isPending &&
                                <div className="loginForm__spinnerWrapper">
                                    <svg
                                        className={`loginForm__loginIcon`}>
                                        <use xlinkHref="#spinner"></use>
                                    </svg>
                                </div>
                            }
                        </div>
                        {
                            !!authStore.authError &&
                            <div className="loginForm__error">
                                {authStore.authError['message']}
                            </div>
                        }
                        <div className="loginForm__caption">If you don’t have an account we will create one.</div>
                    </div>
                }
                {
                    authStore.emailForSignIn &&
                    !authStore.magicLink &&
                    <div className="loginForm__secondStep">
                        <div className="loginForm__checkMailbox">Check your mailbox</div>
                        <div className="loginForm__caption loginForm__caption_extraPadding">
                            {`Magic link sent to ${authStore.emailForSignIn}`}
                            <span className="loginForm__reset" onClick={() => authStore.resetEmailForSignIn()}> Use different address</span>
                        </div>
                    </div>
                }
                {
                    authStore.magicLink &&
                    authStore.isPending &&
                    <div className="loginForm__thirdStep">
                        <div className={"loginForm__centeredSpinner"}>
                            <svg
                                className={`loginForm__loginIcon`}>
                                <use xlinkHref="#spinner"></use>
                            </svg>
                        </div>
                    </div>
                }
                {
                    authStore.loggedUser &&
                    <div className="loginForm__thirdStep loginForm__centeredSpinner">
                        ✓ Successfully logged in using {authStore.loggedUser.email}
                    </div>
                }
            </div>
        )
    }

    onChange(e) {
        authStore.setEmail(e.target.value)
    }

}

export default LoginForm;