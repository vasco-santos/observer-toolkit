import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import waitForExpect from 'wait-for-expect'

import {
  renderWithData,
  renderWithShell,
  loadSample,
  within,
} from '@libp2p-observer/testing'

import SamplesList from './SamplesList'

describe('SamplesList', () => {
  it('renders as expected', () => {
    const { asFragment } = renderWithData(<SamplesList />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('loads sample datasets, updating shell content', async () => {
    const mockFn = jest.fn()

    const { findByText, getByText } = renderWithShell(
      <SamplesList onLoad={mockFn} />
    )
    const {
      data: { runtime },
    } = loadSample()
    const peerId = runtime.getPeerId()

    const getCurrentPeerId = async () => {
      const shellPeerIdButton = await findByText(/^peer id —/i)
      await act(async () => {
        await fireEvent.mouseEnter(shellPeerIdButton)
      })

      const tooltip = await within(shellPeerIdButton).findByRole('tooltip')
      const tooltipText = tooltip.textContent
      const button = within(tooltip).getByRole('button')
      const buttonText = button.textContent
      const currentPeerId = tooltipText.replace(buttonText, '')

      await act(async () => {
        await fireEvent.mouseLeave(shellPeerIdButton)
      })
      return currentPeerId
    }

    expect(await getCurrentPeerId()).toEqual(peerId)

    // Loading a different sample loads a different Peer ID
    const sample2MinButton = getByText('2 minutes')
    await act(async () => {
      await fireEvent.click(sample2MinButton)
      await waitForExpect(() => {
        expect(mockFn).toHaveBeenCalledTimes(1)
      })
    })
    expect(await getCurrentPeerId()).not.toEqual(peerId)

    // Loading the original sample loads the original Peer ID
    const sample1MinButton = getByText('1 minute')
    await act(async () => {
      await fireEvent.click(sample1MinButton)
      await waitForExpect(() => {
        expect(mockFn).toHaveBeenCalledTimes(2)
      })
    })
    expect(await getCurrentPeerId()).toEqual(peerId)
  })
})