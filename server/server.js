import { Server } from 'node-static'
import { createServer } from 'https'
import * as fs from 'fs'
import * as socketIO from 'socket.io'

const file = new Server('../client');

const privateKey = fs.readFileSync('../server.key').toString();
const certificate = fs.readFileSync('../server.crt').toString();

const options = {
  key: privateKey,
  cert: certificate,
  passphrase: 'e-grid'
}

// clientファイルのサービング
const app = createServer(options, file.serve.bind(file)).listen(443)
const io = new socketIO.Server(app)

// 全てのメッセージを全てのクライエントに送る作業
io
  .sockets
  .on('connection', socket => (
    socket.on('message', message => {
      console.log('message: ', message)
      console.log('id: ', socket.id)
      socket.broadcast.emit('message', message)
    })
  ));