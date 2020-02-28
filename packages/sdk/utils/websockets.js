import { parseBufferList } from '@libp2p-observer/data'
import { proto } from '@libp2p-observer/proto'
import { BufferList } from 'bl'

let ws = null

function createClientSignalMessage(
  signal,
  datasource = proto.ClientSignal.DataSource.STATE
) {
  if (!signal) return
  const clientSignal = new proto.ClientSignal()
  clientSignal.setVersion(new proto.Version(1))
  clientSignal.setSignal(signal)
  clientSignal.setDataSource(datasource)
  return clientSignal.serializeBinary()
}

function getSignal(cmd) {
  if (cmd === 'data') return proto.ClientSignal.Signal.SEND_DATA
  if (cmd === 'start') return proto.ClientSignal.Signal.START_PUSH_EMITTER
  if (cmd === 'stop') return proto.ClientSignal.Signal.STOP_PUSH_EMITTER
  if (cmd === 'pause') return proto.ClientSignal.Signal.PAUSE_PUSH_EMITTER
  if (cmd === 'unpause') return proto.ClientSignal.Signal.UNPAUSE_PUSH_EMITTER
  throw new Error(`Unrecognised signal type "${cmd}"`)
}

function sendSignal(cmd) {
  const signal = getSignal(cmd)
  const data = createClientSignalMessage(signal)
  if (ws && data) {
    ws.send(data)
  }
}

function uploadWebSocket(url, onUploadStart, onUploadFinished, onUploadChunk) {
  const bl = new BufferList()
  const usePushEmitter = true

  if (!url) return
  ws = new WebSocket(url)

  ws.addEventListener('message', function(msg) {
    // process incoming message
    if (msg.data) {
      const buf = new Buffer(msg.data, 'binary')
      bl.append(buf.slice(4))
      processUploadBuffer(bl, onUploadChunk)
    }

    if (!usePushEmitter) {
      // request data manually
      setTimeout(() => {
        sendSignal('data')
      }, 1000)
    }
  })
  ws.addEventListener('close', function() {
    if (onUploadFinished) onUploadFinished(url)
  })
  ws.addEventListener('open', function() {
    if (onUploadStart) onUploadStart(url)
    if (usePushEmitter) {
      sendSignal('start')
    } else {
      sendSignal('data')
    }
  })
}

function processUploadBuffer(bufferList, onUploadChunk, metadata) {
  const data = parseBufferList(bufferList)
  onUploadChunk(data)
}

export { sendSignal, uploadWebSocket }