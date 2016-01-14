class Theme {
  constructor() {
    this.id = 1;
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
    return new Theme();
  }
}

