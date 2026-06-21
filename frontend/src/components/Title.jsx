import React from 'react'

const Title = ({ text, level = 1, className = '' }) => {
  const Heading = `h${level}`;
  return (
    <Heading className={className}>
      {text}
    </Heading>
  )
}

export default Title