import React, {
    Component,
    View,
    Text,
} from 'react-native';
import StyledComponent from './StyledComponent';

export default class Test extends StyledComponent {
    static styles() {
        return {
            color: 'red',
            fontSize: 10,
            textAlign: 'left',
        }
    }

    render() {
        return (
            <View>
                <Text ref="text">Welcome to React Native in Web!</Text>
                {this.props.children}
            </View>
        )
    }
}