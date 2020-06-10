import { useCallback, useContext, useMemo, useRef } from 'react'

import {
  getDhtPeers,
  getDhtQueries,
  getStateTimes,
} from '@nearform/observer-data'
import {
  EventsContext,
  FilterContext,
  TimeContext,
} from '@nearform/observer-sdk'

function getQueriesByPeerId(events, currentState, toTs, applyFilters) {
  const queriesByPeerId = getDhtPeers(currentState).reduce(
    (keyed, peer) => ({
      ...keyed,
      [peer.getPeerId()]: { INBOUND: [], OUTBOUND: [] },
    }),
    {}
  )

  // If necessary for performance, could use useReducer and append queries from new states
  const queries = getDhtQueries(events, { toTs }).filter(applyFilters)

  for (const query of queries) {
    for (const peerId of query.peerIds) {
      const peerQueries = queriesByPeerId[peerId]
      if (peerQueries) {
        peerQueries[query.direction].push(query)
      }
    }
  }

  return queriesByPeerId
}

function useDhtQueries() {
  const events = useContext(EventsContext)
  const currentState = useContext(TimeContext)
  const { applyFilters } = useContext(FilterContext)
  const timestamp = getStateTimes(currentState).end

  const eventsRef = useRef({
    timestamp,
    events,
  })

  // Don't look at new events until we have a new timestamp
  if (timestamp !== eventsRef.current.timestamp) {
    eventsRef.current = { events, timestamp }
  }
  const getEvents = useCallback(() => eventsRef.current.events, [eventsRef])

  const queriesByPeerId = useMemo(
    () =>
      getQueriesByPeerId(getEvents(), currentState, timestamp, applyFilters),
    [getEvents, currentState, timestamp, applyFilters]
  )

  return queriesByPeerId
}

export default useDhtQueries
