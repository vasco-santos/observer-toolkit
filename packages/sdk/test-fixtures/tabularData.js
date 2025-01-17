import React from 'react'
import T from 'prop-types'
import { getStringSorter, getNumericSorter } from '../sorters'

const _mockState_1 = [
  { mockName: 'a', mockNumber: 3, mockBool: true, mockPercentCalc: 5 },
  { mockName: 'c', mockNumber: 2, mockBool: true, mockPercentCalc: 10 },
  { mockName: 'b', mockNumber: 4, mockBool: false, mockPercentCalc: 20 },
  { mockName: 'e', mockNumber: 1, mockBool: false, mockPercentCalc: 14 },
  { mockName: 'd', mockNumber: 5, mockBool: true, mockPercentCalc: 1 },
]

const _mockState_0 = [
  Object.assign({}, _mockState_1[4]),
  Object.assign({}, _mockState_1[3]),
  Object.assign({}, _mockState_1[2]),
  Object.assign({}, _mockState_1[1], { mockNumber: 0 }),
  Object.assign({}, _mockState_1[0]),
]

const mockStates = [_mockState_0, _mockState_1]

const _mockState_2 = [
  Object.assign({}, _mockState_1[4]),
  Object.assign({}, _mockState_1[3]),
  Object.assign({}, _mockState_1[2]),
  Object.assign({}, _mockState_1[1], { mockNumber: 3 }),
  Object.assign({}, _mockState_1[0], { mockBool: false }),
]

const _mockState_3 = [
  Object.assign({}, _mockState_2[4], { mockNumber: 7 }),
  Object.assign({}, _mockState_2[3], { mockPercentCalc: 14 }),
  Object.assign({}, _mockState_2[2]),
  Object.assign({}, _mockState_2[1], { mockNumber: 4 }),
  Object.assign({}, _mockState_2[0], { mockBool: true, mockPercentCalc: 5 }),
]

const _mockState_4 = [
  Object.assign({}, _mockState_3[4], { mockNumber: 9 }),
  Object.assign({}, _mockState_3[3], { mockPercentCalc: 15 }),
  Object.assign({}, _mockState_3[2]),
  Object.assign({}, _mockState_3[1], { mockNumber: 5 }),
  Object.assign({}, _mockState_3[0], { mockBool: false, mockPercentCalc: 7 }),
  { mockName: 'b2', mockNumber: 6, mockBool: true, mockPercentCalc: 12 },
  { mockName: 'c2', mockNumber: 8, mockBool: false, mockPercentCalc: 18 },
]

const longerMockStates = [
  _mockState_0,
  _mockState_1,
  _mockState_2,
  _mockState_3,
  _mockState_4,
]

const _MockBoolRenderer = function({ boolProp, value }) {
  return boolProp ? <em>{value}</em> : <strong role="alert">{value}</strong>
}
_MockBoolRenderer.propTypes = {
  boolProp: T.bool.isRequired,
  value: T.string.isRequired,
}

const stringSorter = {
  getSorter: getStringSorter,
  defaultDirection: 'asc',
}

const numericSorter = {
  getSorter: getNumericSorter,
  defaultDirection: 'desc',
}

const mockColumnDefs = [
  {
    name: 'mockName',
    sort: stringSorter,
    header: <strong>Name of item</strong>,
    rowKey: 'value',
  },
  {
    name: 'mockNumber',
    sort: numericSorter,
    align: 'right',
    header: 'Numeric cells',
  },
  {
    name: 'mockBool',
    getProps: ({ mockBool }) => ({
      value: mockBool ? 'okay' : 'ALERT!',
      boolProp: mockBool,
    }),
    renderContent: _MockBoolRenderer,
  },
  {
    name: 'mockPercentCalc',
    getProps: ({ mockPercentCalc }, metadata) => {
      const percent = Math.round(
        (mockPercentCalc / metadata.percentTotal) * 100
      )
      return {
        value: `${percent}%`,
        sortValue: mockPercentCalc,
      }
    },
    sort: numericSorter,
  },
]

export { mockStates, mockColumnDefs, longerMockStates }
