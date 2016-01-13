import React, {
    Component,
    View,
    Text,
} from 'react-native';

export default class Test extends Component {
    render() {
        return (
            <View>{this.props.children}</View>
        )
    }
}