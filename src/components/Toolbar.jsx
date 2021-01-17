import {observer} from "mobx-react";
import React from "react";
import '../styles/toolbar.css';

@observer
class Toolbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='toolbar'>
               Hello, kitty
            </div>
        )
    }
}

export default Toolbar;