import React from "react";
import {observer} from "mobx-react";
import {sheetStore} from "../stores/SheetStore";

@observer
class Sheet extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
            </div>
        );
    }
}

export default Sheet;