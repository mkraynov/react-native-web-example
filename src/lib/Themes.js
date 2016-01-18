let id = 0;
let themesRepo = {};

class Theme {
  constructor(name) {
    if (themesRepo[name]) {
      return themesRepo[name];
    } else {
      this.id = id++;
      themesRepo[name] = this;
    }

  }

  get(expression, defaultValue) {
    try {
        let result = eval("this." + expression);
        if (typeof result === 'undefined') {
          return defaultValue;
        }
        return result;
    } catch (e) {
      return defaultValue;
    }
  }
}

export default class Themes {
  static get(name = "default") {
    return new Theme(name);
  }
}

