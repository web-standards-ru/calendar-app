import React from 'react'
import styled from 'styled-components'

const Footer = styled.div`
  text-align: center;
  a {
    color: #e15345;
    &:hover {
      text-decoration: none;
    }
  }
`
export default () => (
  <Footer>
    <a href="https://web-standards.ru/calendar.ics" target="_blank" rel="noopener noreferrer">
      Скачать календарь
    </a>
  </Footer>
)
