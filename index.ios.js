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
import Theme from './src/components/Theme';
import Themes from './src/lib/Themes';

var ReactNativeWebExample = React.createClass({
  render: function () {
    Themes.register({
      "brandColorDefault": "red",
      "brandColorAccent": "blue"
    });

    Themes.override("dark", {
      "brandColorDefault": (t)=>{ return t.get("brandColorDefault", "black") }
    });

    return (
      <View style={styles.container}>
        {
          !this.state.closed &&
          <Test open={true}>
            <Text style={styles.welcome} onClick={this.onClick}>
              Welcome to React Native!
            </Text>
          </Test>
        }
        {
          !this.state.closed2 &&
          <Test open={"false"}>
            <Text style={styles.welcome} onClick={this.onClick2}>
              Welcome to React Native!!
            </Text>
          </Test>
        }
        {
          <Theme name="dark">
            <Test open={true}>
              <Text style={styles.welcome}>
                Welcome to React Native!!!
              </Text>
            </Test>
          </Theme>
        }
      </View>
    );
  },
  getInitialState: function() {
    return {
      "closed": false,
      "closed2": false
    }
  },
  onClick: function(){
    this.setState({
      "closed": true,
      "closed2": false
    });
  },
  onClick2: function(){
    this.setState({
      "closed": true,
      "closed2": true
    });
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
