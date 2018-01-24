import React from 'react'

const Svg = ({ children, width, height, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    className={className}
    role="presentation"
  >
    {children}
  </svg>
)

export default Svg
