import React, {
  Component,
  View,
  Text,
} from 'react-native';
import StyledComponent from './StyledComponent';

export default class Test extends StyledComponent {
  render() {
    return (
      <View>
        <Text ref="text">Welcome to React Native in Web!</Text>
        {this.props.children}
      </View>
    )
  }
}

Test.defaultProps = {
  styles: [
    {
      text: {
        color: "blue",
        fontSize: 20,
      }
    },
    (t)=>({
      "text:is-open": {color: "yellow"}
    }),
    {
      "text:is-open": {
        "backgroundColor": "blue"
      }
    }
  ]
};
