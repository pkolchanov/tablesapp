import * as React from "react";
import '../styles/toggleSwitch.scss';

function ToggleSwitch(props) {
    return (
        <label className={`toggleSwitch ${props.className}`}>
            <input className="toggleSwitch__input" type="checkbox"
                   checked={props.checked} onChange={props.onChange}/>
            <span className="toggleSwitch__slider"/>
        </label>
    )
}

export default ToggleSwitch;