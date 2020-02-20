import React from 'react'
import flatten from 'lodash.flatten'
import { act, fireEvent } from '@testing-library/react'

import { renderWithTheme } from '@libp2p-observer/testing'
import usePooledData from './usePooledData'

const data = [
  { a: -5.4, b: 12 },
  { a: -1.9, b: 5 },
  { a: -1.1, b: 14 },
  { a: -0.9, b: 3 },
  { a: 0.0, b: 16 },
  { a: 0.6, b: 1 },
  { a: 1.1, b: 18 },
  { a: 1.7, b: 9 },
  { a: 2.2, b: 10 },
  { a: 2.6, b: 7 },
  { a: 3.3, b: 12 },
  { a: 3.5, b: 5 },
  { a: 3.8, b: 14 },
  { a: 4.0, b: 3 },
  { a: 4.1, b: 16 },
  { a: 4.2, b: 1 },
  { a: 4.2, b: 18 },
  { a: 4.3, b: 9 },
  { a: 4.3, b: 10 },
  { a: 4.4, b: 7 },
  { a: 4.5, b: 12 },
  { a: 4.7, b: 5 },
  { a: 5.1, b: 14 },
  { a: 5.3, b: 3 },
  { a: 5.5, b: 16 },
  { a: 5.8, b: 1 },
  { a: 6.3, b: 18 },
  { a: 7.4, b: 9 },
  { a: 9.1, b: 10 },
  { a: 10.0, b: 7 },
].map(({ a, b }) => ({ a, b, c: a * b, d: Math.pow(b, a) }))

function lengthsToEntries(
  lengths,
  dataSource = data,
  sorters = [],
  recursionDepth = 0
) {
  const sorter = sorters[recursionDepth]
  const testData = [...dataSource]
  if (sorter) testData.sort(sorter)

  const { slices } = lengths.reduce(
    ({ cumulative, slices }, item) => {
      const start = cumulative

      if (Array.isArray(item)) {
        const sum = flatten(item).reduce((sum, num) => sum + num)
        const end = cumulative + sum
        const dataSubset = testData.slice(start, end)
        const nestedSlices = lengthsToEntries(
          item,
          dataSubset,
          sorters,
          recursionDepth + 1
        )
        return {
          slices: [...slices, nestedSlices],
          cumulative: end,
        }
      }

      const end = cumulative + item

      return {
        slices: [...slices, testData.slice(start, end)],
        cumulative: end,
      }
    },
    { cumulative: 0, slices: [] }
  )

  return slices
}

function entriesToLengths(entry) {
  return Array.isArray(entry[0]) ? entry.map(entriesToLengths) : entry.length
}

