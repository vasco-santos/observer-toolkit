import React, { useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { getStateTimes, getTimeIndex } from '@libp2p-observer/data'
import { DataContext, TimeContext } from '@libp2p-observer/sdk'

const ExampleStyledHeader = styled.h2`
  ${({ theme }) => theme.text('body', 'large')}
`

const ExampleStyledContent = styled.div`
  background: ${({ theme }) => theme.color('background', 1)};
  border-radius: ${({ theme }) => theme.spacing()};
  padding: ${({ theme }) => theme.spacing(2)};
`

function $WIDGET_COMPONENT({ children }) {
  // Function component logic here
  // Use the React Hooks model, see https://reactjs.org/docs/hooks-intro.html
  const timepoints = useContext(DataContext)
  const currentTimepoint = useContext(TimeContext)

  const { start, end } = getStateTimes(currentTimepoint)
  const timeIndex = getTimeIndex(timepoints, end)

  // Allow user to try out data object methods in console
  window.data = { start, end, currentTimepoint, timepoints }

  /* eslint-disable-next-line no-console */
  console.log('window.data: ', window.data)

  return (
    <ExampleStyledContent>
      <ExampleStyledHeader>Hello $WIDGET_COMPONENT</ExampleStyledHeader>
      <p>
        Time point <b>{timeIndex + 1}</b> of {timepoints.length} is selected,
        containing data from <b>{new Date(start).toLocaleString()}</b> to{' '}
        <b>{new Date(end).toLocaleString()}</b>.
      </p>
      <p>Open your browser's console to explore all available data.</p>
      {children}
    </ExampleStyledContent>
  )
}

$WIDGET_COMPONENT.propTypes = {
  children: T.node,
}

export default $WIDGET_COMPONENT