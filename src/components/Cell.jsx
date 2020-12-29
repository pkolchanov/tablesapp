import {observer} from "mobx-react";

@observer
class Cell extends React.Component {
    render() {
        return (
            <div>
                {i}
            </div>
        );
    }
}