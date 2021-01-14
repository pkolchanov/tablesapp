import {observer} from "mobx-react";
import React from "react";
import {sheetStore} from "../stores/SheetStore";

@observer
class TextareaWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.recalcInputHeight = this.recalcInputHeight.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const current = this.inputRef.current;
        if (current) {
            this.recalcInputHeight();
            current.focus();
            const l = current.value.length;
            current.setSelectionRange(l, l);
        }
    }

    componentDidUpdate() {
        if (this.inputRef.current) {
            this.recalcInputHeight();
        }
    }

    render() {
        const [r, c] = this.props.coords;
        return (<textarea className="cell__input"
                          value={sheetStore.data[r][c]}
                          onChange={this.handleChange}
                          onKeyDown={this.recalcInputHeight}
                          ref={this.inputRef}
                          style={{width: this.props.width + 'px'}}/>)
    }

    recalcInputHeight() {
        const inputRef = this.inputRef.current;
        inputRef.style.height = "1px";
        inputRef.style.height = inputRef.scrollHeight + "px";
    }

    handleChange(event) {
        sheetStore.update(this.props.coords, event.target.value);
    }
}

export default TextareaWrapper;