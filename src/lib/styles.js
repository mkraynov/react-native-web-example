import Themes from './Themes'
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import invariant from 'fbjs/lib/invariant';
import _ from 'lodash';
import React from 'react-native';

let stylesId = 0;

export default class Styles {
  static create(s) {
    return new Styles(s);
  }

  static linkRefs(styles, element, props, context, isMain) {
    let ref = isMain ? 'main' : element.ref;
    let extraProps = {};

    //if(web) {
    extraProps.style = styles.getStyle(ref, props);
    //} else {
    //console.log(element.props.className);
    var classes = styles.getClassNames(ref, props).join(" ");
    if(classes.length > 0) {
      extraProps.className = _.trim((element.props.className ? element.props.className : "") + " " + classes);
    }
    //}

    extraProps.style = {...extraProps.style, ...element.props.style};

    let newChildren =
      React.isValidElement(element.props.children)
        ?
        Styles.linkRefs(styles, React.Children.only(element.props.children), props, context, false)
        :
        React.Children.map(element.props.children, element =>
          React.isValidElement(element)
            ?
            Styles.linkRefs(styles, element, props, context, false)
            :
            element
        );

    return React.cloneElement(element, extraProps, newChildren);
  }

  constructor(s) {
    this._styles = [];
    this._style = null;
    this._raw = s;
    if (!s.hasOwnProperty("_id")) {
      s._id = stylesId++;
    }
    invariant((_.isPlainObject(s) || _.isFunction(s) || _.isArrayLike(s)),
      "Style must be plain object, function or array");
  }

  use(themeName) {
    let theme = Themes.get(themeName);
    this._raw._uses = this._raw._uses || {};
    this._raw._uses[theme.id] = this._raw._uses[theme.id] || {};
    this._raw._uses[theme.id].count = this._raw._uses[theme.id].count || 0;
    if (++this._raw._uses[theme.id].count == 1) {
      this._build(this._raw._uses[theme.id], theme);
    }
    return this;
  }

  _build(context, theme) {
    let style = {};
    this._initStyles(this._raw);
    for (let i = 0; i < this._styles.length; i++) {
      let themedStylesChunk = this._styles[i](theme);
      for (let refStyle in themedStylesChunk) {
        if (refStyle.startsWith("_")) {
          continue;
        }
        let split = refStyle.split(":");
        style[split[0]] = style[split[0]] || {
            "local": this._buildClassName(split[0], this._raw._id, theme.id),
            "styles": {},
            "conditionStyles": []
          };
        if (split.length === 1) {
          style[split[0]].styles = {...style[split[0]].styles, ...themedStylesChunk[refStyle]};
        } else {
          for (let i = 1; i < split.length; i++) {
            let conditionalRef = split[i].split("-"); //"is-open" -> ["is","open"];
            let conditionalStyle = {
              local: this._buildClassName(split[0] + "__" + split[i], this._raw._id, theme.id),
              not: conditionalRef[0] === "not",
              name: conditionalRef[1],
              value: typeof conditionalRef[2] !== "undefined" ? conditionalRef[2] : true,
              style: themedStylesChunk[refStyle]
            };
            style[split[0]].conditionStyles.push(conditionalStyle);
          }
        }
      }
    }
    this._style = style;
  }

  _buildClassName(name, stylesId, themeId) {
    return "s" + stylesId + "__" + "t" + themeId + "__" + name;
  }

  _initStyles(styles) {
    if (_.isFunction(styles)) {
      this._styles.push(styles);
    } else if (_.isPlainObject(styles)) {
      this._styles.push(()=>styles);
    } else if (_.isArrayLike(styles)) {
      for (let i = 0; i < styles.length; i++) {
        this._initStyles(styles[i]);
      }
    }
  }

  getStyle(name, props) {
    let style = this._style[name];
    let result = {};
    if (style) {
      result = style.styles;
      for (let conditionStyle of style.conditionStyles) {
        if (props.hasOwnProperty(conditionStyle.name) && props[conditionStyle.name] === conditionStyle.value && !conditionStyle.not) {
          result = {...result, ...conditionStyle.style};
        }
      }
    }
    return result;
  }

  getClassNames(name, props) {
    let style = this._style[name];
    let classNames = [];
    if (style) {
      classNames.push(style.local);
      for (let conditionStyle of style.conditionStyles) {
        classNames.push(conditionStyle.local);
      }
    }
    return _.uniq(classNames);
  }


  unuse() {

  }

  update(theme) {

  }
}
