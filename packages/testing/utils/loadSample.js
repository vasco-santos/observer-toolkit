import { parseImport } from '@libp2p-observer/data'

const defaultFilename = 'sample-1min.mock'

/* global require */
function loadSample(filename = defaultFilename) {
  if (typeof require !== 'function')
    throw new Error('loadSample() is only to be used in Node.js test runners')

  const { readFileSync } = require('fs')
  const path = require('path')
  const samplesPath = require.resolve('@libp2p-observer/samples')
  const sampleFilePath = path.resolve(
    path.dirname(samplesPath),
    'samples',
    filename
  )
  const sampleData = parseImport(readFileSync(sampleFilePath))
  return sampleData
}

export default loadSample