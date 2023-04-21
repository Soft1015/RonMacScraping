import React from "react";

  const circleStyle = {
    backgroundColor: '#d83b01',
    borderRadius: '50%',
    color: '#fff',
    height: '2.5em',
    position: 'relative',
    width: '2.5em',
    border: '1px solid transparent'
  };

const MyMarker = ({ text, tooltip, $hover }) => {
  const handleClick = () => {
    console.log(`You clicked on ${tooltip}`);
  };

  return (
    <div style={circleStyle}>
      <span className="circleText" title={tooltip}>
        {text}
      </span>
    </div>
  );
};

export default MyMarker;
