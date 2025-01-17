import React from 'react'
import T from 'prop-types'

import { ActiveWidget } from '@libp2p/observer-shell'
import { name, description } from './metadata'
import WidgetContext from './components/context/WidgetContext'
import DhtBuckets from './components/DhtBuckets'

function Widget({ closeWidget }) {
  return (
    <WidgetContext>
      <ActiveWidget
        name={name}
        description={description}
        closeWidget={closeWidget}
      >
        <DhtBuckets />
      </ActiveWidget>
    </WidgetContext>
  )
}

Widget.propTypes = {
  closeWidget: T.func,
}

export default Widget
