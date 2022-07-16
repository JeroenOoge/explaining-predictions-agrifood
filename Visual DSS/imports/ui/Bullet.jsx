import React from 'react';

class Bullet extends React.Component {
  render() {
    return (
      <span role="img" aria-label={this.props.ariaLabel} className="optionLabel" style={{background: this.props.colour}} />
    );
  }
}

export default Bullet;
