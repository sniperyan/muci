import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

@connect(
  state => ({
    
  }),
  {},
)
class About extends PureComponent {
  static propTypes = {
   
  }
  componentWillMount() {}
  render() {
    return (
      <div>
        <h1>About</h1>
        <Link to="/home">To Home</Link>
      </div>
    );
  }
}

export default About;
