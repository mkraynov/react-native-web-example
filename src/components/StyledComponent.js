import React, {
  Component
} from 'react-native';

import linkRefs from '../lib/linkRefs';

export default class StyledComponent extends Component {
  constructor(...args) {
    super(...args);
    let render = this.render;
    this.render = () => linkRefs(this.props.styles, render.call(this), this.props, this.context, true);
  }
};
