import React from 'react'
import T from 'prop-types'
import { ThemeSetter, DataProvider, FilterProvider } from '@libp2p-observer/sdk'

function ContextWrappers({ children }) {
  return (
    <ThemeSetter>
      <FilterProvider>
        <DataProvider>{children}</DataProvider>
      </FilterProvider>
    </ThemeSetter>
  )
}
ContextWrappers.propTypes = {
  children: T.node,
}

export default ContextWrappers