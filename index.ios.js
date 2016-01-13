/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    } = React;
import Test from './src/components/Test';

var ReactNativeWebExample = React.createClass({
    render: function () {
        return (
            <View style={styles.container}>
                <Test>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                </Test>
                <Text style={styles.instructions}>
                    To get started, edit index.ios.js
                </Text>
                <Text style={styles.instructions}>
                    Press Cmd+R to reload,{'\n'}
                    Cmd+D or shake for dev menu
                </Text>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('ReactNativeWebExample', () => ReactNativeWebExample);


if (Platform.OS == 'web') {
    var app = document.createElement('div');
    document.body.appendChild(app);

    AppRegistry.runApplication('ReactNativeWebExample', {
        rootTag: app
    })
}
