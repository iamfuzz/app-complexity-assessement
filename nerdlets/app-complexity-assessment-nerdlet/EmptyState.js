import React from 'react';
import PropTypes from 'prop-types';
import { Stack, StackItem } from 'nr1';

export default class EmptyState extends React.Component {
  static propTypes = {
    heading: PropTypes.string,
    description: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { heading, description } = this.props;
    return (
      <center><br/><br/><h3>Please select an account and enter its corresponding query key in the fields above. Then click the <b>Query</b> button to render the results of your complexity assessment.<br/><br/>Please note that it can take up to 30 seconds for the results to load.</h3></center>
    );
  }
}
