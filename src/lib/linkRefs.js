import React, {
  Component,
  PropTypes,
} from 'react-native';

export default function linkRefs(style, element, props, context, isMain) {
  let ref = isMain ? 'main' : element.ref;

  let extraProps = {};
  for (let selector of Object.keys(style)) {
    var selectorSplit = selector.split(':');
    if (selectorSplit[0] == ref) {
      let match = true;
      for (let selectorIndex = 1; selectorIndex < selectorSplit.length; selectorSplit++) {
        let selectorRuleSplit = selectorSplit[selectorIndex].split("-");
        if (selectorRuleSplit[0][0] == "!") {
          selectorRuleSplit[0] = selectorRuleSplit[0].substring(1);
        }
        let ruleMatch = !((selectorRuleSplit.length == 2 && props[selectorRuleSplit[1]]) || props[selectorRuleSplit[1]] == selectorRuleSplit[2]);
        ruleMatch = selectorRuleSplit[0] != 'is' ? !ruleMatch : ruleMatch;
        if (ruleMatch) {
          match = false;
          break;
        }
      }
      if (!match) {
        continue;
      }
      extraProps.style = {...extraProps.style, ...style[selector]};
    }
  }

  extraProps.style = {...extraProps.style, ...element.props.style};

  let newChildren =
    React.isValidElement(element.props.children)
      ?
      linkRefs(style, React.Children.only(element.props.children), props, context, false)
      :
      React.Children.map(element.props.children, element =>
        React.isValidElement(element)
          ?
          linkRefs(style, element, props, context, false)
          :
          element
      );

  return React.cloneElement(element, extraProps, newChildren);
}
