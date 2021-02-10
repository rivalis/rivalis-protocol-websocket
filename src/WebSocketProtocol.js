import { Server as WSServer, ServerOptions } from 'ws'
import { Protocol } from '@rivalis/core'

class WebSocketProtocol extends Protocol {
    
    /**
     * @private
     * @type {WSServer}
     */
    server = null

    /**
     * 
     * @type {ServerOptions}
     */
    options = null

    /**
     * 
     * @param {ServerOptions} options 
     */
    constructor(options) {
        super()
        this.options = options
    }

    initialize() {
        this.server = new WSServer(this.options)
        this.server.on('connection', socket => {
            const connection = this.connect()
            
            connection.onmessage = message => socket.send(message)
            connection.onclose = message => {
                socket.send(message, () => {
                    socket.close()
                })
            }

            socket.on('close', () => connection.handle('close'))
            socket.on('error', () => connection.handle('error'))
            socket.on('message', message => connection.handle('message', message))
        })
    }
}

export default WebSocketProtocol