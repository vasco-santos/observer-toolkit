import React, { useContext } from 'react'
import T from 'prop-types'

import {
  getListFilter,
  getRangeFilter,
  getStringFilter,
  DataContext,
  FilterProvider,
  RuntimeContext,
  TimeContext,
} from '@libp2p/observer-sdk'
import { getEventType } from '@libp2p/observer-data'

function WidgetContext({ children }) {
  const runtime = useContext(RuntimeContext)
  const states = useContext(DataContext)
  const currentState = useContext(TimeContext)

  const firstStateTime = (states[0] && states[0].getInstantTs()) || 0
  const lastStateTime = currentState ? currentState.getInstantTs() : 0

  const filterDefs = [
    getRangeFilter({
      name: 'Filter by time',
      mapFilter: msg => (msg.getTs ? msg.getTs() : 0),
      min: firstStateTime,
      max: lastStateTime,
      stepInterval: 1,
      numberFieldType: 'time',
    }),
    getListFilter({
      name: 'Filter event types',
      mapFilter: msg => {
        if (!msg.getType) return null
        const eventType = getEventType(msg)
        return eventType || null
      },
      valueNames: runtime
        ? runtime.getEventTypesList().map(type => type.getName())
        : [],
    }),
    getStringFilter({
      name: 'Filter JSON string',
      mapFilter: msg => msg.getContent(),
    }),
  ]

  return <FilterProvider filterDefs={filterDefs}>{children}</FilterProvider>
}

WidgetContext.propTypes = {
  children: T.node,
}

export default WidgetContext
