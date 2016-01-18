import Themes from './Themes'
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import invariant from 'fbjs/lib/invariant';
import _ from 'lodash';
import React, {Platform} from 'react-native';
import addStyles from 'style-loader/addStyles';
import CSSPropertyOperations from 'react/lib/CSSPropertyOperations';

let stylesId = 0;
let cssRefsCounters = {};

export default class Styles {
  static create(s) {
    if (!s.hasOwnProperty("_id")) {
      return s._ref = new Styles(s);
    } else {
      return s._ref;
    }
  }

  static linkRefs(styles, element, props, context, isMain) {
    let ref = isMain ? 'main' : element.ref;
    let extraProps = {};

    if (Platform.OS !== "web") {
      extraProps.style = styles.getStyle(ref, props);
    } else {
      var classes = styles.getClassNames(ref, props).join(" ");
      if (classes.length > 0) {
        extraProps.className = _.trim((element.props.className ? element.props.className : "") + " " + classes);
      }
    }

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
    s._id = stylesId++;
    invariant((_.isPlainObject(s) || _.isFunction(s) || _.isArrayLike(s)),
      "Style must be plain object, function or array");
  }

  use(themeName) {
    this.theme = themeName;
    let theme = Themes.get(themeName);
    this._raw._uses = this._raw._uses || {};
    this._raw._uses[theme.id] = this._raw._uses[theme.id] || {};
    this._raw._uses[theme.id].count = this._raw._uses[theme.id].count || 0;
    if (++this._raw._uses[theme.id].count == 1) {
      this._build(this._raw._uses[theme.id], theme);
    }

    if (Platform.OS === "web") {
      let styles = this._stylesToString();
      if (canUseDOM) {
        let id = "s" + this._raw._id + "t" + theme.id;
        cssRefsCounters[id] = (typeof cssRefsCounters[id] !== "undefined") ? ++cssRefsCounters[id] : 1;
        if (cssRefsCounters[id] === 1) {
          let style = document.createElement('style');
          style.setAttribute("data-css-id", id);
          style.type = 'text/css';
          style.innerHTML = styles;
          document.getElementsByTagName('head')[0].appendChild(style);
        }
      } else {
        // write css file
      }
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
    return ("s" + stylesId + "__" + "t" + themeId + "__" + name).replace("-", "_");
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

  _stylesToString() {
    let styles = [];
    for (let styleKey in this._style) {
      if (styleKey.startsWith("_")) {
        continue;
      }
      let style = this._style[styleKey];
      styles.push("." + style.local + "{");
      styles.push(CSSPropertyOperations.createMarkupForStyles(style.styles));
      styles.push("}\n");
      for (let conditionStyleKey in style.conditionStyles) {
        let conditionStyle = style.conditionStyles[conditionStyleKey];
        styles.push("." + conditionStyle.local + "{");
        styles.push(CSSPropertyOperations.createMarkupForStyles(conditionStyle.style));
        styles.push("}\n");
      }
    }
    return styles.join("");
  }


  unuse() {
    let theme = Themes.get(this.theme);
    this.theme = void(0);
    if (Platform.OS === "web" && canUseDOM) {
      let id = "s" + this._raw._id + "t" + theme.id;
      cssRefsCounters[id] = --cssRefsCounters[id];
      if (cssRefsCounters[id] === 0) {
        let style = document.querySelectorAll("style[data-css-id='" + id + "']");
        style[0].parentNode.removeChild(style[0]);
      }
    }
  }

  update(theme) {

  }
}
