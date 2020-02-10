import React, { useState, useRef, useEffect } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { withResizeDetector } from 'react-resize-detector'

import useCanvas from '../hooks'

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`

function CanvasCover({ width, height, animationGetter, children }) {
  const { canvasRef } = useCanvas({
    width,
    height,
    animationGetter,
  })

  return <Canvas ref={canvasRef} />
}

CanvasCover.propTypes = {
  width: T.number,
  height: T.number,
}

export default withResizeDetector(CanvasCover)