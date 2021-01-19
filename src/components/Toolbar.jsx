import {observer} from "mobx-react";
import React from "react";
import '../styles/toolbar.css';
import {authStore} from "../stores/AuthStore";
import {makeObservable, observable} from "mobx";

@observer
class Toolbar extends React.Component {
    @observable
    showLoginPopup = false;

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        makeObservable(this);
    }

    render() {
        return (
            <div className='toolbar'>
                <a className='toolbar__share' onClick={this.onClick}>Share</a>
                {
                    this.showLoginPopup &&
                    <div className='toolbar__loginPopup'>
                        <input type="text"
                               onChange={this.onChange}
                               value={authStore.enteredEmail}/>
                        <button onClick={() => authStore.login()}>Do it</button>
                    </div>
                }
                {
                    authStore.loggedUser &&
                    <div>{authStore.loggedUser.uid}</div>
                }
            </div>
        )
    }

    onClick() {
        if (!authStore.enteredEmail) {
            this.showLoginPopup = true;
        }
    }

    onChange(e) {
        authStore.setEmail(e.target.value)
    }
}

export default Toolbar;