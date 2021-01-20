import {observer} from "mobx-react";
import React from "react";
import {authStore} from "../stores/AuthStore";
import {makeObservable, observable} from "mobx";
import {fileBrowserStore} from "../stores/FileBrowserStore";
import {firebaseConfig} from "../helpers/firebaseConfig";
import LoginForm from "./LoginForm";
import '../styles/toolbar.css';

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
                {
                    authStore.loggedUser &&
                    <div className='toolbar__shared' onClick={this.copySheetUrlToClipboard}>Table shared ✓</div>
                }
                {
                    !authStore.loggedUser &&
                    <a className='toolbar__share' onClick={this.onClick}>Share</a>
                }
                {
                    this.showLoginPopup &&
                    !authStore.loggedUser &&
                    <LoginForm/>
                }

            </div>
        )
    }

    onClick() {
        this.showLoginPopup = !this.showLoginPopup;
    }

    copySheetUrlToClipboard() {
        navigator.clipboard.writeText(`https://${firebaseConfig.authDomain}/${fileBrowserStore.currentSheetId}`)
    }
}

export default Toolbar;