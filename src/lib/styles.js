import React, {
  Component,
  PropTypes,
} from 'react-native'

let styleIdIndex = 0;

function linkRefs(style, element, props, context, isMain) {
  let ref = isMain ? 'main' : element.ref;

  console.log(ref);

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

export default () => {
  return (ComponentType) => {
    console.log(ComponentType);
    ComponentType.__style__id = styleIdIndex++;
    let render = ComponentType.prototype.render;
    ComponentType.prototype.render = function () {
      return linkRefs(typeof ComponentType.styles === 'function' ? ComponentType.styles() : {}, render.call(this), this.props, this.context, true);
    };
    return ComponentType;
  }
}
