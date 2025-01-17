import React, { useContext, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import Tooltip from '../Tooltip'
import StyledButton from '../input/StyledButton'
import { getTruncatedPeerId } from './utils'
import { RootNodeContext } from '../context/RootNodeProvider'
import { copyToClipboard } from '../../utils/helpers'

const SegmentedPeerId = styled.div`
  padding-top: ${({ theme }) => theme.spacing()};
  font-family: plex-mono;
  font-size: 9pt;
  font-weight: 300;
  color: ${({ theme }) => theme.color('text', 1)};
  cursor: text;
  user-select: text;
`

const TruncatedSegment = styled.span`
  font-weight: 500;
`

function getPeerSegment(segmentText, i, isFirst) {
  if (!isFirst)
    return (
      <span key={`segment-${i}`}>
        {segmentText}
        <wbr />
      </span>
    )

  const truncated = getTruncatedPeerId(segmentText)
  const mainSegment = segmentText.slice(truncated.length)

  return (
    <span key={`segment-${i}`}>
      <TruncatedSegment>{truncated}</TruncatedSegment>
      {mainSegment}
    </span>
  )
}

function PeerIdTooltip({ peerId, children, override = {} }) {
  const [isCopied, setIsCopied] = useState(false)
  const rootNodeRef = useContext(RootNodeContext)

  const segmentsCount = 4
  const segmentsLength = Math.round(peerId.length / segmentsCount) // Usually 64 / 4 = 16
  const peerIdSegments = []
  let i = 0
  while (i < segmentsCount) {
    const isFirst = i === 0
    const isLast = i + 1 === segmentsCount

    const segmentText = peerId.slice(
      segmentsLength * i,
      segmentsLength * (i + 1)
    )
    peerIdSegments.push(getPeerSegment(segmentText, i, isFirst))
    if (!isLast) peerIdSegments.push(<wbr key={`break-${i}`} />)

    i++
  }

  const copyPeerId = () => {
    copyToClipboard(peerId)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1750)
  }

  const copyButtonText = isCopied
    ? `Copied "…${getTruncatedPeerId(peerId)}"`
    : 'COPY PEER ID'

  return (
    <Tooltip
      side="right"
      containerRef={rootNodeRef}
      override={override}
      hang={2}
      content={
        <>
          <StyledButton
            isActive={isCopied}
            onClick={copyPeerId}
            as={override.StyledButton}
          >
            {copyButtonText}
          </StyledButton>
          <SegmentedPeerId as={override.StyledButton}>
            {peerIdSegments}
          </SegmentedPeerId>
        </>
      }
    >
      {children}
    </Tooltip>
  )
}

PeerIdTooltip.propTypes = {
  peerId: T.string.isRequired,
  children: T.node,
  override: T.object,
}

export default PeerIdTooltip
