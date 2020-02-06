import { parseBufferList } from '@libp2p-observer/data'
import { BufferList } from 'bl'

function uploadDataFile(file, onUploadStart, onUploadFinished, onUploadChunk) {
  if (!file) return

  const blobSlice = Blob.prototype.slice
  const versionFieldSize = 4
  const chunkSize = 1000 * 1024
  const chunks = Math.ceil((file.size - versionFieldSize) / chunkSize)
  const reader = new FileReader()
  const bl = new BufferList()

  let currentChunk = 0

  reader.onload = e => {
    const metadata = { type: 'upload', name: file.name }
    if (currentChunk <= chunks) {
      const buf = Buffer.from(event.currentTarget.result)
      if (currentChunk > 0) {
        bl.append(buf)
        processUploadBuffer(bl, onUploadChunk, metadata)
      }
      const start = versionFieldSize + currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      reader.readAsArrayBuffer(blobSlice.call(file, start, end))
      currentChunk++
    } else {
      if (onUploadFinished) onUploadFinished(file)
    }
  }
  reader.readAsArrayBuffer(blobSlice.call(file, 0, versionFieldSize))
  if (onUploadStart) onUploadStart(file)
}

async function applySampleData(
  samplePath,
  onUploadStart,
  onUploadFinished,
  onUploadChunk = () => {}
) {
  if (onUploadStart) onUploadStart()

  const bl = new BufferList()
  const response = await fetch(samplePath)

  if (!response.ok) {
    const { status, statusText, url } = response
    throw new Error(`${status} "${statusText}" fetching data from ${url}`)
  }

  const arrbuf = await response.arrayBuffer()

  const metadata = {
    type: 'sample',
    name: samplePath.match(/[/|\\]?([^/|\\]*)$/)[1],
  }

  const buf = Buffer.from(arrbuf)
  bl.append(buf.slice(4))
  processUploadBuffer(bl, onUploadChunk, metadata)
  onUploadFinished()
}

function processUploadBuffer(bufferList, onUploadChunk, metadata) {
  const data = parseBufferList(bufferList)
  if (metadata && data.states) data.states.metadata = metadata
  onUploadChunk(data)
}

export { uploadDataFile, applySampleData }