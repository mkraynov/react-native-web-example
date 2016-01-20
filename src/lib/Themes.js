import invariant from 'fbjs/lib/invariant';
import _ from 'lodash';

let id = 0;
let themesRepo = {};
let defaultRegistered = false;

class Theme {
  _props: {}

  constructor(name, props) {
    if (themesRepo[name]) {
      return themesRepo[name];
    } else {
      this._id = id++;
      this._name = name;
      themesRepo[name] = this;
    }
    if ("default" !== name && !Themes.get()) {
      console.error("Register default theme first");
    }
    this._add(Themes.get()._props);
    this._add(props);
  }

  toString() {
    return JSON.stringify(this._props);
  }

  get(expression, defaultValue) {
    try {
        let result = eval("this._props." + expression);
        if (typeof result === 'undefined') {
          return defaultValue;
        }
        return result;
    } catch (e) {
      return defaultValue;
    }
  }

  _add(p) {
    for (let pKey in p) {
      if (pKey.startsWith("_")) {
        continue;
      }
      let prop = p[pKey];
      if (_.isFunction(prop)) {
        prop = prop(this);
      }
      let props = {};
      props[pKey] = prop;
      this._props = {...this._props, ...props};
    }
  }
}

export default class Themes {
  static get(name = "default") {
    return themesRepo[name];
  }

  static register(p) {
    if (defaultRegistered) {
      console.error("You can not register default theme more than once");
    }

    themesRepo["default"] = new Theme("default", Themes._validateThemeProps(p));

    defaultRegistered = true;
  }

  static override(themeName, p) {
    let theme = Themes.get(themeName);
    let props = Themes._validateThemeProps(p);

    if (!theme) {
      theme = new Theme(themeName, props);
    } else {
      theme._add(props)
    }

    return this;
  }

  static _validateThemeProps(p) {
    invariant((_.isPlainObject(p) || _.isFunction(p)),
      "Theme styles must be plain object or function");

    let props = p;

    if (_.isFunction(p)) {
      props = p();
      invariant(_.isPlainObject(props), "Theme styles function must return plain object");
    }

    return props;
  }
}
