import React, {
  Component
} from 'react-native'
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment'
import Styles from '../lib/Styles'

let theme = "default";
let i = 0;

export default class StyledComponent extends Component {
  constructor(...args) {
    super(...args);
    this.theme = theme + i++;
    let render = this.render;
    this.render = () => {
      //this._styles.update(this.context.theme);
      return Styles.linkRefs(this._styles, render.call(this), this.props, this.context, this.theme, true);
    }
  }

  componentWillMount() {
    this._styles = Styles.create(this.props.styles).use(this.theme);
  }

  componentWillUnmount() {
    this._styles.unuse();
  }
};
