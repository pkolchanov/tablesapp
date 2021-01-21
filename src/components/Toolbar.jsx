import {observer} from "mobx-react";
import React from "react";
import {authStore} from "../stores/AuthStore";
import {fileBrowserStore} from "../stores/FileBrowserStore";
import {firebaseConfig} from "../helpers/firebaseConfig";
import LoginForm from "./LoginForm";
import '../styles/toolbar.css';
import {appStore, ModeEnum} from "../stores/AppStore";

@observer
class Toolbar extends React.Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
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
                    appStore.mode === ModeEnum.login &&
                    <LoginForm/>
                }

            </div>
        )
    }

    onClick() {
        appStore.changeMode(ModeEnum.login);
    }

    copySheetUrlToClipboard() {
        navigator.clipboard.writeText(`https://${firebaseConfig.authDomain}/${fileBrowserStore.currentSheetId}`)
    }
}

export default Toolbar;