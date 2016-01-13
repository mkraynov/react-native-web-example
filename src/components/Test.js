import React, {
    Component,
    View,
    Text,
} from 'react-native';

export default class Test extends Component {
    render() {
        return (
            <View>
                <Text style={{fontSize: 20, textAlign: 'center'}}>Welcome to React Native in Web!</Text>
                {this.props.children}
            </View>
        )
    }
}