describe('usePooledData hook', () => {
  it('Gives reasonable buckets for just a simple numeric array', () => {
    const TestInComponent = () => {
      const testData = data.map(datum => datum.a)

      const { pooledData, poolSets } = usePooledData({
        data: testData,
      })

      expect(poolSets).toHaveLength(1)
      const pools = poolSets[0]
      expect(pooledData).toHaveLength(pools.length - 1)

      const expectedPools = [-6, -4, -2, 0, 2, 4, 6, 8, 10]
      expect(pools).toEqual(expectedPools)

      const expectedPooledLengths = [1, 0, 3, 4, 5, 13, 2, 2]
      expect(entriesToLengths(pooledData)).toEqual(expectedPooledLengths)

      const expectedPooledData = lengthsToEntries(
        expectedPooledLengths,
        testData
      )
      expect(pooledData).toEqual(expectedPooledData)

      return ''
    }
    renderWithTheme(<TestInComponent />)
  })

  it('gets data refs using a data mapping function', () => {
    const TestInComponent = () => {
      const map_a = datum => datum.a
      const { pooledData, poolSets } = usePooledData({
        data,
        poolings: {
          mapData: map_a,
          poolsCount: 4,
        },
      })

      const expectedPools = [[-10, -5, 0, 5, 10]]
      expect(poolSets).toEqual(expectedPools)

      const expectedPooledLengths = [1, 3, 18, 8]
      expect(entriesToLengths(pooledData)).toEqual(expectedPooledLengths)

      const expectedPooledData = lengthsToEntries(expectedPooledLengths)
      expect(pooledData).toEqual(expectedPooledData)

      return ''
    }
    renderWithTheme(<TestInComponent />)
  })

  it('correctly nests pools within pools', () => {
    const TestInComponent = () => {
      const map_a = datum => datum.a
      const map_b = datum => datum.b

      const { pooledData, poolSets } = usePooledData({
        data,
        poolings: [
          {
            mapData: map_a,
            poolsCount: 4,
          },
          {
            mapData: map_b,
            poolsCount: 2,
          },
        ],
      })

      const expectedPools = [
        [-10, -5, 0, 5, 10],
        [0, 10, 20],
      ]
      expect(poolSets).toEqual(expectedPools)

      const expectedPooledLengths = [
        [0, 1],
        [2, 1],
        [9, 9],
        [4, 4],
      ]
      expect(entriesToLengths(pooledData)).toEqual(expectedPooledLengths)

      const sorters = [
        null,
        (a, b) => {
          const aIsOver = a.b >= 10
          const bIsOver = b.b >= 10
          if (aIsOver === bIsOver) return a.a - b.a
          return aIsOver ? 1 : -1
        },
      ]
      const expectedPooledData = lengthsToEntries(
        expectedPooledLengths,
        data,
        sorters
      )

      expect(pooledData).toEqual(expectedPooledData)

      return ''
    }
    renderWithTheme(<TestInComponent />)
  })

  it('can pool logarithmically', () => {
    const testData = [...data]
    testData.sort((a, b) => a.d - b.d)

    const TestInComponent = () => {
      const map_d = datum => datum.d
      const { pooledData, poolSets } = usePooledData({
        data: testData,
        poolings: {
          mapData: map_d,
          poolsCount: 3,
          poolType: 'log',
        },
      })

      const expectedPools = [[1e-10, 0.00001, 1, 100000, 10000000000]]
      expect(poolSets).toEqual(expectedPools)

      const expectedPooledLengths = [1, 3, 19, 7]
      expect(entriesToLengths(pooledData)).toEqual(expectedPooledLengths)

      const expectedPooledData = lengthsToEntries(
        expectedPooledLengths,
        testData
      )
      expect(pooledData).toEqual(expectedPooledData)

      return ''
    }
    renderWithTheme(<TestInComponent />)
  })

  it('can update from outside the hook, causing re-render with new pools', async () => {
    const TestUsingComponent = () => {
      const map_a = datum => datum.a
      const map_b = datum => datum.b
      const map_c = datum => Math.round(datum.c)

      const { dispatchPoolings, pooledData } = usePooledData({
        data,
        poolings: {
          mapData: map_a,
          poolsCount: 4,
        },
      })

      return (
        <div>
          <button
            data-testid="edit"
            onClick={() =>
              dispatchPoolings({
                action: 'edit',
                poolings: {
                  mapData: map_b,
                  poolsCount: 2,
                },
              })
            }
          />

          <button
            data-testid="add"
            onClick={() =>
              dispatchPoolings({
                action: 'add',
                poolings: {
                  mapData: map_c,
                },
              })
            }
          />

          <button
            data-testid="remove"
            onClick={() =>
              dispatchPoolings({
                action: 'remove',
                index: 0,
              })
            }
          />

          <div data-testid="stringifiedPooledLengths">
            {JSON.stringify(entriesToLengths(pooledData))}
          </div>
        </div>
      )
    }
    const { getByTestId } = renderWithTheme(<TestUsingComponent />)

    const getOutput = () => getByTestId('stringifiedPooledLengths').textContent

    expect(getOutput()).toEqual(JSON.stringify([1, 3, 18, 8]))

    const editButton = getByTestId('edit')
    await act(async () => {
      fireEvent.click(editButton)
    })

    expect(getOutput()).toEqual(JSON.stringify([15, 15]))

    const addButton = getByTestId('add')
    await act(async () => {
      fireEvent.click(addButton)
    })

    expect(getOutput()).toEqual(
      JSON.stringify([
        [0, 0, 0, 2, 8, 3, 0, 2, 0, 0],
        [1, 0, 0, 1, 1, 2, 4, 3, 2, 1],
      ])
    )

    const removeButton = getByTestId('remove')
    await act(async () => {
      fireEvent.click(removeButton)
    })

    expect(getOutput()).toEqual(JSON.stringify([1, 0, 0, 3, 9, 5, 4, 5, 2, 1]))
  })
})