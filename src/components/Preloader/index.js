import React from 'react'
import PreloaderIcon, { ICON_TYPE } from 'react-preloader-icon'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`

const Preloader = () => (
  <Container>
    <PreloaderIcon
      type={ICON_TYPE.PUFF}
      size={60}
      strokeWidth={4}
      strokeColor="#e15345"
      duration={900}
    />
  </Container>
)

export default Preloader
